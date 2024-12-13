import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticos } from '../../../ts/Admin/GetCatedraticos';
import { getCatedraticoPorCarnet } from '../../../ts/Admin/GetCatedraticosCarnet';
import { activaCatedratico } from '../../../ts/Admin/ActivarCatedraticos';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../../components/Switchers/SwitcherFour';

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
  const [searchCarnet, setSearchCarnet] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const catedraticosPerPage = 5;
  const [maxPageButtons] = useState(10); // Máximo de botones para paginación
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getDatosPerfil().then((perfil) => perfil.sede && fetchCatedraticos(perfil.sede));

    // Detectar el tamaño de la pantalla
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); // Definir como móvil si el ancho es menor o igual a 640px
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCatedraticos = async (sedeId: number) => {
    try {
      const catedraticosRecuperados = await getCatedraticos(sedeId);
      setCatedraticos(Array.isArray(catedraticosRecuperados) ? catedraticosRecuperados : []);
    } catch {
      setCatedraticos([]);
    }
  };

  const handleSearchClick = async () => {
    if (searchCarnet.trim()) {
      try {
        const catedraticoEncontrado = await getCatedraticoPorCarnet(searchCarnet);
        setCatedraticos(catedraticoEncontrado ? [catedraticoEncontrado] : []);
      } catch {
        setCatedraticos([]);
      }
    } else {
      getDatosPerfil().then((perfil) => perfil.sede && fetchCatedraticos(perfil.sede));
    }
  };

  const handleActiveChange = async (userId: number, newStatus: boolean) => {
    const updatedCatedraticos = catedraticos.map((cat) =>
      cat.user_id === userId ? { ...cat, active: newStatus } : cat
    );
    setCatedraticos(updatedCatedraticos);
    try {
      await activaCatedratico(userId, newStatus);
    } catch {
      setCatedraticos((prev) =>
        prev.map((cat) => (cat.user_id === userId ? { ...cat, active: !newStatus } : cat))
      );
    }
  };

  const indexOfLastCatedratico = currentPage * (isMobile ? 8 : catedraticosPerPage);
  const indexOfFirstCatedratico = indexOfLastCatedratico - (isMobile ? 8 : catedraticosPerPage);
  const currentCatedraticos = catedraticos.slice(indexOfFirstCatedratico, indexOfLastCatedratico);

  const totalPages = Math.ceil(catedraticos.length / (isMobile ? 8 : catedraticosPerPage));

  // Paginación
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderProfilePhoto = (profilePhoto: string | null, userName: string) =>
    profilePhoto ? (
      <img src={profilePhoto} alt={userName} className="w-10 h-10 rounded-full mx-auto" />
    ) : (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
        {userName.charAt(0).toUpperCase()}
      </div>
    );

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
                      {renderProfilePhoto(cat.profilePhoto, cat.userName)}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{cat.userName}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{cat.professorCode}</td>
                    <td className="py-2 px-4 flex justify-end">
                      <SwitcherFour
                        enabled={cat.active}
                        onChange={() => handleActiveChange(cat.user_id, !cat.active)}
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

        {/* Paginación */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592;
          </button>
          {Array.from({ length: isMobile ? Math.min(totalPages, 4) : Math.min(totalPages, maxPageButtons) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`mx-1 px-3 py-1 rounded-md border ${
                currentPage === page
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
