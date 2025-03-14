import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getTareasSede, Tarea } from '../../../ts/Generales/GetTareasSede';
import {
  getTareasEstudiante,
  TareaEstudiante,
} from '../../../ts/Estudiantes/GetTareasEstudiante';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

const TareasEstudiante: React.FC = () => {
  // React Router hooks to navigate and get the current location
  const navigate = useNavigate();
  const location = useLocation();

  // State hooks to store tasks data and student data
  const [tareas, setTareas] = useState<Tarea[]>([]); // Tasks for the current sede
  const [sedeId, setSedeId] = useState<number | null>(null); // Sede ID for the current session
  const [tareasEstudiante, setTareasEstudiante] = useState<TareaEstudiante[]>(
    [],
  ); // Tasks for the specific student

  // Destructuring student and year from location state
  const { estudiante, selectedAño } = location.state || {};

  // Fetch profile data to get the current sede ID
  useEffect(() => {
    const fetchDatosPerfil = async () => {
      try {
        const { sede } = await getDatosPerfil(); // Fetch the current sede
        setSedeId(sede); // Set the sede ID in state
      } catch (err) {}
    };

    fetchDatosPerfil();
  }, []); // This effect runs once when the component mounts

  // Fetch tasks for the specific sede and selected year
  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null && selectedAño) {
        try {
          const tareasRecuperadas = await getTareasSede(sedeId, selectedAño); // Fetch tasks for the sede and year
          setTareas(tareasRecuperadas); // Set tasks in state
        } catch (err) {}
      }
    };

    fetchTareas();
  }, [sedeId, selectedAño]); // This effect runs when either sedeId or selectedAño changes

  // Fetch tasks specific to the student
  useEffect(() => {
    const fetchTareasEstudiante = async () => {
      if (estudiante && selectedAño && sedeId !== null) {
        const tareasEst = await getTareasEstudiante(
          estudiante.id,
          selectedAño,
          sedeId,
        ); // Fetch tasks for the student
        setTareasEstudiante(tareasEst); // Set student tasks in state
      }
    };

    fetchTareasEstudiante();
  }, [estudiante, selectedAño, sedeId]); // This effect runs when student, year, or sedeId changes

  // Sort the tasks with typeTask_id of 1 first
  const tareasOrdenadas = tareas.sort((a, b) => {
    if (a.typeTask_id === 1 && b.typeTask_id !== 1) {
      return -1; // Place tasks with typeTask_id 1 before others
    }
    if (a.typeTask_id !== 1 && b.typeTask_id === 1) {
      return 1; // Place tasks with typeTask_id 1 before others
    }
    return 0; // Keep the order the same for tasks with the same typeTask_id
  });

  // Handle task navigation and validation before proceeding
  const handleNavigate = (tarea: Tarea) => {
    // Find the student-specific task from tareasEstudiante
    const tareaEstudiante = tareasEstudiante.find(
      (t) => t.task_id === tarea.task_id,
    );

    // If task type is not 1, validate if it is submitted by the student
    if (tareaEstudiante && tarea.typeTask_id !== 1) {
      // If task is not submitted, show a warning and prevent navigation
      if (!tareaEstudiante.submission_complete) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No puedes acceder al capítulo porque la tarea no ha sido entregada por el estudiante.',
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'bg-red-600 text-white',
          },
        });
        return;
      }
    }

    // Navigate based on task type
    if (tarea.typeTask_id === 1) {
      navigate('/administrador/propuestas', {
        state: { tarea, estudiante, selectedAño },
      }); // Navigate to proposals if task type is 1
    } else {
      navigate('/administrador/capitulo', {
        state: { tarea, estudiante, selectedAño },
      }); // Navigate to chapter if task type is not 1
    }
  };

  // Format date to dd/mm/yyyy format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(
      date.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  // Format time to 12-hour AM/PM format
  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amPm}`;
  };

  // Función para iniciar el recorrido
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: 'Paso {{current}} de {{total}}',
    });

    driverObj.setSteps([
      {
        element: '#back-button',
        popover: {
          title: 'Regresar',
          description:
            'Haz clic aquí para regresar a la lista del la linea de tiempo del estudiante.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#proposals-section',
        popover: {
          title: 'Propuestas',
          description:
            'Aquí se muestran las tareas de tipo "Propuesta". Haz clic en una tarea para ver más detalles.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#chapters-section',
        popover: {
          title: 'Capítulos',
          description:
            'Aquí se muestran las tareas de tipo "Capítulo". Solo puedes acceder si el estudiante ha entregado la tarea.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive();
  };

  return (
    <>
      <Breadcrumb pageName="Tareas del Estudiante" />

      <div className="mb-4 flex items-center justify-between sm:justify-start gap-4">
        {/* Botón de regresar */}
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
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
      <div className="mx-auto max-w-5xl px-4 py-4">
        {/* Botón para iniciar el recorrido */}

        {/* If no tasks are found, show a message */}
        {tareasOrdenadas.length === 0 ? (
          <table className="min-w-full table-auto">
            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="py-2 px-4 text-center text-gray-500 dark:text-white"
                >
                  No Se Encontrarón Tareas Creadas.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            {/* Display tasks with typeTask_id = 1 (Proposals) */}
            <div id="proposals-section">
              {' '}
              {/* Agrega este ID */}
              {tareasOrdenadas
                .filter((tarea) => tarea.typeTask_id === 1)
                .map((tarea) => (
                  <div
                    key={tarea.task_id}
                    className="mb-6 p-4 rounded-lg shadow-md cursor-pointer bg-blue-100 dark:bg-boxdark"
                    onClick={() => handleNavigate(tarea)}
                  >
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {tarea.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tarea.description}
                    </p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                      <p>
                        Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} -{' '}
                        {formatTime24Hour(tarea.startTime)}
                      </p>
                      <p>
                        Fecha/Hora Final: {formatDate(tarea.endTask)} -{' '}
                        {formatTime24Hour(tarea.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Display tasks with typeTask_id !== 1 (Chapters) */}
            <div id="chapters-section">
              {' '}
              {/* Agrega este ID */}
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                Capítulos
              </h3>
              {tareasOrdenadas
                .filter((tarea) => tarea.typeTask_id !== 1)
                .map((tarea) => (
                  <div
                    key={tarea.task_id}
                    className="mb-6 p-4 rounded-lg shadow-md cursor-pointer bg-white dark:bg-boxdark"
                    onClick={() => handleNavigate(tarea)}
                  >
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {tarea.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tarea.description}
                    </p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                      <p>
                        Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} -{' '}
                        {formatTime24Hour(tarea.startTime)}
                      </p>
                      <p>
                        Fecha/Hora Final: {formatDate(tarea.endTask)} -{' '}
                        {formatTime24Hour(tarea.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TareasEstudiante;
