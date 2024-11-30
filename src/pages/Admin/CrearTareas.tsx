import React, { useState, useEffect } from 'react';
import CreaTarea from '../../components/Modals/CreaTareas/CreaTarea';
import { getCursos } from '../../ts/Admin/GetCursos';
import { getYears } from '../../ts/Generales/GetYears';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareas } from '../../ts/Admin/GetTareas'; // Suponiendo que esta función existe y obtiene las tareas desde la API

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
  const [tareas, setTareas] = useState<Tarea[]>([]); // Estado para almacenar las tareas
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const tareasPorPagina = 3;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener los años disponibles
        const yearsRecuperados = await getYears();
        setYears(yearsRecuperados.map((yearObj) => yearObj.year));

        // Obtener datos del perfil y cargar los cursos según la sede
        const perfil = await getDatosPerfil();
        if (perfil.sede) {
          fetchCursos(perfil.sede);
        }

        // Establecer el año actual si está en la lista de años
        const currentYear = new Date().getFullYear();
        if (yearsRecuperados.some((yearObj) => yearObj.year === currentYear)) {
          setSelectedAño(currentYear.toString());
        }
      } catch (error) {
        console.error('Error al cargar los datos iniciales:', error);
      }
    };

    fetchInitialData();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const fetchCursos = async (sedeId: number) => {
    try {
      const cursosRecuperados = await getCursos(sedeId);
      if (Array.isArray(cursosRecuperados)) {
        setCursos(cursosRecuperados);
      } else {
        console.error('Los datos de cursos no son válidos:', cursosRecuperados);
        setCursos([]);
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setCursos([]);
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
  };

  const handleAñoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAño(e.target.value);
  };

  // Establecer el valor inicial para el curso según la fecha actual
  const setInitialCurso = () => {
    const currentMonth = new Date().getMonth() + 1; // Los meses van de 0 a 11
    const courseId = currentMonth > 6 ? '2' : '1';
    setSelectedCurso(courseId);
  };

  useEffect(() => {
    setInitialCurso();
  }, []);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        if (selectedCurso && selectedAño) {
          const perfil = await getDatosPerfil();
          const sedeId = perfil.sede; // Obtener la sede actual, si no está disponible, usamos 1 por defecto
          const tareasRecuperadas = await getTareas(Number(sedeId), Number(selectedCurso), Number(selectedAño));
          console.log('Tareas recuperadas:', tareasRecuperadas);
          // Verificar si la respuesta es un array
          if (Array.isArray(tareasRecuperadas)) {
            setTareas(tareasRecuperadas);
          } else {
            console.error('Las tareas no están en el formato esperado:', tareasRecuperadas);
            setTareas([]); // Si no es un array, establecer un arreglo vacío
          }
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
        setTareas([]); // Si ocurre un error, establecer un arreglo vacío
      }
    };

    fetchTareas();
  }, [selectedCurso, selectedAño]);

  // Obtener tareas para la página actual
  const indexOfLastTask = currentPage * tareasPorPagina;
  const indexOfFirstTask = indexOfLastTask - tareasPorPagina;
  const currentTareas = tareas.slice(indexOfFirstTask, indexOfLastTask);

  // Total de páginas
  const totalPages = Math.ceil(tareas.length / tareasPorPagina);

  // Cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Renderizar botones de paginación
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div style={{
        display: 'flex',
        flexDirection: windowWidth < 768 ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <select
          value={selectedAño}
          onChange={handleAñoChange}
          style={{
            width: windowWidth < 768 ? '100%' : '45%',
            marginBottom: windowWidth < 768 ? '10px' : '0'
          }}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
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
          onChange={handleCourseChange}
          style={{
            width: windowWidth < 768 ? '100%' : '45%',
            marginBottom: windowWidth < 768 ? '10px' : '0'
          }}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
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
          style={{
            width: windowWidth < 768 ? '100%' : '28%',
            marginTop: windowWidth < 768 ? '10px' : '0'
          }}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tarea.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tarea.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tarea.taskStart}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tarea.endTask}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-3 px-6 bg-gray-50 dark:bg-boxdark">
            <div className="flex justify-center">
              {renderPaginationButtons()}
            </div>
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
