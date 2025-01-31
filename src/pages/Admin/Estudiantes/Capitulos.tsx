import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { enviaComentario } from '../../../ts/Generales/EnviaComentario';
import { getComentarios, ComentarioData } from '../../../ts/Generales/GetComentario';

// Interface definition for Comment structure
interface Comentario {
  id: number;
  texto: string;
  fecha: string;
  role: string;
}

const Capitulos: React.FC = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  const location = useLocation(); // Hook to get the current location (URL) state
  const { tarea, estudiante } = location.state || {}; // Extract tarea (task) and estudiante (student) from the location state
  const [comentario, setComentario] = useState<string>(''); // State to store the new comment
  const [comentariosPrevios, setComentariosPrevios] = useState<Comentario[]>([]); // State to store previous comments

  // Function to check if the "send comment" button should be disabled
  const isButtonDisabled = (): boolean => {
    const currentDate = new Date(); // Current date and time
    const endDate = new Date(tarea.endTask); // End date from task
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Current date without time

    // Get current time in hours, minutes, and seconds
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    // Format current time as HH:mm:ss
    const formattedCurrentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    // Combine date and time in YYYY-MM-DD HH:mm:ss format
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split('T')[0]} ${formattedCurrentTime}`;

    const endDateOnly = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())); // Remove time from end date
    // Combine end date and time in YYYY-MM-DD HH:mm:ss format
    const formattedEndDateTime = `${endDateOnly.toISOString().split('T')[0]} ${tarea.endTime || ''}`;

    // If end date is invalid, disable the button
    if (isNaN(endDateOnly.getTime())) return true;
    return formattedCurrentDateTime > formattedEndDateTime; // Disable button if current time is past end time
  };

  // Function to format date in day/month/year format
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Load previous comments when the component mounts
  useEffect(() => {
    const cargarComentarios = async () => {
      if (!tarea || !estudiante) return; // If tarea or estudiante are not available, don't load comments

      const taskId = tarea.task_id; // Get task ID
      const userId = estudiante.id; // Get student ID

      try {
        // Get previous comments from the API
        const comentarios: ComentarioData = await getComentarios(taskId, userId);
        // Format the comments into a more usable structure
        const comentariosFormateados = comentarios.comments.map((comment, index) => ({
          id: index + 1,
          texto: comment.comment,
          fecha: formatearFecha(comment.datecomment),
          role: comment.role,
        }));
        setComentariosPrevios(comentariosFormateados); // Update state with the formatted comments
      } catch (error) {
        console.error('Error al cargar comentarios:', error); // Log error if loading comments fails
      }
    };

    cargarComentarios(); // Call the function to load comments
  }, [tarea, estudiante]); // Reload comments when tarea or estudiante change

  // Handle comment input change
  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value); // Update comment state with the new value
  };

  // Handle sending a new comment
  const handleEnviarComentario = async () => {
    if (!tarea || !estudiante) {
      // Show error if tarea or estudiante are missing
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

    const taskId = tarea.task_id; // Get task ID
    const user_id = estudiante.id; // Get student ID

    const commentData = {
      comment: comentario, // The new comment text
      role: 'teacher', // The role of the person sending the comment
      user_id: user_id, // The student ID
    };

    try {
      console.log(commentData); // Log the comment data for debugging
      await enviaComentario(taskId, commentData); // Send the comment via the API
      // Update the list of previous comments with the new comment
      setComentariosPrevios((prevComentarios) => [
        { id: prevComentarios.length + 1, texto: comentario, fecha: new Date().toLocaleDateString(), role: 'teacher' },
        ...prevComentarios,
      ]);
      setComentario(''); // Clear the comment input field
      // Show success message after comment is sent
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
      // Show error message if sending the comment fails
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

  return (
    <>
      <Breadcrumb pageName={`Detalle del ${tarea?.title}`} /> {/* Breadcrumb showing the task title */}

      <div className="mb-4 flex justify-between">
        {/* Button to navigate back */}
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Display previous comments */}
        <div className="w-full md:w-1/2 h-72 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Comentarios Previos</h4>
          <ul className="space-y-4">
            {comentariosPrevios.map((comentario) => (
              <li key={comentario.id} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">{comentario.texto}</p>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{comentario.role}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{comentario.fecha}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form to send a new comment */}
        <div className="w-full md:w-1/2 h-72 p-4 bg-white dark:bg-boxdark rounded-lg">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enviar Comentario</h4>
          <textarea
            disabled={isButtonDisabled()} // Disable textarea if the button is disabled
            value={comentario} // Bind the textarea value to the comment state
            onChange={handleComentarioChange} // Handle input changes
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Escribe tu comentario aquí..." // Placeholder text
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-1 md:mt-4">
            {isButtonDisabled() && (
              <div className="mb-2 md:mb-0">
                {/* Display a message if the task has reached its deadline */}
                <p className="text-red-500 text-sm">Tarea llegó a fecha límite.</p>
              </div>
            )}
            <button
              className={`px-4 py-2 rounded-md ${isButtonDisabled()
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                } ${!isButtonDisabled() && 'ml-auto'}`}
              onClick={handleEnviarComentario} // Handle button click to send comment
              disabled={isButtonDisabled()} // Disable the button if needed
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
