import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil'; // Recuperar la sede
import { getTareasSede, Tarea } from '../../../ts/Admin/GetTareasSede'; // Obtener tareas

const TareasEstudiante: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para manejar los datos
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [sedeId, setSedeId] = useState<number | null>(null);

  // Recuperar los datos enviados desde la página anterior
  const { estudiante, selectedCurso, selectedAño } = location.state || {};

  useEffect(() => {
    const fetchDatosPerfil = async () => {
      try {
        // Obtener la sede del perfil
        const { sede } = await getDatosPerfil();
        setSedeId(sede); // Establecer la sede
      } catch (err) {

      }
    };

    fetchDatosPerfil();
  }, []);

  // Ejecutar fetchTareas cuando se obtienen los valores de sedeId y selectedAño
  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null && selectedAño) {
        try {
          const tareasRecuperadas = await getTareasSede(sedeId, selectedAño);
          setTareas(tareasRecuperadas); // Establecer las tareas
        } catch (err) {

        }
      }
    };

    fetchTareas();
  }, [sedeId, selectedAño]); // Se vuelve a ejecutar cada vez que cambian estos valores

  // Ordenar tareas para que las de typeTask_id === 1 aparezcan primero
  const tareasOrdenadas = tareas.sort((a, b) => {
    if (a.typeTask_id === 1 && b.typeTask_id !== 1) {
      return -1; // 'a' va primero
    }
    if (a.typeTask_id !== 1 && b.typeTask_id === 1) {
      return 1; // 'b' va primero
    }
    return 0; // Mismos tipos de tarea, mantener el orden
  });

  const handleNavigate = (tarea: Tarea) => {
    if (tarea.typeTask_id === 1) {
      navigate('/admin/propuestas');
    } else {
      navigate('/admin/capitulo', { state: { tarea } });
    }
  };

  // Función para formatear fechas en formato dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  // Función para formatear hora en formato 24 horas
  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);

    // Determinar si es AM o PM en formato 24 horas
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
        {/* Renderizar las tareas con typeTask_id === 1 */}
        {tareasOrdenadas
          .filter((tarea) => tarea.typeTask_id === 1)
          .map((tarea) => (
            <div
              key={tarea.task_id}
              className={`mb-6 p-4 rounded-lg shadow-md cursor-pointer bg-blue-100 dark:bg-boxdark`}
              onClick={() => handleNavigate(tarea)}
            >
              <h3 className="text-lg font-bold text-primary">{tarea.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tarea.description}
              </p>
              <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}</p>
                <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}</p>
              </div>
            </div>
          ))}

        {/* Encabezado de Capítulos */}
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">Capítulos</h3>

        {/* Renderizar las demás tareas (typeTask_id !== 1) */}
        {tareasOrdenadas
          .filter((tarea) => tarea.typeTask_id !== 1)
          .map((tarea) => (
            <div
              key={tarea.task_id}
              className={`mb-6 p-4 rounded-lg shadow-md cursor-pointer ${tarea.typeTask_id === 1 ? 'bg-blue-100 dark:bg-boxdark' : 'bg-white dark:bg-boxdark'}`}
              onClick={() => handleNavigate(tarea)}
            >
              <h3
                className={`text-lg font-bold ${tarea.typeTask_id === 2 ? 'text-black' : 'text-primary'}`}
              >
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
      </div>
    </>
  );
};

export default TareasEstudiante;
