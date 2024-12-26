import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareas } from '../../ts/Generales/GetTareas';
import { getTareasEstudiante } from '../../ts/Estudiantes/GetTareasEstudiante';
import { entregarTarea } from '../../ts/Estudiantes/EntregarTarea';

interface LocationState {
  courseTitle: string;
  courseId: number;
}

interface Tarea {
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
  submission_complete?: boolean;
}

const InfoCurso: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseTitle, courseId } = location.state as LocationState;

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const perfil = await getDatosPerfil();
        const currentYear = new Date().getFullYear();

        const tareasGenerales = await getTareas(perfil.sede, courseId, currentYear);
        const tareasEstudiante = await getTareasEstudiante(perfil.user_id, currentYear, perfil.sede);

        const tareasCombinadas = tareasGenerales
          .map((tareaGeneral) => {
            const tareaEstudiante = tareasEstudiante.find((t) => t.task_id === tareaGeneral.task_id);
            return {
              ...tareaGeneral,
              submission_complete: tareaEstudiante?.submission_complete ?? false,
            };
          })
          .filter((tarea) => tarea.typeTask_id !== 1); // Exclude tasks with typeTask_id = 1

        setTareas(tareasCombinadas);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar las tareas',
          text: 'Ocurrió un error al obtener las tareas. Intente nuevamente.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-red-600 text-white',
          },
        });
      }
    };

    fetchTareas();
  }, [courseId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amPm}`;
  };

  const handleNavigateToCapitulo = (chapterNumber: number, submissionComplete: boolean) => {
    if (!submissionComplete) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No puedes acceder al capítulo porque la tarea no está entregada.',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
      return;
    }
    navigate('/estudiantes/info-capitulo', {
      state: { chapterNumber },
    });
  };

  const handleEntregarTarea = async (task_id: number) => {
    try {
      const perfil = await getDatosPerfil();
      const taskData = { user_id: perfil.user_id, task_id };
      const tareaEntregada = tareas.find((tarea) => tarea.task_id === task_id);

      if (tareaEntregada) {
        await entregarTarea(taskData);

        Swal.fire({
          icon: 'success',
          title: 'Tarea entregada',
          text: `Tarea "${tareaEntregada.title}" entregada correctamente.`,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-green-600 text-white',
          },
        });

        setTareas((prevTareas) =>
          prevTareas.map((tarea) =>
            tarea.task_id === task_id ? { ...tarea, submission_complete: true } : tarea
          )
        );
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al entregar tarea',
        text: error.message || 'Ocurrió un error al intentar entregar la tarea.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
    }
  };

  const isButtonDisabled = (endTask: string, endTime: string | undefined): boolean => {
    const currentDate = new Date();
    const endDate = new Date(endTask);
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
  
  const indexOfLastTask = currentPage * 3;
  const currentTareas = tareas.slice(indexOfLastTask - 3, indexOfLastTask);
  const totalPages = Math.ceil(tareas.length / 3);

  const paginate = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <>
      <Breadcrumb pageName={courseTitle} />

      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-all"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {tareas.length > 0 ? (
          <div className="space-y-4">
            {currentTareas.map((tarea) => (
              <div
                key={tarea.task_id}
                className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between transform transition-transform hover:scale-105 cursor-pointer"
                onClick={() => handleNavigateToCapitulo(tarea.task_id, tarea.submission_complete ?? false)}
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <h4 className="text-lg font-semibold text-black dark:text-white">{tarea.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tarea.description}</p>
                  <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                    <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}</p>
                    <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEntregarTarea(tarea.task_id);
                  }}
                  disabled={tarea.submission_complete || isButtonDisabled(tarea.endTask, tarea.endTime)}
                  className={`ml-4 sm:ml-0 px-4 py-2 text-white rounded-md ${tarea.submission_complete || isButtonDisabled(tarea.endTask, tarea.endTime)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {tarea.submission_complete ? 'Entregada' : 'Entregar'}
                </button>
              </div>
            ))}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
              >
                &#8592;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          <div className="text-center text-lg text-gray-500 dark:text-gray-300">No hay tareas disponibles.</div>
        )}
      </div>
    </>
  );
};

export default InfoCurso;
