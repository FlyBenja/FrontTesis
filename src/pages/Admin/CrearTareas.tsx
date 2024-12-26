import React, { useState, useEffect } from 'react';
import CreaTarea from '../../components/Modals/CreaTareas/CreaTarea';
import { getCursos } from '../../ts/Generales/GetCursos';
import { getYears } from '../../ts/Generales/GetYears';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareas } from '../../ts/Generales/GetTareas';

export interface Tarea {
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
}

const CrearTareas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedAño, setSelectedAño] = useState('');
  const [years, setYears] = useState<number[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [tareasPorPagina, setTareasPorPagina] = useState(3);
  const [maxPageButtons, setMaxPageButtons] = useState(5);

  useEffect(() => {
    const fetchInitialData = async () => {
      const yearsRecuperados = await getYears();
      setYears(yearsRecuperados.map((yearObj) => yearObj.year));

      const currentYear = new Date().getFullYear();
      if (yearsRecuperados.some((yearObj) => yearObj.year === currentYear)) {
        setSelectedAño(currentYear.toString());
      }

      const perfil = await getDatosPerfil();
      if (perfil.sede) {
        const cursosRecuperados = await getCursos(perfil.sede);
        setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []);
      }
    };

    fetchInitialData();

    const currentMonth = new Date().getMonth() + 1;
    setSelectedCurso(currentMonth > 6 ? '2' : '1');
  }, []);

  const fetchTareas = async () => {
    if (selectedCurso && selectedAño) {
      const perfil = await getDatosPerfil();
      const tareasRecuperadas = await getTareas(
        perfil.sede,
        Number(selectedCurso),
        Number(selectedAño)
      );
  
      const tareasOrdenadas = tareasRecuperadas.sort((a: Tarea, b: Tarea) => {
        if (a.typeTask_id === 1 && b.typeTask_id !== 1) return -1;
        if (a.typeTask_id !== 1 && b.typeTask_id === 1) return 1;
        return 0;
      });
  
      setTareas(Array.isArray(tareasOrdenadas) ? tareasOrdenadas : []);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [selectedCurso, selectedAño]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchTareas();
  };

  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amPm}`;
  };

  const indexOfLastTask = currentPage * tareasPorPagina;
  const currentTareas = tareas.slice(indexOfLastTask - tareasPorPagina, indexOfLastTask);
  const totalPages = Math.ceil(tareas.length / tareasPorPagina);

  const paginate = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTareasPorPagina(8);
        setMaxPageButtons(5);
      } else {
        setTareasPorPagina(5);
        setMaxPageButtons(10);
      }
    };

    handleResize(); // For initial load
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-3">
        <select
          value={selectedAño}
          onChange={(e) => setSelectedAño(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white w-full md:w-1/2"
        >
          <option value="">Seleccionar año</option>
          {years.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedCurso}
          onChange={(e) => setSelectedCurso(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white w-full md:w-1/2"
        >
          <option value="">Seleccionar curso</option>
          {cursos.map((curso) => (
            <option key={curso.course_id} value={curso.course_id.toString()}>
              {curso.courseName}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalMode("create");
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:bg-gradient-to-l transition duration-300 w-full md:w-auto flex items-center justify-center"
        >
          <span className="mr-2">+</span> Crear Tarea
        </button>
      </div>

      {tareas.length > 0 ? (
        <div className="space-y-4">
          {currentTareas.map((tarea) => (
            <div
              key={tarea.task_id}
              className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-black dark:text-white">{tarea.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tarea.description}</p>
                <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                  <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}</p>
                  <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalMode("edit");
                    setSelectedTaskId(tarea.task_id);
                  }}
                  className="ml-4 px-3 py-2 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M17.707 6.293l-2.414-2.414a1 1 0 0 0-1.414 0l-9 9a1 1 0 0 0-.293.707v3.586a1 1 0 0 0 1 1h3.586a1 1 0 0 0 .707-.293l9-9a1 1 0 0 0 0-1.414z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
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
            {getPageRange().map((page) => (
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
        <div className="text-center text-gray-500 dark:text-gray-300">
          No hay tareas para mostrar.
        </div>
      )}

      {isModalOpen && <CreaTarea onClose={handleModalClose} mode={modalMode} taskId={selectedTaskId} />}
    </div>
  );
};

export default CrearTareas;
