import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticos } from '../../../ts/Admin/GetCatedraticos';
import { getCatedraticoPorCarnet } from '../../../ts/Admin/GetCatedraticosCarnet'; // Importar la nueva API
import { activaCatedratico } from '../../../ts/Admin/ActivarCatedraticos'; // Ruta de la API
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../../components/Switchers/SwitcherFour'; // Importar SwitcherFour

interface Catedratico {
  user_id: number;
  email: string;
  userName: string;
  professorCode: string;
  profilePhoto: string | null;
  active: boolean;
}

const ListarCatedraticos: React.FC = () => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [searchCarnet, setSearchCarnet] = useState(''); // Cambié 'searchUsername' a 'searchCarnet'
  const [currentPage, setCurrentPage] = useState(1);
  const catedraticosPerPage = 6;
  const [maxPageButtons] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const perfil = await getDatosPerfil();

        if (perfil.sede) {
          fetchCatedraticos(perfil.sede); // Usar el año actual
        }
      } catch (error) {
        console.error('Error al cargar los datos iniciales:', error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchCatedraticos = async (sedeId: number) => {
    try {
      const catedraticosRecuperados = await getCatedraticos(sedeId);

      if (Array.isArray(catedraticosRecuperados)) {
        setCatedraticos(catedraticosRecuperados);
      } else {
        console.error('Los datos recibidos no son válidos:', catedraticosRecuperados);
        setCatedraticos([]);
      }
    } catch (error) {
      console.error('Error al cargar catedráticos:', error);
      setCatedraticos([]);
    }
  };

  const handleSearchClick = async () => {
    setCatedraticos([]); // Limpiar la lista de catedráticos antes de buscar
    try {
      if (searchCarnet.trim() === '') {
        // Si el campo de búsqueda está vacío, cargar todos los catedráticos de nuevo
        const perfil = await getDatosPerfil();
        if (perfil.sede) {
          fetchCatedraticos(perfil.sede); // Llamar a la API de getCatedraticos
        }
      } else {
        // Buscar catedrático por carnet
        const catedraticoEncontrado = await getCatedraticoPorCarnet(searchCarnet);
        if (catedraticoEncontrado) {
          // Si se encuentra el catedrático, actualizar la lista con el catedrático encontrado
          setCatedraticos([catedraticoEncontrado]);
        } else {
          // Si no se encuentra el catedrático, limpiar la lista
          setCatedraticos([]);
        }
      }
    } catch (error) {
      console.error('Error al buscar catedrático:', error);
    }
  };
  

  const handleActiveChange = async (userId: number, newStatus: boolean) => {
    try {
      // Actualizar el estado local antes de hacer la llamada a la API para evitar retrasos visuales
      const updatedCatedraticos = catedraticos.map((cat) =>
        cat.user_id === userId ? { ...cat, active: newStatus } : cat
      );
      setCatedraticos(updatedCatedraticos);

      // Llamar a la API para actualizar el estado de "active" en el backend
      await activaCatedratico(userId, newStatus);

      console.log(`Estado de catedrático con ID ${userId} actualizado a ${newStatus}`);
    } catch (error) {
      console.error('Error al actualizar el estado de catedrático:', error);

      // Si hay un error, revertimos el cambio en el estado local
      const updatedCatedraticos = catedraticos.map((cat) =>
        cat.user_id === userId ? { ...cat, active: !newStatus } : cat
      );
      setCatedraticos(updatedCatedraticos);
    }
  };

  const indexOfLastCatedratico = currentPage * catedraticosPerPage;
  const indexOfFirstCatedratico = indexOfLastCatedratico - catedraticosPerPage;
  const currentCatedraticos = catedraticos.slice(indexOfFirstCatedratico, indexOfLastCatedratico);

  const totalPages = Math.ceil(catedraticos.length / catedraticosPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500"
      >
        &#8592;
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500"
      >
        &#8594;
      </button>
    );

    return buttons;
  };

  const renderProfilePhoto = (profilePhoto: string | null, userName: string) => {
    if (profilePhoto) {
      return <img src={profilePhoto} alt={userName} className="w-10 h-10 rounded-full mx-auto" />;
    } else {
      const initial = userName.charAt(0).toUpperCase();
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
          {initial}
        </div>
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Listar Catedráticos" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex flex-wrap items-center justify-between space-x-2">
          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por Código de Catedrático"
              value={searchCarnet}
              onChange={(e) => setSearchCarnet(e.target.value)} // Actualizamos el estado
              className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
            />
            <button
              onClick={handleSearchClick} // Llamar la función de búsqueda al hacer clic
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="py-2 px-4 text-left">Foto</th>
                <th className="py-2 px-4 text-center">Nombre Catedrático</th>
                <th className="py-2 px-4 text-center">Código</th>
                <th className="py-2 px-4 text-right">Activo</th>
              </tr>
            </thead>
            <tbody>
              {currentCatedraticos.length > 0 ? (
                currentCatedraticos.map((catedratico) => (
                  <tr key={catedratico.user_id}>
                    <td className="py-2 px-4 text-center">
                      {renderProfilePhoto(catedratico.profilePhoto, catedratico.userName)}
                    </td>
                    <td className="py-2 px-4 text-center">{catedratico.userName}</td>
                    <td className="py-2 px-4 text-center">{catedratico.professorCode}</td>
                    <td className="py-2 px-4 flex justify-end">
                      <SwitcherFour
                        enabled={catedratico.active}
                        onChange={() => handleActiveChange(catedratico.user_id, !catedratico.active)}
                        uniqueId={catedratico.user_id.toString()}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                    No se encontraron catedráticos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">{renderPaginationButtons()}</div>
      </div>
    </>
  );
};

export default ListarCatedraticos;
