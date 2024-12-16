import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticos } from '../../../ts/Admin/GetCatedraticos';
import { getCatedraticoPorCarnet } from '../../../ts/Admin/GetCatedraticosCarnet';
import { activaCatedratico } from '../../../ts/Admin/ActivarCatedraticos';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../../components/Switchers/SwitcherFour';
import Swal from 'sweetalert2';

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
  const [catedraticosPerPage, setCatedraticosPerPage] = useState(5);
  const [maxPageButtons, setMaxPageButtons] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCatedraticosPerPage(8);
        setMaxPageButtons(5);
      } else {
        setCatedraticosPerPage(5);
        setMaxPageButtons(10);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getDatosPerfil().then((perfil) => perfil.sede && fetchCatedraticos(perfil.sede));
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
    if (!newStatus) {
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
        return;
      }
    }

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

  const indexOfLastCatedratico = currentPage * catedraticosPerPage;
  const indexOfFirstCatedratico = indexOfLastCatedratico - catedraticosPerPage;
  const currentCatedraticos = catedraticos.slice(indexOfFirstCatedratico, indexOfLastCatedratico);

  const totalPages = Math.ceil(catedraticos.length / catedraticosPerPage);

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

  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
