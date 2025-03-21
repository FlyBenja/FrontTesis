import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { enviaComentario } from '../../ts/Generales/EnviaComentario';
import { getComentarios, ComentarioData } from '../../ts/Generales/GetComentario';
import { getDatosPerfil, PerfilData } from '../../ts/Generales/GetDatsPerfil';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

// Interface defining the structure for the comments
interface Comentario {
  id: number;
  texto: string;
  fecha: string;
  role: string;
  comment_active: boolean;
}

const InfoCapitulo: React.FC = () => {
  const navigate = useNavigate();  // Hook for navigating to different routes
  const location = useLocation();  // Hook for accessing location state passed via navigation

  // Destructure data passed from the previous page
  const { task_id, endTask, endTime, NameCapitulo } = location.state || {};

  // States for managing comment text, previous comments, user ID, and whether the input is blocked
  const [comentario, setComentario] = useState<string>('');  // State for current comment text
  const [comentariosPrevios, setComentariosPrevios] = useState<Comentario[]>([]);  // State for storing previous comments
  const [userId, setUserId] = useState<number | null>(null);  // State for storing the user ID
  const [inputBloqueado, setInputBloqueado] = useState<boolean>(true);  // State for disabling the input field

  // Determina si el componente de escritura y botones deben estar deshabilitados.
  // Si existe al menos un comentario y su propiedad comment_active es false, se deshabilita.
  const isComentarioBloqueado = comentariosPrevios.length > 0 && comentariosPrevios[0].comment_active === false;

  // Function to check whether the button should be disabled based on the task end time
  const isButtonDisabled = (): boolean => {
    const currentDate = new Date();
    const endDate = new Date(endTask);  // Convert the passed endTask date into a Date object
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Strip the time for current date comparison

    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    // Format the current time into HH:MM:SS
    const formattedCurrentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split('T')[0]} ${formattedCurrentTime}`;

    // Format the task's end time for comparison
    const endDateOnly = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    const formattedEndDateTime = `${endDateOnly.toISOString().split('T')[0]} ${endTime || ''}`;

    // Return true if the task's end date/time is in the past
    if (isNaN(endDateOnly.getTime())) return true;
    return formattedCurrentDateTime > formattedEndDateTime;
  };

  // Function to format dates into a user-friendly format (DD/MM/YYYY)
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Function to load the previous comments for the task
  const cargarComentarios = async () => {
    if (!task_id || !userId) return;  // If task_id or userId are missing, do nothing

    try {
      // Fetch the comments using the task_id and user_id
      const comentarios: ComentarioData = await getComentarios(task_id, userId);

      // Map the fetched comments into the required format
      const comentariosFormateados = comentarios.comments.map((comment) => ({
        id: comment.comment_id, // ID único del comentario
        texto: comment.comment,
        fecha: formatearFecha(comment.datecomment),
        role: comment.role,
        comment_active: comment.comment_active,
      }));

      // Update state with formatted comments
      setComentariosPrevios(comentariosFormateados);

      // Check if the first comment is from the student and block input accordingly
      if (comentariosFormateados.length > 0 && comentariosFormateados[0].role === 'Estudiante') {
        setInputBloqueado(true);
      } else {
        setInputBloqueado(false);
      }
    } catch (error) {
      // In case of error, clear comments and block input by default
      setComentariosPrevios([]);
      setInputBloqueado(true);
    }
  };

  // Hook to load the user profile data on component mount
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfilData: PerfilData = await getDatosPerfil();  // Fetch user profile data
        setUserId(perfilData.user_id);  // Set the user ID from the profile data
      } catch (error) {
        // Show error alert if profile data cannot be fetched
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los datos del perfil',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    cargarPerfil();  // Call the function to load profile data
  }, []);

  // Hook to load comments whenever task_id or userId changes
  useEffect(() => {
    cargarComentarios();  // Load the comments after the component mounts
  }, [task_id, userId]);

  // Handle changes in the comment textarea input
  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

  // Function to handle sending the comment
  const handleEnviarComentario = async () => {
    if (!task_id || !userId) {
      // Show error if task_id or user_id are missing
      Swal.fire({
        title: 'Error',
        text: 'Datos de la tarea o del usuario no disponibles',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
        },
      });
      return;
    }

    // Prepare the comment data
    const commentData = {
      comment: comentario,
      role: 'student',
      user_id: userId,
    };

    try {
      // Attempt to send the comment via the API
      await enviaComentario(task_id, commentData);
      setComentario('');  // Clear the comment input
      await cargarComentarios();  // Reload comments after submitting
      // Show success alert
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
      // Show error alert if there was an issue submitting the comment
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
          description: 'Aquí puedes ver los comentarios anteriores sobre la tarea.',
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
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      {/* Breadcrumb to show the current page's name */}
      <Breadcrumb pageName={`Detalle del Capítulo - ${NameCapitulo}`} />

      <div className="mb-4 flex justify-between">
        {/* Button to go back to the previous page */}
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      {/* Botón para iniciar el recorrido */}
      <div className="flex justify-center">
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

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Display previous comments */}
        <div id="comentarios-previos" className="w-full md:w-1/2 h-72 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Comentarios Previos</h4>
          {comentariosPrevios.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay comentarios sobre alguna corrección</p>
          ) : (
            <ul className="space-y-4">
              {/* List of previous comments */}
              {comentariosPrevios.map((comentario) => (
                <li key={comentario.id} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comentario.texto}</p>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{comentario.role}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{comentario.fecha}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Send new comment section */}
        <div id="enviar-comentario" className="w-full md:w-1/2 h-72 p-4 bg-white dark:bg-boxdark rounded-lg">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enviar Comentario</h4>
          {/* Textarea for typing the comment */}
          <textarea
            id="textarea-comentario"
            value={comentario}
            onChange={handleComentarioChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Escribe tu comentario aquí..."
            disabled={inputBloqueado || isButtonDisabled() || isComentarioBloqueado}  // Disable textarea if input is blocked or button is disabled
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-1 md:mt-4">
            {/* Show a message if the button is disabled */}
            {isButtonDisabled() && (
              <div className="mb-2 md:mb-0">
                <p className="text-red-500 text-sm">Tarea llegó a fecha límite.</p>
              </div>
            )}
            {isComentarioBloqueado && (
              <div className="mb-2 md:mb-0">
                <p className="text-red-500 text-sm">Admin ha bloqueado los comentarios.</p>
              </div>
            )}
            {/* Submit button to send the comment */}
            <button
              id="enviar-button"
              className={`px-4 py-2 rounded-md ml-auto ${inputBloqueado || isButtonDisabled() || isComentarioBloqueado
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              onClick={handleEnviarComentario}
              disabled={inputBloqueado || isButtonDisabled() || isComentarioBloqueado}  // Disable the button based on the condition
            >
              Enviar Comentario
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoCapitulo;