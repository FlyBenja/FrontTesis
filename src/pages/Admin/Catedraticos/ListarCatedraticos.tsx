import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticos } from '../../../ts/Admin/GetCatedraticos';
import { getCatedraticoPorCarnet } from '../../../ts/Admin/GetCatedraticosCarnet';
import { activaCatedratico } from '../../../ts/Admin/ActivarCatedraticos';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../../components/Switchers/SwitcherFour';
import Swal from 'sweetalert2';

// Interface to define the structure of a professor's data
interface Catedratico {
  user_id: number; // Unique identifier for the professor
  email: string; // Professor's email address
  userName: string; // Professor's name
  professorCode: string; // Unique professor code
  profilePhoto: string | null; // Profile photo URL or null if not available
  active: boolean; // Status if the professor is active or not
}

const ListarCatedraticos: React.FC = () => {
  // State hooks for managing various aspects of the component
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]); // List of professors
  const [searchCarnet, setSearchCarnet] = useState(''); // Search input for the professor code
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination
  const [catedraticosPerPage, setCatedraticosPerPage] = useState(5); // Number of professors per page for pagination
  const [maxPageButtons, setMaxPageButtons] = useState(10); // Maximum number of page buttons to display in pagination

  // Effect hook to handle window resize and adjust page settings accordingly
  useEffect(() => {
    const handleResize = () => {
      // If screen width is less than 768px, display 8 items per page and 5 page buttons
      if (window.innerWidth < 768) {
        setCatedraticosPerPage(8);
        setMaxPageButtons(5);
      } else {
        // Otherwise, display 5 items per page and 10 page buttons
        setCatedraticosPerPage(5);
        setMaxPageButtons(10);
      }
    };

    handleResize(); // Call it once on mount to set the initial values
    window.addEventListener('resize', handleResize); // Add resize event listener to handle changes

    return () => window.removeEventListener('resize', handleResize); // Clean up the event listener on unmount
  }, []);

  // Effect hook to fetch the profile data and professors data when the component is mounted
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfil = await getDatosPerfil(); // Fetch profile data
        if (perfil.sede) {
          fetchCatedraticos(perfil.sede); // If profile has 'sede', fetch the professors for that sede
        }
      } catch {
        setCatedraticos([]); // If there's an error, set empty list of professors
      }
    };

    fetchPerfil(); // Call the fetchPerfil function
  }, []);

  // Function to fetch the list of professors based on the sede ID
  const fetchCatedraticos = async (sedeId: number) => {
    try {
      const catedraticosRecuperados = await getCatedraticos(sedeId); // Fetch professors based on the sede ID
      setCatedraticos(Array.isArray(catedraticosRecuperados) ? catedraticosRecuperados : []); // Update the state if the response is an array
    } catch {
      setCatedraticos([]); // If there's an error, set empty list of professors
    }
  };

  // Function to handle search click (search professors by carnet code)
  const handleSearchClick = async () => {
    if (searchCarnet.trim()) { // If the search input is not empty
      try {
        const catedraticoEncontrado = await getCatedraticoPorCarnet(searchCarnet); // Search the professor by carnet code
        setCatedraticos(catedraticoEncontrado ? [catedraticoEncontrado] : []); // Set the result or empty list if no professor is found
      } catch {
        setCatedraticos([]); // If there's an error, set empty list of professors
      }
    } else {
      const perfil = await getDatosPerfil(); // If the search input is empty, fetch the professors for the current sede
      if (perfil.sede) {
        fetchCatedraticos(perfil.sede);
      }
    }
  };

  // Function to handle the activation/deactivation of a professor
  const handleActiveChange = async (userId: number, newStatus: boolean) => {
    if (!newStatus) {
      // If deactivating a professor, show confirmation alert
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este catedrático no podrá iniciar sesión, ¿aún deseas desactivarlo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
      });

      if (!result.isConfirmed) {
        return; // If user cancels, do nothing
      }
    }

    // Update the professor's active status in the state
    const updatedCatedraticos = catedraticos.map((cat) =>
      cat.user_id === userId ? { ...cat, active: newStatus } : cat
    );
    setCatedraticos(updatedCatedraticos);

    try {
      await activaCatedratico(userId, newStatus); // Call the API to update the professor's status
    } catch {
      setCatedraticos((prev) =>
        prev.map((cat) => (cat.user_id === userId ? { ...cat, active: !newStatus } : cat))
      ); // If there's an error, revert the professor's status in the state
    }
  };

  // Pagination calculations
  const indexOfLastCatedratico = currentPage * catedraticosPerPage; // Index of the last professor on the current page
  const indexOfFirstCatedratico = indexOfLastCatedratico - catedraticosPerPage; // Index of the first professor on the current page
  const currentCatedraticos = catedraticos.slice(indexOfFirstCatedratico, indexOfLastCatedratico); // Slice the professors list based on the current page and page size

  // Total number of pages required for pagination
  const totalPages = Math.ceil(catedraticos.length / catedraticosPerPage);

  // Function to handle pagination (navigate to a specific page)
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber); // Set the current page
    }
  };

  // Function to render the profile photo of the professor
  const renderProfilePhoto = (profilePhoto: string | null, userName: string) =>
    profilePhoto ? (
      <img src={profilePhoto} alt={userName} className="w-10 h-10 rounded-full mx-auto" />
    ) : (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
        {userName.charAt(0).toUpperCase()}
      </div>
    );

  // Function to get the page range for pagination buttons
  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)); // Calculate the start page
    let end = Math.min(totalPages, start + maxPageButtons - 1); // Calculate the end page

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1); // Adjust start page if the range is less than the max page buttons
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i); // Return the page numbers as an array
  };

  return (
    <>
      <Breadcrumb pageName="Listar Catedráticos" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar por Código de Catedrático"
            value={searchCarnet}
            onChange={(e) => setSearchCarnet(e.target.value)}
            className="w-72 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          />
          <button onClick={handleSearchClick} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Buscar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">Foto</th>
                <th className="py-2 px-4 text-center">Nombre</th>
                <th className="py-2 px-4 text-center">Código</th>
                <th className="py-2 px-4 text-right">Activo</th>
              </tr>
            </thead>
            <tbody>
              {currentCatedraticos.length > 0 ? (
                currentCatedraticos.map((cat) => (
                  <tr key={cat.user_id} className="border-t border-gray-200 dark:border-strokedark">
                    <td className="py-2 px-4 text-center">
                      {renderProfilePhoto(cat.profilePhoto, cat.userName)} {/* Render professor's photo */}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{cat.userName}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{cat.professorCode}</td>
                    <td className="py-2 px-4 flex justify-end">
                      <SwitcherFour
                        enabled={cat.active}
                        onChange={() => handleActiveChange(cat.user_id, !cat.active)} // Toggle professor's active status
                        uniqueId={cat.user_id.toString()}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron catedráticos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592;
          </button>
          {getPageRange().map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`mx-1 px-3 py-1 rounded-md border ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8594;
          </button>
        </div>
      </div>
    </>
  );
};

export default ListarCatedraticos;
