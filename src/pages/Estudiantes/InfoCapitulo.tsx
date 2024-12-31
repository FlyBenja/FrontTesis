import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { enviaComentario } from '../../ts/Generales/EnviaComentario';
import { getComentarios, ComentarioData } from '../../ts/Generales/GetComentario';
import { getDatosPerfil, PerfilData } from '../../ts/Generales/GetDatsPerfil';

interface Comentario {
  id: number;
  texto: string;
  fecha: string;
  role: string;
}

const InfoCapitulo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { task_id, endTask, endTime, NameCapitulo } = location.state || {};
  const [comentario, setComentario] = useState<string>('');
  const [comentariosPrevios, setComentariosPrevios] = useState<Comentario[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [inputBloqueado, setInputBloqueado] = useState<boolean>(true);

  // Función para verificar si el botón debe estar deshabilitado
  const isButtonDisabled = (): boolean => {
    const currentDate = new Date();
    const endDate = new Date(endTask); // Usar endTask que recibes como parámetro
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    const formattedCurrentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split('T')[0]} ${formattedCurrentTime}`;

    const endDateOnly = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    const formattedEndDateTime = `${endDateOnly.toISOString().split('T')[0]} ${endTime || ''}`;

    if (isNaN(endDateOnly.getTime())) return true;
    return formattedCurrentDateTime > formattedEndDateTime;
  };

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const cargarComentarios = async () => {
    if (!task_id || !userId) return;

    try {
      const comentarios: ComentarioData = await getComentarios(task_id, userId);
      const comentariosFormateados = comentarios.comments.map((comment, index) => ({
        id: index + 1,
        texto: comment.comment,
        fecha: formatearFecha(comment.datecomment),
        role: comment.role,
      }));
      setComentariosPrevios(comentariosFormateados);

      // Validar el role del primer comentario
      if (comentariosFormateados.length > 0 && comentariosFormateados[0].role === 'Estudiante') {
        setInputBloqueado(true);
      } else {
        setInputBloqueado(false);
      }
    } catch (error) {
      setComentariosPrevios([]);
      setInputBloqueado(true); // Bloquear por defecto si hay un error al cargar los comentarios
    }
  };

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfilData: PerfilData = await getDatosPerfil();
        setUserId(perfilData.user_id);
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los datos del perfil',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    cargarPerfil();
  }, []);

  useEffect(() => {
    cargarComentarios();
  }, [task_id, userId]);

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

  const handleEnviarComentario = async () => {
    if (!task_id || !userId) {
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

    const commentData = {
      comment: comentario,
      role: 'student',
      user_id: userId,
    };

    try {
      await enviaComentario(task_id, commentData);
      setComentario('');
      await cargarComentarios(); // Recargar los comentarios después de enviar
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
      <Breadcrumb pageName={`Detalle del Capítulo - ${NameCapitulo}`} />
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
          {comentariosPrevios.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay comentarios sobre alguna corrección</p>
          ) : (
            <ul className="space-y-4">
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

        {/* Enviar comentario */}
        <div className="w-full md:w-1/2 h-72 p-4 bg-white dark:bg-boxdark rounded-lg">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enviar Comentario</h4>
          <textarea
            value={comentario}
            onChange={handleComentarioChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Escribe tu comentario aquí..."
            disabled={inputBloqueado || isButtonDisabled()}
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-1 md:mt-4">
            {isButtonDisabled() && (
              <div className="mb-2 md:mb-0">
                <p className="text-red-500 text-sm">Tarea llegó a fecha límite.</p>
              </div>
            )}
            <button
              className={`px-4 py-2 rounded-md ml-auto ${inputBloqueado || isButtonDisabled()
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              onClick={handleEnviarComentario}
              disabled={inputBloqueado || isButtonDisabled()}
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
