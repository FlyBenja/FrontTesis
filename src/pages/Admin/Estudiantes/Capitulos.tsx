import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { enviaComentario } from '../../../ts/Generales/EnviaComentario';
import { getComentarios, ComentarioData } from '../../../ts/Generales/GetComentario';
import { updateComentStats } from '../../../ts/Admin/UpdateComentStat';

// Se actualiza la definición de la interfaz para incluir comment_active
interface Comentario {
  id: number;
  texto: string;
  fecha: string;
  role: string;
  comment_active: boolean;
}

const Capitulos: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const location = useLocation(); // Hook para obtener el estado de la URL
  const { tarea, estudiante } = location.state || {}; // Se extraen tarea y estudiante del estado
  const [comentario, setComentario] = useState<string>(''); // Estado para almacenar el nuevo comentario
  const [comentariosPrevios, setComentariosPrevios] = useState<Comentario[]>([]); // Estado para almacenar los comentarios previos

  // Determina si el componente de escritura y botones deben estar deshabilitados.
  // Si existe al menos un comentario y su propiedad comment_active es false, se deshabilita.
  const isComentarioBloqueado = comentariosPrevios.length > 0 && comentariosPrevios[0].comment_active === false;

  // Función para verificar si el botón de "Enviar Comentario" debe estar deshabilitado por fecha límite
  const isButtonDisabled = (): boolean => {
    const currentDate = new Date(); // Fecha y hora actual
    const endDate = new Date(tarea.endTask); // Fecha de término de la tarea
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Fecha actual sin tiempo

    // Obtener la hora, minutos y segundos actuales
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    // Formatear la hora actual como HH:mm:ss
    const formattedCurrentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes
      .toString()
      .padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    // Combinar fecha y hora en formato YYYY-MM-DD HH:mm:ss
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split('T')[0]} ${formattedCurrentTime}`;

    const endDateOnly = new Date(
      Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
    ); // Quitar tiempo de la fecha de término
    const formattedEndDateTime = `${endDateOnly.toISOString().split('T')[0]} ${tarea.endTime || ''}`;

    if (isNaN(endDateOnly.getTime())) return true; // Si la fecha de término es inválida, se deshabilita
    return formattedCurrentDateTime > formattedEndDateTime; // Se deshabilita si la fecha actual es posterior a la fecha límite
  };

  // Función para formatear la fecha en formato día/mes/año
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Cargar los comentarios previos cuando el componente se monta
  useEffect(() => {
    const cargarComentarios = async () => {
      if (!tarea || !estudiante) return; // Si no hay tarea o estudiante, no se cargan comentarios

      const taskId = tarea.task_id; // Se obtiene el ID de la tarea
      const userId = estudiante.id; // Se obtiene el ID del estudiante

      try {
        // Se obtienen los comentarios desde la API
        const comentarios: ComentarioData = await getComentarios(taskId, userId);
        // Se formatean los comentarios en una estructura más usable, incluyendo comment_active
        const comentariosFormateados = comentarios.comments.map((comment) => ({
          id: comment.comment_id, // ID único del comentario
          texto: comment.comment,
          fecha: formatearFecha(comment.datecomment),
          role: comment.role,
          comment_active: comment.comment_active,
        }));
        setComentariosPrevios(comentariosFormateados); // Se actualiza el estado con los comentarios formateados
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    };

    cargarComentarios();
  }, [tarea, estudiante]);

  // Manejar el cambio en el textarea del comentario
  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

  // Manejar la desactivación de un comentario y actualizar la lista de comentarios
  const handleDesactivarComentario = async (comentId: number) => {
    try {
      // Llamada a la API para actualizar el estado del comentario
      await updateComentStats(comentId);

      // Después de actualizar el estado, se vuelve a obtener la lista de comentarios
      if (tarea && estudiante) {
        const updatedComentarios: ComentarioData = await getComentarios(tarea.task_id, estudiante.id);
        const comentariosFormateados = updatedComentarios.comments.map((comment) => ({
          id: comment.comment_id,
          texto: comment.comment,
          fecha: formatearFecha(comment.datecomment),
          role: comment.role,
          comment_active: comment.comment_active,
        }));
        setComentariosPrevios(comentariosFormateados);
      }

      Swal.fire({
        title: 'Comentario bloqueado',
        text: 'El comentario se ha bloqueado exitosamente',
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

  // Manejar el envío de un nuevo comentario
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
      console.log(commentData);
      await enviaComentario(taskId, commentData);
      // Se actualiza la lista de comentarios previos con el nuevo comentario
      setComentariosPrevios((prevComentarios) => [
        {
          id: prevComentarios.length + 1,
          texto: comentario,
          fecha: new Date().toLocaleDateString(),
          role: 'teacher',
          comment_active: true, // Se asume que el comentario nuevo está activo
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

  return (
    <>
      <Breadcrumb pageName={`Detalle del ${tarea?.title}`} />

      <div className="mb-4 flex justify-between">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>

        <button
          disabled={isComentarioBloqueado}
          className={`px-4 py-2 rounded-md ${isComentarioBloqueado
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          onClick={() => !isComentarioBloqueado && handleDesactivarComentario(comentariosPrevios[0]?.id)}
        >
          Bloquear Comentarios
        </button>
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Se muestran los comentarios previos */}
        <div className="w-full md:w-1/2 h-72 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Comentarios Previos</h4>
          <ul className="space-y-4">
            {comentariosPrevios.map((comentario, index) => (
              <li key={`${comentario.id}-${index}`} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">{comentario.texto}</p>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{comentario.role}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{comentario.fecha}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario para enviar un nuevo comentario */}
        <div className="w-full md:w-1/2 h-72 p-4 bg-white dark:bg-boxdark rounded-lg">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enviar Comentario</h4>
          <textarea
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
                <p className="text-red-500 text-sm">Tarea llegó a fecha límite.</p>
              </div>
            )}
            {isComentarioBloqueado && (
              <div className="mb-2 md:mb-0">
                <p className="text-red-500 text-sm">Has bloqueado los comentarios.</p>
              </div>
            )}
            <button
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
