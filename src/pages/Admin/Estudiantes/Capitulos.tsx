import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { enviaComentario } from '../../../ts/Generales/EnviaComentario';
import { getComentarios, ComentarioData } from '../../../ts/Generales/GetComentario';

interface Comentario {
  id: number;
  texto: string;
  fecha: string;
  role: string;
}

const Capitulos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tarea, estudiante } = location.state || {};
  const [comentario, setComentario] = useState<string>('');
  const [comentariosPrevios, setComentariosPrevios] = useState<Comentario[]>([]);

  // Función para verificar si el botón debe estar deshabilitado
  const isButtonDisabled = (): boolean => {
    const currentDate = new Date();
    const endDate = new Date(tarea.endTask);
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    const formattedCurrentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split('T')[0]} ${formattedCurrentTime}`;

    const endDateOnly = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    const formattedEndDateTime = `${endDateOnly.toISOString().split('T')[0]} ${tarea.endTime || ''}`;

    if (isNaN(endDateOnly.getTime())) return true;
    return formattedCurrentDateTime > formattedEndDateTime;
  };

  // Función para formatear la fecha en formato día/mes/año
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Cargar los comentarios previos al montar el componente
  useEffect(() => {
    const cargarComentarios = async () => {
      if (!tarea || !estudiante) return;

      const taskId = tarea.task_id;
      const userId = estudiante.id;

      try {
        const comentarios: ComentarioData = await getComentarios(taskId, userId);
        const comentariosFormateados = comentarios.comments.map((comment, index) => ({
          id: index + 1,
          texto: comment.comment,
          fecha: formatearFecha(comment.datecomment),
          role: comment.role,
        }));
        setComentariosPrevios(comentariosFormateados);
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    };

    cargarComentarios();
  }, [tarea, estudiante]);

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

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
      setComentariosPrevios((prevComentarios) => [
        { id: prevComentarios.length + 1, texto: comentario, fecha: new Date().toLocaleDateString(), role: 'teacher' },
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
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Comentarios previos */}
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

        {/* Enviar comentario */}
        <div className="w-full md:w-1/2 h-72 p-4 bg-white dark:bg-boxdark rounded-lg">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enviar Comentario</h4>
          <textarea
            disabled={isButtonDisabled()}
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
            <button
              className={`px-4 py-2 rounded-md ${isButtonDisabled()
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                } ${!isButtonDisabled() && 'ml-auto'}`}
              onClick={handleEnviarComentario}
              disabled={isButtonDisabled()}
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
