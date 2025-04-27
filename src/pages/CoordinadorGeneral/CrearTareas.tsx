import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CreaTarea from '../../components/Modals/CreaTarea';
import { getCursos } from '../../ts/Generales/GetCursos';
import { getYears } from '../../ts/Generales/GetYears';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareas } from '../../ts/Generales/GetTareas';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

// Define the type for a "Tarea" (task) object
export interface Tarea {
  task_id: number;
  asigCourse_id: number;
  typeTask_id: number;
  title: string;
  description: string;
  taskStart: string;
  endTask: string;
  startTime: string;
  endTime: string;
  year_id: number;
}

const CrearTareas: React.FC = () => {
  // State hooks for managing component data
  const [isModalOpen, setIsModalOpen] = useState(false);  // Controls the modal visibility
  const [selectedCurso, setSelectedCurso] = useState('');  // Stores selected course
  const [selectedAño, setSelectedAño] = useState('');  // Stores selected year
  const [years, setYears] = useState<number[]>([]);  // List of years
  const [cursos, setCursos] = useState<any[]>([]);  // List of courses
  const [tareas, setTareas] = useState<Tarea[]>([]);  // List of tasks
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");  // Determines if modal is in "create" or "edit" mode
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);  // Stores selected task ID for editing

  const [currentPage, setCurrentPage] = useState(1);  // Current page number for pagination
  const [tareasPorPagina, setTareasPorPagina] = useState(3);  // Number of tasks per page
  const [maxPageButtons, setMaxPageButtons] = useState(5);  // Maximum number of page buttons to display

  // Effect hook to fetch initial data for years and set the current year if available
  useEffect(() => {
    const fetchInitialData = async () => {
      const yearsRecuperados = await getYears();  // Fetch available years
      setYears(yearsRecuperados.map((yearObj) => yearObj.year));  // Set years to state

      const currentYear = new Date().getFullYear();  // Get current year
      if (yearsRecuperados.some((yearObj) => yearObj.year === currentYear)) {
        setSelectedAño(currentYear.toString());  // Set current year as selected year
      }
    };

    fetchInitialData();  // Call the fetch function to load initial data

    const currentMonth = new Date().getMonth() + 1;  // Get current month
    setSelectedCurso(currentMonth > 6 ? '2' : '1');  // Set the selected course based on the current month
  }, []);

  // Effect hook to fetch courses when the selected year changes
  useEffect(() => {
    const fetchCursosYActualizarTareas = async () => {
      if (selectedAño) {
        const perfil = await getDatosPerfil();  // Fetch user profile
        const cursosRecuperados = await getCursos(perfil.sede, Number(selectedAño));  // Fetch courses based on selected year and profile data
        setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []);  // Set courses to state

        const currentMonth = new Date().getMonth() + 1;  // Get current month
        setSelectedCurso(currentMonth > 6 ? '2' : '1');  // Set selected course based on the current month
      }
    };

    fetchCursosYActualizarTareas();  // Call the fetch function when selected year changes
  }, [selectedAño]);

  // Effect hook to fetch tasks when the selected course or year changes
  useEffect(() => {
    const fetchTareas = async () => {
      if (selectedCurso && selectedAño) {
        const perfil = await getDatosPerfil();  // Fetch user profile
        const tareasRecuperadas = await getTareas(
          perfil.sede,
          Number(selectedCurso),
          Number(selectedAño)
        );

        // Sort tasks in descending order by task_id
        const tareasOrdenadas = tareasRecuperadas.sort((a: Tarea, b: Tarea) => {
          return b.task_id - a.task_id;  // Sort in descending order
        });

        setTareas(Array.isArray(tareasOrdenadas) ? tareasOrdenadas : []);  // Set tasks to state
      }
    };

    fetchTareas();  // Call the fetch function when selected course or year changes
  }, [selectedCurso, selectedAño]);

  // Handle closing the modal and fetching tasks again
  const handleModalClose = () => {
    setIsModalOpen(false);  // Close the modal
    const fetchTareas = async () => {
      if (selectedCurso && selectedAño) {
        const perfil = await getDatosPerfil();  // Fetch user profile
        const tareasRecuperadas = await getTareas(
          perfil.sede,
          Number(selectedCurso),
          Number(selectedAño)
        );

        // Sort tasks in descending order by task_id
        const tareasOrdenadas = tareasRecuperadas.sort((a: Tarea, b: Tarea) => {
          return b.task_id - a.task_id;  // Sort in descending order
        });

        setTareas(Array.isArray(tareasOrdenadas) ? tareasOrdenadas : []);  // Set tasks to state
      }
    };
    fetchTareas();  // Call the fetch function when modal is closed
  };

  // Format time from 24-hour format to 12-hour format
  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);  // Split time string into hours, minutes, and seconds
    const amPm = hours < 12 ? 'AM' : 'PM';  // Determine AM or PM
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amPm}`;  // Return formatted time
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tareasPorPagina;  // Index of the last task on the current page
  const currentTareas = tareas.slice(indexOfLastTask - tareasPorPagina, indexOfLastTask);  // Get tasks for the current page
  const totalPages = Math.ceil(tareas.length / tareasPorPagina);  // Calculate total number of pages

  // Function to change the current page
  const paginate = (page: number) => {
    if (page < 1) page = 1;  // Ensure page is not less than 1
    if (page > totalPages) page = totalPages;  // Ensure page is not greater than total pages
    setCurrentPage(page);  // Update the current page
  };

  // Function to get the range of page numbers for pagination buttons
  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));  // Calculate start page number
    let end = Math.min(totalPages, start + maxPageButtons - 1);  // Calculate end page number

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);  // Adjust start page number if necessary
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);  // Return an array of page numbers
  };

  // Function to format a date string to a readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);  // Create a Date object from the string
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;  // Return formatted date
  };

  // Effect hook to adjust the number of tasks per page and the number of page buttons based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTareasPorPagina(8);  // Set tasks per page to 8 for small screens
        setMaxPageButtons(5);  // Set maximum page buttons to 5 for small screens
      } else {
        setTareasPorPagina(5);  // Set tasks per page to 5 for large screens
        setMaxPageButtons(10);  // Set maximum page buttons to 10 for large screens
      }
    };

    handleResize();  // Call the resize function on initial load
    window.addEventListener('resize', handleResize);  // Add event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize);  // Cleanup event listener on unmount
    };
  }, []);

  // Check if the selected year is the current year
  const isCurrentYear = selectedAño === new Date().getFullYear().toString();

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
        element: '#year-select', // ID del campo de selección de año
        popover: {
          title: 'Seleccionar Año',
          description: 'Selecciona el año para el cual deseas ver las tareas.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#curso-select', // ID del campo de selección de curso
        popover: {
          title: 'Seleccionar Curso',
          description: 'Selecciona el curso para el cual deseas ver las tareas.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#crear-tarea-button', // ID del botón "Crear Tarea"
        popover: {
          title: 'Crear Tarea',
          description: 'Haz clic aquí para crear una nueva tarea.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#tareas-list', // ID de la lista de tareas
        popover: {
          title: 'Lista de Tareas',
          description: 'Aquí se muestran las tareas creadas.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#pagination', // ID de la paginación
        popover: {
          title: 'Paginación',
          description: 'Navega entre las páginas de la lista de tareas.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      <Breadcrumb pageName="Crear Tareas" />
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-1 gap-3">
          <select
            id="year-select"
            value={selectedAño}
            onChange={(e) => setSelectedAño(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white w-full md:w-1/4"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <select
            id="curso-select"
            value={selectedCurso}
            onChange={(e) => setSelectedCurso(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white w-full md:w-1/2"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.course_id} value={curso.course_id.toString()}>
                {curso.courseName}
              </option>
            ))}
          </select>
          <button
            id="crear-tarea-button"
            onClick={() => {
              setIsModalOpen(true);
              setModalMode("create");
            }}
            className={`px-6 py-3 rounded-md hover:bg-gradient-to-l transition duration-300 flex items-center justify-center ${isCurrentYear ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
            disabled={!isCurrentYear}
          >
            Nueva Tarea
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

        {tareas.length > 0 ? (
          <div id="tareas-list" className="space-y-4">
            {currentTareas.map((tarea) => (
              <div
                key={tarea.task_id}
                className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md flex items-center justify-between"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-black dark:text-white">{tarea.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tarea.description}</p>
                  <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                    <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}</p>
                    <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setModalMode("edit");
                      setSelectedTaskId(tarea.task_id);
                    }}
                    className={`ml-4 px-3 py-2 rounded-full flex items-center justify-center ${isCurrentYear ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isCurrentYear}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M17.707 6.293l-2.414-2.414a1 1 0 0 0-1.414 0l-9 9a1 1 0 0 0-.293.707v3.586a1 1 0 0 0 1 1h3.586a1 1 0 0 0 .707-.293l9-9a1 1 0 0 0 0-1.414z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div id="pagination" className="mt-4 flex justify-center">
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
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No hay tareas disponibles</p>
        )}
        {isModalOpen && <CreaTarea onClose={handleModalClose} mode={modalMode} taskId={selectedTaskId} />}
      </div>
    </>
  );
};

export default CrearTareas;