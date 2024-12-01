import React, { useState, useEffect } from 'react';
import CreaTarea from '../../components/Modals/CreaTareas/CreaTarea';
import { getCursos } from '../../ts/Admin/GetCursos';
import { getYears } from '../../ts/Generales/GetYears';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareas } from '../../ts/Admin/GetTareas';

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

  const [currentPage, setCurrentPage] = useState(1);
  const tareasPorPagina = 3;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
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
      } catch (error) {
        console.error('Error al cargar los datos iniciales:', error);
      }
    };

    fetchInitialData();

    const currentMonth = new Date().getMonth() + 1;
    setSelectedCurso(currentMonth > 6 ? '2' : '1');
  }, []);

  useEffect(() => {
    const fetchTareas = async () => {
      if (selectedCurso && selectedAño) {
        try {
          const perfil = await getDatosPerfil();
          const tareasRecuperadas = await getTareas(
            perfil.sede || 1,
            Number(selectedCurso),
            Number(selectedAño)
          );
          setTareas(Array.isArray(tareasRecuperadas) ? tareasRecuperadas : []);
        } catch (error) {
          console.error('Error al cargar las tareas:', error);
        }
      }
    };

    fetchTareas();
  }, [selectedCurso, selectedAño]);

  // Paginación
  const indexOfLastTask = currentPage * tareasPorPagina;
  const currentTareas = tareas.slice(indexOfLastTask - tareasPorPagina, indexOfLastTask);
  const totalPages = Math.ceil(tareas.length / tareasPorPagina);

  const renderPaginationButtons = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        className={`mx-1 px-3 py-1 rounded-md border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
      >
        {pageNumber}
      </button>
    ));

  // Función para formatear fechas
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

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
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:bg-gradient-to-l transition duration-300 w-full md:w-auto flex items-center justify-center"
        >
          <span className="mr-2">+</span> Crear Tarea
        </button>
      </div>

      {/* Listado de tareas con tarjetas */}
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
                  <p>Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {tarea.startTime}</p>
                  <p>Fecha/Hora Final: {formatDate(tarea.endTask)} - {tarea.endTime}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="ml-4 px-3 py-2 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M17.707 6.293l-2.414-2.414a1 1 0 0 0-1.414 0l-9 9a1 1 0 0 0-.293.707v3.586a1 1 0 0 0 1 1h3.586a1 1 0 0 0 .707-.293l9-9a1 1 0 0 0 0-1.414z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M9 19l-3 3h6l-3-3z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-4">Editar</p>
              </div>
            </div>
          ))}

          {/* Paginación */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500"
              disabled={currentPage === 1}
            >
              &#8592;
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500"
              disabled={currentPage === totalPages}
            >
              &#8594;
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center">No se encontraron tareas</div>
      )}

      {isModalOpen && <CreaTarea onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CrearTareas;
