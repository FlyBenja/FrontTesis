import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil'; 
import { getTareasSede, Tarea } from '../../../ts/Admin/GetTareasSede';

const TareasEstudiante: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [sedeId, setSedeId] = useState<number | null>(null);

  const { estudiante, selectedAño } = location.state || {};
  useEffect(() => {
    const fetchDatosPerfil = async () => {
      try {
        const { sede } = await getDatosPerfil();
        setSedeId(sede);
      } catch (err) {}
    };

    fetchDatosPerfil();
  }, []);

  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null && selectedAño) {
        try {
          const tareasRecuperadas = await getTareasSede(sedeId, selectedAño);
          setTareas(tareasRecuperadas);
        } catch (err) {}
      }
    };

    fetchTareas();
  }, [sedeId, selectedAño]);

  const tareasOrdenadas = tareas.sort((a, b) => {
    if (a.typeTask_id === 1 && b.typeTask_id !== 1) {
      return -1;
    }
    if (a.typeTask_id !== 1 && b.typeTask_id === 1) {
      return 1;
    }
    return 0;
  });

  const handleNavigate = (tarea: Tarea) => {
    if (tarea.typeTask_id === 1) {
      navigate('/admin/propuestas', { state: { tarea, estudiante, selectedAño } });
    } else {
      navigate('/admin/capitulo', { state: { tarea, estudiante, selectedAño } });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <>
      <Breadcrumb pageName="Tareas del Estudiante" />

      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4">
        {tareasOrdenadas.length === 0 ? (
          <table className="min-w-full table-auto">
            <tbody>
              <tr>
                <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                  No Se Encontrarón Tareas Creadas.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            {tareasOrdenadas
              .filter((tarea) => tarea.typeTask_id === 1)
              .map((tarea) => (
                <div
                  key={tarea.task_id}
                  className="mb-6 p-4 rounded-lg shadow-md cursor-pointer bg-blue-100 dark:bg-boxdark"
                  onClick={() => handleNavigate(tarea)}
                >
                  <h3 className="text-lg font-bold text-black dark:text-white">{tarea.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tarea.description}
                  </p>
                  <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                    <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}</p>
                    <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}</p>
                  </div>
                </div>
              ))}

            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Capítulos</h3>

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
                    <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}</p>
                    <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}</p>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default TareasEstudiante;
