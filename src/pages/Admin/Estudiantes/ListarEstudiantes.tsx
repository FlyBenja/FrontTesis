import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getYears } from '../../../ts/Generales/GetYears';
import { getEstudiantes } from '../../../ts/Admin/GetEstudiantes';
import { getCursos } from '../../../ts/Admin/GetCursos';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getEstudiantePorCarnet } from '../../../ts/Admin/GetEstudianteCarnet'; // Importar la API

interface Estudiante {
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

const ListarEstudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedAño, setSelectedAño] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<string>('');
  const estudiantesPerPage = 5;
  const [maxPageButtons] = useState(10);
  const [searchCarnet, setSearchCarnet] = useState<string>(''); // Estado para el carnet a buscar

  const navigate = useNavigate(); // Inicializa el hook de navegación

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

        const currentMonth = new Date().getMonth(); // 0 to 11, where 0 is January and 11 is December
        let initialCourseId = '1'; // Default course_id for the first half of the year
        if (currentMonth >= 6) {
          initialCourseId = '2'; // Set course_id to 2 for the second half of the year
        }
        setSelectedCurso(initialCourseId); // Set the initial value based on the month

        if (perfil.sede && currentYear) {
          fetchEstudiantes(perfil.sede, initialCourseId, currentYear);
          fetchCursos(perfil.sede);
        }
      } catch (error) {
        console.error('Error al cargar los datos iniciales:', error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchEstudiantes = async (sedeId: number, courseId: string, nameYear: string) => {
    try {
      const estudiantesRecuperados = await getEstudiantes(sedeId, parseInt(courseId), parseInt(nameYear));
      if (Array.isArray(estudiantesRecuperados)) {
        setEstudiantes(estudiantesRecuperados);
      } else {
        console.error('Los datos recibidos no son válidos:', estudiantesRecuperados);
        setEstudiantes([]);
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setEstudiantes([]);
    }
  };

  const fetchCursos = async (sedeId: number) => {
    try {
      const cursosRecuperados = await getCursos(sedeId);
      if (Array.isArray(cursosRecuperados)) {
        setCursos(cursosRecuperados);
      } else {
        console.error('Los datos de cursos no son válidos:', cursosRecuperados);
        setCursos([]);
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setCursos([]);
    }
  };

  const handleAñoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const añoSeleccionado = e.target.value;
    setSelectedAño(añoSeleccionado);

    const perfil = await getDatosPerfil();
    if (perfil.sede && añoSeleccionado && selectedCurso) {
      fetchEstudiantes(perfil.sede, selectedCurso, añoSeleccionado);
    }
  };

  const handleCursoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
    const perfil = await getDatosPerfil();
    if (perfil.sede && selectedAño && e.target.value) {
      fetchEstudiantes(perfil.sede, e.target.value, selectedAño);
    }
  };

  const handleStudentClick = (estudiante: Estudiante) => {
    navigate(`/admin/time-line`, {
      state: {
        estudiante,
        selectedCurso, // Incluye el curso seleccionado
        selectedAño,   // Incluye el año seleccionado
      },
    });
  };

  const handleSearchClick = async () => {

    // Limpiar la lista de estudiantes y mostrar un estado "cargando" o vacío
    setEstudiantes([]);

    if (searchCarnet === '') {
      // Si el campo de búsqueda está vacío, volvemos a ejecutar la API para cargar todos los estudiantes
      const perfil = await getDatosPerfil();
      if (perfil.sede && selectedCurso && selectedAño) {
        fetchEstudiantes(perfil.sede, selectedCurso, selectedAño);
      }
      return;
    }

    try {
      const estudianteEncontrado = await getEstudiantePorCarnet(searchCarnet);
      console.log('Estudiante encontrado:', estudianteEncontrado);
      if (estudianteEncontrado) {
        setEstudiantes([estudianteEncontrado]); // Mostrar solo el estudiante encontrado
      } else {
        setEstudiantes([]); // Si no se encuentra, mostramos una lista vacía
      }
    } catch (error) {
      console.error('Error al buscar el estudiante:', error);
    }
  };

  const indexOfLastEstudiante = currentPage * estudiantesPerPage;
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage;
  const currentEstudiantes = estudiantes.slice(indexOfFirstEstudiante, indexOfLastEstudiante);

  const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage);

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

  const renderProfilePhoto = (profilePhoto: string, userName: string) => {
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
      <Breadcrumb pageName="Listar Estudiantes" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex flex-wrap items-center justify-between space-x-2">
          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por Carnet de Estudiante"
              value={searchCarnet} // Establecemos el valor del input
              onChange={(e) => setSearchCarnet(e.target.value)} // Actualizamos el estado
              className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleSearchClick} // Ejecutamos la búsqueda
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
          <select
            value={selectedCurso}
            onChange={handleCursoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.course_id} value={curso.course_id.toString()}>
                {curso.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="py-2 px-4 text-left">Foto</th>
                <th className="py-2 px-4 text-center">Nombre Estudiante</th>
                <th className="py-2 px-4 text-center">Carnet</th>
              </tr>
            </thead>
            <tbody>
              {currentEstudiantes.length > 0 ? (
                currentEstudiantes.map((est) => (
                  <tr
                    key={est.id}
                    onClick={() => handleStudentClick(est)}
                    className="border-t border-gray-200 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 relative group"
                  >
                    <td className="py-2 px-4 text-center">
                      {renderProfilePhoto(est.fotoPerfil, est.userName)}
                    </td>
                    <td className="py-2 px-4 text-center relative group">
                      {est.userName}
                      <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-lg px-1 py-1 -top-10 left-[60%] transform -translate-x-1/2 w-40 dark:bg-white dark:text-gray-800">
                        Ir Hacia TimeLine Estudiante
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">{est.carnet}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          {renderPaginationButtons()}
        </div>
      </div>
    </>
  );
};

export default ListarEstudiantes;
