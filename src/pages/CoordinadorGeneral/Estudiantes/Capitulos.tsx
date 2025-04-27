import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { enviaComentario } from '../../../ts/Generales/EnviaComentario';
import { getComentarios, ComentarioData, } from '../../../ts/Generales/GetComentario';
import { updateComentStats } from '../../../ts/Administrador/UpdateComentStat';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

// The interface has been updated to include comment_active
interface Comentario {
  id: number;
  texto: string;
  fecha: string;
  role: string;
  comment_active: boolean;
}

const Capitulos: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigating between pages
  const location = useLocation(); // Hook to get the state from the URL
  const { tarea, estudiante } = location.state || {}; // Destructure task and student from the location state
  const [comentario, setComentario] = useState<string>(''); // State to store the new comment
  const [comentariosPrevios, setComentariosPrevios] = useState<Comentario[]>(
    [],
  ); // State to store previous comments

  // Determines if the comment writing area and buttons should be disabled.
  // If there is at least one comment and its comment_active property is false, it is disabled.
  const isComentarioBloqueado =
    comentariosPrevios.length > 0 &&
    comentariosPrevios[0].comment_active === false;

  // Function to check if the "Enviar Comentario" button should be disabled due to the deadline
  const isButtonDisabled = (): boolean => {
    const currentDate = new Date(); // Current date and time
    const endDate = new Date(tarea.endTask); // Task end date
    const currentDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ); // Current date without time

    // Get the current hour, minute, and second
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    // Format the current time as HH:mm:ss
    const formattedCurrentTime = `${currentHour
      .toString()
      .padStart(2, '0')}:${currentMinutes
        .toString()
        .padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    // Combine date and time into a format like YYYY-MM-DD HH:mm:ss
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split('T')[0]
      } ${formattedCurrentTime}`;

    const endDateOnly = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
      ),
    ); // Remove the time from the end date
    const formattedEndDateTime = `${endDateOnly.toISOString().split('T')[0]} ${tarea.endTime || ''
      }`;

    if (isNaN(endDateOnly.getTime())) return true; // If the end date is invalid, disable the button
    return formattedCurrentDateTime > formattedEndDateTime; // Disable if the current date is later than the deadline
  };

  // Function to format the date as day/month/year
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Load previous comments when the component mounts
  useEffect(() => {
    const cargarComentarios = async () => {
      if (!tarea || !estudiante) return; // If there is no task or student, do not load comments

      const taskId = tarea.task_id; // Get the task ID
      const userId = estudiante.id; // Get the student ID

      try {
        // Get the comments from the API
        const comentarios: ComentarioData = await getComentarios(
          taskId,
          userId,
        );
        // Format the comments into a more usable structure, including comment_active
        const comentariosFormateados = comentarios.comments.map((comment) => ({
          id: comment.comment_id, // Unique comment ID
          texto: comment.comment,
          fecha: formatearFecha(comment.datecomment),
          role: comment.role,
          comment_active: comment.comment_active,
        }));
        setComentariosPrevios(comentariosFormateados); // Update the state with the formatted comments
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    };

    cargarComentarios();
  }, [tarea, estudiante]);

  // Handle the change in the textarea for the comment
  const handleComentarioChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setComentario(e.target.value);
  };

  // Handle disabling a comment and updating the comment list
  const handleDesactivarComentario = async (comentId: number, estaBloqueado: boolean) => {
    try {
      // Call the API to update the comment status
      await updateComentStats(comentId);

      // After updating, fetch the comment list again
      if (tarea && estudiante) {
        const updatedComentarios: ComentarioData = await getComentarios(
          tarea.task_id,
          estudiante.id,
        );
        const comentariosFormateados = updatedComentarios.comments.map(
          (comment) => ({
            id: comment.comment_id,
            texto: comment.comment,
            fecha: formatearFecha(comment.datecomment),
            role: comment.role,
            comment_active: comment.comment_active,
          }),
        );
        setComentariosPrevios(comentariosFormateados);
      }

      Swal.fire({
        title: estaBloqueado ? 'Comentarios activados' : 'Comentario bloqueado',
        text: estaBloqueado
          ? 'Los comentarios se han activado correctamente'
          : 'Los comentario se han bloqueado exitosamente',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-green-500 text-white px-4 py-2 rounded-md',
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
          },
        });
      }
    }
  };

  // Handle submitting a new comment
  const handleEnviarComentario = async () => {
    if (!tarea || !estudiante) {
      Swal.fire({
        title: 'Error',
        text: 'Datos de la tarea o estudiante no disponibles',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
        },
      });
      return;
    }

    const taskId = tarea.task_id;
    const user_id = estudiante.id;

    const commentData = {
      comment: comentario,
      role: 'teacher',
      user_id: user_id,
    };

    try {
      await enviaComentario(taskId, commentData);
      // Update the list of previous comments with the new comment
      setComentariosPrevios((prevComentarios) => [
        {
          id: prevComentarios.length + 1,
          texto: comentario,
          fecha: new Date().toLocaleDateString(),
          role: 'teacher',
          comment_active: true, // Assume that the new comment is active
        },
        ...prevComentarios,
      ]);
      setComentario('');
      Swal.fire({
        title: 'Comentario enviado',
        text: 'El comentario se ha enviado exitosamente',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-green-500 text-white px-4 py-2 rounded-md',
        },
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Hubo un error al enviar el comentario',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
        },
      });
    }
  };

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
        element: '#back-button', // ID del botón "Regresar"
        popover: {
          title: 'Regresar',
          description: 'Haz clic aquí para regresar a la lista de tareas.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#comentarios-previos', // ID de la sección de comentarios previos
        popover: {
          title: 'Comentarios Previos',
          description:
            'Aquí puedes ver los comentarios anteriores sobre la tarea.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#enviar-comentario', // ID de la sección de enviar comentario
        popover: {
          title: 'Enviar Comentario',
          description: 'Aquí puedes escribir y enviar un nuevo comentario.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#textarea-comentario', // ID del textarea para comentarios
        popover: {
          title: 'Escribir Comentario',
          description: 'Escribe tu comentario en este campo.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#enviar-button', // ID del botón "Enviar Comentario"
        popover: {
          title: 'Enviar Comentario',
          description: 'Haz clic aquí para enviar tu comentario.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#bloquear-button', // ID del botón "Bloquear Comentarios"
        popover: {
          title: 'Bloquear Comentarios',
          description: 'Haz clic aquí para bloquear los comentarios.',
          side: 'bottom',
          align: 'start',
        },
      },
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      <Breadcrumb pageName={`Detalle del ${tarea?.title}`} />

      <div className="mb-4 flex justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            id="back-button"
            className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
            onClick={() => navigate(-1)}
          >
            <span className="mr-2">←</span> Regresar
          </button>

          {/* Botón para iniciar el recorrido */}
          <button
            style={{ width: '35px', height: '35px' }}
            onClick={startTour}
            className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-md transition duration-300 group"
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
            <span className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-center">
              ¿Necestitas ayuda?
              iniciar recorrido
            </span>
          </button>
        </div>

        {/* Botón para bloquear comentarios */}
        <div className="mt-4">
          <button
            id="bloquear-button"
            className={`px-4 py-2 rounded-md ${isComentarioBloqueado
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            onClick={() => handleDesactivarComentario(comentariosPrevios[0]?.id, isComentarioBloqueado)}
          >
            {isComentarioBloqueado ? 'Activar Comentario' : 'Bloquear Comentarios'}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Display the previous comments */}
        <div
          id="comentarios-previos"
          className="w-full md:w-1/2 h-72 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto"
        >
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
            Comentarios Previos
          </h4>
          <ul className="space-y-4">
            {comentariosPrevios.map((comentario, index) => (
              <li
                key={`${comentario.id}-${index}`}
                className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {comentario.texto}
                </p>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {comentario.role}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {comentario.fecha}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form to submit a new comment */}
        <div
          id="enviar-comentario"
          className="w-full md:w-1/2 h-72 p-4 bg-white dark:bg-boxdark rounded-lg"
        >
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
            Enviar Comentario
          </h4>
          <textarea
            id="textarea-comentario"
            disabled={isButtonDisabled() || isComentarioBloqueado}
            value={comentario}
            onChange={handleComentarioChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Escribe tu comentario aquí..."
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-1 md:mt-4">
            {isButtonDisabled() && (
              <div className="mb-2 md:mb-0">
                <p className="text-red-500 text-sm">
                  Tarea llegó a fecha límite.
                </p>
              </div>
            )}
            {isComentarioBloqueado && (
              <div className="mb-2 md:mb-0">
                <p className="text-red-500 text-sm">
                  Has bloqueado los comentarios.
                </p>
              </div>
            )}
            <button
              id="enviar-button"
              disabled={isButtonDisabled() || isComentarioBloqueado}
              className={`px-4 py-2 rounded-md ${isButtonDisabled() || isComentarioBloqueado
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                } ${!(isButtonDisabled() || isComentarioBloqueado) && 'ml-auto'}`}
              onClick={handleEnviarComentario}
            >
              Enviar Comentario
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Capitulos;
