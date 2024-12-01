import React, { useState, useEffect } from 'react';
import CreaTarea from '../../components/Modals/CreaTareas/CreaTarea';
import { getCursos } from '../../ts/Admin/GetCursos';
import { getYears } from '../../ts/Generales/GetYears';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareas } from '../../ts/Admin/GetTareas';

interface Tarea {
  task_id: number;
  title: string;
  description: string;
  taskStart: string;
  endTask: string;
  note: string;
  year_id: number;
  course_id: number | null;
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

  const indexOfLastTask = currentPage * tareasPorPagina;
  const currentTareas = tareas.slice(indexOfLastTask - tareasPorPagina, indexOfLastTask);

  const totalPages = Math.ceil(tareas.length / tareasPorPagina);
  const renderPaginationButtons = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        className={`mx-1 px-3 py-1 rounded-md border ${
          currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
        }`}
      >
        {pageNumber}
      </button>
    ));

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
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition w-full md:w-auto"
        >
          Crear Tarea
        </button>
      </div>

      {tareas.length > 0 ? (
        <div className="overflow-hidden shadow border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de fin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-strokedark">
              {currentTareas.map((tarea) => (
                <tr key={tarea.task_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tarea.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tarea.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tarea.taskStart}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tarea.endTask}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-3 px-6 bg-gray-50 dark:bg-boxdark flex justify-center">
            {renderPaginationButtons()}
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
