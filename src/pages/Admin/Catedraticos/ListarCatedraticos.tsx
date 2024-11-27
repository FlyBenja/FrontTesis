import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../../components/Switchers/SwitcherFour'; // Asegúrate de tener la ruta correcta
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCursos } from '../../../ts/Admin/GetCursos';
import { getYears } from '../../../ts/Generales/GetYears';

interface Catedratico {
  id: number;
  userName: string;
  carnet: string;
  curso: string;
  año: number;
  fotoPerfil: string;
}

interface Curso {
  course_id: number;
  courseName: string;
}

const ListarCatedraticos: React.FC = () => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [selectedAño, setSelectedAño] = useState<string>('');
  const [selectedCurso, setSelectedCurso] = useState<number>(0);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [searchCarnet, setSearchCarnet] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeCatedraticos, setActiveCatedraticos] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const catedraticosPerPage = 4;
  const [maxPageButtons] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const perfil = await getDatosPerfil();
        const sedeId = perfil.sede;

        const cursosRecuperados: any = await getCursos(sedeId);
        setCursos(cursosRecuperados);

        const yearsRecuperados = await getYears();
        setYears(yearsRecuperados.map(yearObj => yearObj.year));

        if (sedeId && selectedCurso && selectedAño) {
          // Datos de catedráticos temporales
          setCatedraticos([
            { id: 1, userName: 'Carlos Pérez', carnet: 'C123', curso: 'Matemáticas', año: 2024, fotoPerfil: '' },
            { id: 2, userName: 'Ana Gómez', carnet: 'C124', curso: 'Historia', año: 2024, fotoPerfil: '' },
            { id: 3, userName: 'Juan Martínez', carnet: 'C125', curso: 'Física', año: 2024, fotoPerfil: '' },
            { id: 4, userName: 'Laura Rodríguez', carnet: 'C126', curso: 'Química', año: 2024, fotoPerfil: '' },
          ]);
          setShowSearch(true);
        }

        const currentYear = new Date().getFullYear().toString();
        if (yearsRecuperados.map(yearObj => yearObj.year.toString()).includes(currentYear)) {
          setSelectedAño(currentYear);
        }

        const currentMonth = new Date().getMonth() + 1;
        const selectedCourse = currentMonth <= 6 ? 1 : 2;
        setSelectedCurso(selectedCourse);

      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    fetchInitialData();
  }, [selectedCurso, selectedAño]);

  const handleSearchCarnet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCarnet(e.target.value);
  };

  const handleAñoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAño(e.target.value);
  };

  const handleCursoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(Number(e.target.value));
  };

  const handleSwitchChange = (id: number) => {
    setActiveCatedraticos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSearchClick = async () => {
    if (searchCarnet.trim() === '') {
      const perfil = await getDatosPerfil();
      const sedeId = perfil.sede;
      if (sedeId && selectedCurso && selectedAño) {
        // Reemplaza con catedráticos temporales
        setCatedraticos([
          { id: 1, userName: 'Carlos Pérez', carnet: 'C123', curso: 'Matemáticas', año: 2024, fotoPerfil: '' },
          { id: 2, userName: 'Ana Gómez', carnet: 'C124', curso: 'Historia', año: 2024, fotoPerfil: '' },
          { id: 3, userName: 'Juan Martínez', carnet: 'C125', curso: 'Física', año: 2024, fotoPerfil: '' },
          { id: 4, userName: 'Laura Rodríguez', carnet: 'C126', curso: 'Química', año: 2024, fotoPerfil: '' },
        ]);
      }
    } else {
      const catedraticosFiltrados = catedraticos.filter(cate =>
        cate.carnet.toLowerCase().includes(searchCarnet.toLowerCase())
      );
      setCatedraticos(catedraticosFiltrados);
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

    // Flecha de retroceder
    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
      >
        &#8592;
      </button>
    );

    // Botones de páginas numéricas
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'}`}
        >
          {i}
        </button>
      );
    }

    // Flecha de avanzar
    buttons.push(
      <button
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
      >
        &#8594;
      </button>
    );

    return buttons;
  };

  const renderFotoPerfil = (fotoPerfil: string, userName: string) => {
    if (fotoPerfil) {
      return <img src={fotoPerfil} alt={userName} className="w-10 h-10 rounded-full mx-auto" />;
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
        {showSearch && (
          <div className="mb-4 flex flex-wrap items-center justify-between space-x-2">
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar por carnet"
                value={searchCarnet}
                onChange={handleSearchCarnet}
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
        )}

        <div className="mb-4 flex gap-4">
          <select
            value={selectedAño}
            onChange={handleAñoChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedCurso}
            onChange={handleCursoChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value={0}>Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.course_id} value={curso.course_id}>
                {curso.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead className="bg-gray-100 text-sm text-gray-600 dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-center">Foto</th>
                <th className="py-2 px-4 text-center">Nombre</th>
                <th className="py-2 px-4 text-center">Carnet</th>
                <th className="py-2 px-4 text-center">Activo</th> {/* Añadido para que ambas tablas tengan la misma estructura */}
              </tr>
            </thead>
            <tbody>
              {currentCatedraticos.length > 0 ? (
                currentCatedraticos.map(catedratico => (
                  <tr
                    key={catedratico.id}
                    className="border-t border-gray-200 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 relative group"
                  >
                    <td className="py-2 px-4 text-center">
                      {renderFotoPerfil(catedratico.fotoPerfil, catedratico.userName)}
                    </td>
                    <td className="py-2 px-4 text-center">{catedratico.userName}</td>
                    <td className="py-2 px-4 text-center">{catedratico.carnet}</td>
                    <td className="py-2 px-4 text-center">
                      <SwitcherFour
                        enabled={activeCatedraticos[catedratico.id] || false}
                        onChange={() => handleSwitchChange(catedratico.id)}
                        uniqueId={`catedratico-${catedratico.id}`}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center text-gray-500">No se encontraron catedráticos</td> {/* Ajustado el colspan */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListarCatedraticos;
