import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../components/Switchers/SwitcherFour';
import { getRevisores } from '../../ts/CoordinadorTesis/GetRevisores';
import { getDatosPerfil, PerfilData } from "../../ts/Generales/GetDatsPerfil";
import { activaUsuario } from '../../ts/Generales/ActivarUsuario';
import CrearRevisor from '../../components/Modals/Revisores/CreaRevisor';
import Swal from 'sweetalert2';

const Revisores: React.FC = () => {
  const [revisores, setRevisores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRevisor, setSelectedRevisor] = useState<any | null>(null);
  const [userIdFromProfile, setUserIdFromProfile] = useState<number | null>(null); // State for user_id

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [revisoresPerPage, setRevisoresPerPage] = useState(5);
  const [maxPageButtons, setMaxPageButtons] = useState(10);

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on initial load
    fetchRevisores(); // Fetch revisores once user profile is available
  }, [userIdFromProfile]); // Add userIdFromProfile as dependency

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const perfilData: PerfilData = await getDatosPerfil();
      setUserIdFromProfile(perfilData.user_id); // Set user_id in state
    } catch (err) {
      setError('Error al obtener los datos del perfil');
      setLoading(false);
    }
  };

  // Fetch revisores data
  const fetchRevisores = async () => {
    if (userIdFromProfile === null) return; // Ensure user_id is available before fetching revisores
    try {
      const data = await getRevisores();
      const filteredRevisores = data.filter(revisor => revisor.user_id !== userIdFromProfile); // Exclude current user
      setRevisores(filteredRevisores);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastRevisor = currentPage * revisoresPerPage;
  const indexOfFirstRevisor = indexOfLastRevisor - revisoresPerPage;
  const currentRevisores = revisores.slice(indexOfFirstRevisor, indexOfLastRevisor);

  const totalPages = Math.ceil(revisores.length / revisoresPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Effect hook to handle window resize and adjust page settings accordingly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRevisoresPerPage(8); // Ajusta el número de elementos por página en pantallas pequeñas
        setMaxPageButtons(5); // Ajusta la cantidad de botones de paginación en pantallas pequeñas
      } else {
        setRevisoresPerPage(5); // Ajusta el número de elementos por página en pantallas grandes
        setMaxPageButtons(10); // Ajusta la cantidad de botones de paginación en pantallas grandes
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handleActiveChange = async (userId: number, newStatus: boolean) => {
    const updatedRevisores = revisores.map((revisor) =>
      revisor.user_id === userId ? { ...revisor, active: newStatus } : revisor
    );
    setRevisores(updatedRevisores);

    if (!newStatus) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este revisor no podrá iniciar sesión, ¿aún deseas desactivarlo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
      });

      if (!result.isConfirmed) {
        setRevisores(revisores);
        return;
      }
    }

    try {
      const response = await activaUsuario(userId, newStatus);
      Swal.fire({
        title: 'Éxito',
        text: response.message,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
      });
    } catch (err) {
      setRevisores((prev) =>
        prev.map((revisor) =>
          revisor.user_id === userId ? { ...revisor, active: !newStatus } : revisor
        )
      );
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  const openModal = (revisor: any | null = null) => {
    setSelectedRevisor(revisor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRevisor(null);
  };

  const handleRevisorCreated = () => {
    fetchRevisores(); // Recargar la lista después de crear/editar un revisor
    closeModal();
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Breadcrumb pageName="Revisores o Auxiliares" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center" onClick={() => openModal()}>
            Nuevo revisor <span className="ml-2">👤</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">No.</th>
                <th className="py-2 px-4 text-center">Nombre del revisor</th>
                <th className="py-2 px-4 text-center hidden md:table-cell">Correo</th>
                <th className="py-2 px-4 text-center hidden md:table-cell">Código</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRevisores.map((revisor) => (
                <tr key={revisor.user_id} className="border-t border-gray-200 dark:border-strokedark">
                  <td className="py-2 px-4 text-center text-black dark:text-white">{revisor.user_id}</td>
                  <td className="py-2 px-4 text-center text-black dark:text-white">{revisor.name}</td>
                  <td className="py-2 px-4 text-center text-black dark:text-white hidden md:table-cell">
                    {revisor.email}
                  </td>
                  <td className="py-2 px-4 text-center text-black dark:text-white hidden md:table-cell">
                    {revisor.carnet}
                  </td>
                  <td className="py-2 px-4 text-center flex items-center justify-center space-x-2">
                    <button className="px-4 py-2 bg-yellow-300 text-black rounded-md" onClick={() => openModal(revisor)}>
                      Editar
                    </button>
                    <SwitcherFour
                      enabled={revisor.active}
                      onChange={() => handleActiveChange(revisor.user_id, !revisor.active)}
                      uniqueId={`revisor-${revisor.user_id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592;
          </button>
          {[...Array(Math.min(totalPages, maxPageButtons))].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'} dark:bg-boxdark dark:text-white`}
            >
              {i + 1}
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

      {showModal && <CrearRevisor onClose={handleRevisorCreated} revisor={selectedRevisor} />}
    </>
  );
};

export default Revisores;
