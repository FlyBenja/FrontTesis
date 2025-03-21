import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getYears } from '../../../ts/Generales/GetYears';
import { getEstudiantes } from '../../../ts/Administrador/GetEstudiantes';
import { getCursos } from '../../../ts/Generales/GetCursos';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getEstudiantePorCarnet } from '../../../ts/Administrador/GetEstudianteCarnet';
import generaPDFGeneral from '../../../components/Pdfs/generaPDFGeneral';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

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
  // State variables for managing students data, years, courses, etc.
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]); // List of students
  const [years, setYears] = useState<number[]>([]); // List of available years
  const [selectedAño, setSelectedAño] = useState<string>(''); // Selected year
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [cursos, setCursos] = useState<Curso[]>([]); // List of available courses
  const [selectedCurso, setSelectedCurso] = useState<string>(''); // Selected course
  const [searchCarnet, setSearchCarnet] = useState<string>(''); // Student carnet for search
  const [estudiantesPerPage, setEstudiantesPerPage] = useState(4); // Number of students per page
  const [maxPageButtons, setMaxPageButtons] = useState(10); // Maximum number of page buttons to show
  const navigate = useNavigate(); // To navigate to other pages

  useEffect(() => {
    // Fetch initial data such as profile, years, and courses
    const fetchInitialData = async () => {
      const perfil = await getDatosPerfil(); // Fetch profile data
      const yearsRecuperados = await getYears(); // Fetch available years
      setYears(yearsRecuperados.map((yearObj) => yearObj.year)); // Set years in state

      // Set the current year if it exists in the list
      const currentYear = new Date().getFullYear().toString();
      if (
        yearsRecuperados
          .map((yearObj) => yearObj.year.toString())
          .includes(currentYear)
      ) {
        setSelectedAño(currentYear); // Set current year as selected
      }

      // Set the course based on the current month (June onwards -> course_id = 2, else course_id = 1)
      const currentMonth = new Date().getMonth();
      const initialCourseId = currentMonth >= 6 ? '2' : '1';
      setSelectedCurso(initialCourseId);

      // Fetch students and courses for the selected year and course if profile and year are available
      if (perfil.sede && currentYear) {
        fetchEstudiantes(perfil.sede, initialCourseId, currentYear); // Fetch students
        fetchCursos(perfil.sede); // Fetch courses
      }
    };

    fetchInitialData(); // Call the function to fetch data on initial render
  }, []); // Empty dependency array ensures it runs only once on mount

  // Fetch students based on selected year, course, and campus
  const fetchEstudiantes = async (
    sedeId: number,
    courseId: string,
    nameYear: string,
  ) => {
    try {
      const estudiantesRecuperados = await getEstudiantes(
        sedeId,
        parseInt(courseId),
        parseInt(nameYear),
      );
      setEstudiantes(
        Array.isArray(estudiantesRecuperados) ? estudiantesRecuperados : [],
      ); // Set students in state
    } catch {
      setEstudiantes([]); // Set empty list in case of error
    }
  };

  // Fetch courses based on selected year and campus
  const fetchCursos = async (sedeId: number) => {
    try {
      const añoSeleccionado = selectedAño
        ? parseInt(selectedAño)
        : new Date().getFullYear(); // Set selected year or current year
      const cursosRecuperados = await getCursos(sedeId, añoSeleccionado); // Fetch courses
      setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []); // Set courses in state
    } catch (error) {
      setCursos([]); // Set empty list in case of error
    }
  };

  // Handle change of selected year from dropdown
  const handleAñoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const añoSeleccionado = e.target.value; // Get selected year
    setSelectedAño(añoSeleccionado); // Update state with selected year
    const perfil = await getDatosPerfil(); // Fetch profile data
    if (perfil.sede && añoSeleccionado) {
      const cursosRecuperados = await getCursos(
        perfil.sede,
        parseInt(añoSeleccionado),
      ); // Fetch courses for selected year
      setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []); // Set courses in state
    }
    if (perfil.sede && añoSeleccionado && selectedCurso) {
      fetchEstudiantes(perfil.sede, selectedCurso, añoSeleccionado); // Fetch students for selected year and course
    }
  };

  // Handle change of selected course from dropdown
  const handleCursoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value); // Update state with selected course
    const perfil = await getDatosPerfil(); // Fetch profile data
    if (perfil.sede && selectedAño && e.target.value) {
      fetchEstudiantes(perfil.sede, e.target.value, selectedAño); // Fetch students for selected year and course
    }
  };

  // Handle click on student row to navigate to the student's timeline
  const handleStudentClick = (estudiante: Estudiante) => {
    navigate(`/administrador/time-line`, {
      state: {
        estudiante,
        selectedAño,
        selectedCurso,
      },
    });
  };

  // Handle print PDF for the selected year and course
  const handlePrintPDF = (selectedAño: number, selectedCurso: number) => {
    generaPDFGeneral(selectedAño, selectedCurso); // Generate PDF report
  };

  // Handle search button click to find a student by carnet
  const handleSearchClick = async () => {
    setEstudiantes([]); // Clear students before searching
    if (!searchCarnet) {
      const perfil = await getDatosPerfil(); // Fetch profile data
      if (perfil.sede && selectedCurso && selectedAño) {
        fetchEstudiantes(perfil.sede, selectedCurso, selectedAño); // Fetch students if carnet is empty
      }
      return;
    }
    try {
      const perfil = await getDatosPerfil(); // Fetch profile data
      const estudianteEncontrado = await getEstudiantePorCarnet(
        perfil.sede,
        parseInt(selectedAño),
        searchCarnet,
      ); // Search student by carnet
      setEstudiantes(estudianteEncontrado ? [estudianteEncontrado] : []); // Set found student or empty array if not found
    } catch (error) {
      console.error('Error al buscar el estudiante:', error); // Log error if search fails
    }
  };

  // Pagination logic
  const indexOfLastEstudiante = currentPage * estudiantesPerPage; // Index of last student on current page
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage; // Index of first student on current page
  const currentEstudiantes = estudiantes.slice(
    indexOfFirstEstudiante,
    indexOfLastEstudiante,
  ); // Slice students for current page
  const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage); // Total number of pages

  // Pagination function to set the current page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber); // Update current page
    }
  };

  // Get page range for pagination buttons
  const getPageRange = () => {
    const range: number[] = [];
    const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage); // Calculate total pages
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)); // Calculate start page
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1); // Calculate end page

    for (let i = startPage; i <= endPage; i++) {
      range.push(i); // Add pages to range
    }

    return range;
  };

  // Render the student's profile photo or an initial if no photo is available
  const renderProfilePhoto = (profilePhoto: string, userName: string) => {
    if (profilePhoto) {
      return (
        <img
          src={profilePhoto}
          alt={userName}
          className="w-10 h-10 rounded-full"
        />
      ); // Render photo if available
    } else {
      const initial = userName.charAt(0).toUpperCase(); // Get first letter of user name
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
          {initial} {/* Render initial if no photo */}
        </div>
      );
    }
  };

  // Adjust number of students per page and pagination buttons on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEstudiantesPerPage(8); // Set more students per page on smaller screens
        setMaxPageButtons(5); // Set fewer page buttons
      } else {
        setEstudiantesPerPage(4); // Set default students per page
        setMaxPageButtons(10); // Set default page buttons
      }
    };

    handleResize(); // Initial check for screen size
    window.addEventListener('resize', handleResize); // Add resize event listener
    return () => window.removeEventListener('resize', handleResize); // Cleanup event listener
  }, []);

  // Función para iniciar el recorrido
  const startTour = () => {
    const driverObj = driver({
      showProgress: true, // Muestra la barra de progreso
      animate: true, // Habilita animaciones
      prevBtnText: 'Anterior', // Texto del botón "Anterior"
      nextBtnText: 'Siguiente', // Texto del botón "Siguiente"
      doneBtnText: 'Finalizar', // Texto del botón "Finalizar"
      progressText: 'Paso {{current}} de {{total}}', // Texto de la barra de progreso
    });

    driverObj.setSteps([
      {
        element: '#search-carnet', // ID del campo de búsqueda por carnet
        popover: {
          title: 'Buscar Estudiante',
          description:
            'Aquí puedes buscar un estudiante por su número de carnet.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#select-year', // ID del campo de selección de año
        popover: {
          title: 'Seleccionar Año',
          description:
            'Selecciona el año para filtrar la lista de estudiantes.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#select-course', // ID del campo de selección de curso
        popover: {
          title: 'Seleccionar Curso',
          description:
            'Selecciona el curso para filtrar la lista de estudiantes.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#print-report', // ID del botón de imprimir reporte
        popover: {
          title: 'Imprimir Reporte',
          description:
            'Haz clic aquí para generar un reporte en PDF de los estudiantes filtrados.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#student-table', // ID de la tabla de estudiantes
        popover: {
          title: 'Lista de Estudiantes',
          description:
            'Aquí se muestran los estudiantes filtrados. Haz clic en un estudiante para ver su línea de tiempo.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#pagination', // ID de la paginación
        popover: {
          title: 'Paginación',
          description:
            'Usa estos controles para navegar entre las páginas de estudiantes.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      <Breadcrumb pageName="Listar Estudiantes" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex flex-wrap items-center justify-between space-x-2">
          <div className="mb-4 flex items-center space-x-2">
            <input
              id="search-input"
              type="text"
              placeholder="Buscar por Carnet de Estudiante"
              value={searchCarnet}
              onChange={(e) => setSearchCarnet(e.target.value)}
              className="w-72 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
            />
            <button
              id="search-button"
              onClick={handleSearchClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Buscar
            </button>

            {/* Botón para iniciar el recorrido */}
            <button
              style={{ width: '35px', height: '35px' }}
              onClick={startTour}
              className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 group"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <circle cx="12" cy="17" r="1" fill="#ffffff"></circle>
                </g>
              </svg>
              <span className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Iniciar recorrido de ayuda
              </span>
            </button>
          </div>

          <div className="flex">
            <button
              id="print-report" // Agrega este ID
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
              onClick={() =>
                handlePrintPDF(Number(selectedAño), Number(selectedCurso))
              }
            >
              Imprimir Reporte
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select
            id="select-year" // Agrega este ID
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
            id="select-course" // Agrega este ID
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
          <table
            id="student-table" // Agrega este ID
            className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark"
          >
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
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
                      {renderProfilePhoto(est.fotoPerfil, est.userName)}{' '}
                      {/* Render profile photo */}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white relative group">
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
                  <td colSpan={3} className="py-2 px-4 text-center">
                    No se encontraron estudiantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          id="pagination" // Agrega este ID
          className="mt-4 flex justify-center"
        >
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

export default ListarEstudiantes;
