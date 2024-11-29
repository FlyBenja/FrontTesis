import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getYears } from '../../../ts/Generales/GetYears';
import { getCatedraticos } from '../../../ts/Admin/GetCatedraticos';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Catedratico {
  user_id: number;
  email: string;
  userName: string;
  profilePhoto: string | null;
  active: boolean;
}

const ListarCatedraticos: React.FC = () => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedAño, setSelectedAño] = useState<string>('');
  const [searchUsername, setSearchUsername] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const catedraticosPerPage = 4;
  const [maxPageButtons] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const perfil = await getDatosPerfil();
        const yearsRecuperados = await getYears();

        setYears(yearsRecuperados.map((yearObj) => yearObj.year));

        const currentYear = new Date().getFullYear().toString();
        if (yearsRecuperados.map((yearObj) => yearObj.year.toString()).includes(currentYear)) {
          setSelectedAño(currentYear);
        }

        if (perfil.sede && currentYear) {
          fetchCatedraticos(perfil.sede, currentYear);
        }
      } catch (error) {
        console.error('Error al cargar los datos iniciales:', error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchCatedraticos = async (sedeId: number, year: string) => {
    try {
      const catedraticosRecuperados = await getCatedraticos(sedeId, parseInt(year));

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

  const handleSearchUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUsername(e.target.value);
  };

  const handleAñoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const añoSeleccionado = e.target.value;
    setSelectedAño(añoSeleccionado);

    const perfil = await getDatosPerfil();
    if (perfil.sede && añoSeleccionado) {
      fetchCatedraticos(perfil.sede, añoSeleccionado);
    }
  };

  const handleSearchClick = async () => {
    if (searchUsername.trim() !== '') {
      // Si hay texto en la búsqueda, filtra los catedráticos
      const filtrados = catedraticos.filter((cat) =>
        cat.userName.toLowerCase().includes(searchUsername.toLowerCase())
      );
      setCatedraticos(filtrados);
    } else {
      // Si el campo de búsqueda está vacío, vuelve a cargar los catedráticos desde la API
      const perfil = await getDatosPerfil();
      if (perfil.sede && selectedAño) {
        fetchCatedraticos(perfil.sede, selectedAño);
      }
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

  return (
    <>
      <Breadcrumb pageName="Listar Catedráticos" />
      <div className="mx-auto max-w-5xl px-1 py-1">

        <div className="mb-4 flex flex-wrap items-center justify-between space-x-2">
          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por nombre de usuario"
              value={searchUsername}
              onChange={handleSearchUsername}
              className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
            />
            <button
              onClick={handleSearchClick}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select
            value={selectedAño}
            onChange={handleAñoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="py-2 px-4 text-center">Nombre</th>
                <th className="py-2 px-4 text-center">Correo</th>
                <th className="py-2 px-4 text-center">Activo</th>
              </tr>
            </thead>
            <tbody>
              {currentCatedraticos.length > 0 ? (
                currentCatedraticos.map((catedratico) => (
                  <tr key={catedratico.user_id}>
                    <td className="py-2 px-4 text-center">{catedratico.userName}</td>
                    <td className="py-2 px-4 text-center">{catedratico.email}</td>
                    <td className="py-2 px-4 text-center">{catedratico.active ? 'Sí' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center">No se encontraron catedráticos</td>
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
