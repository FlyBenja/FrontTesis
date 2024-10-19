import React, { useState, useEffect } from 'react';
import CreaTarea from '../../components/Modals/CreaTareas/CreaTarea';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  tipo: 'Capítulo' | 'Propuesta de Tesis';
}

const CrearTareas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const tareasPorPagina = 3;

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
  };

  const tareas: Tarea[] = [
    {
      id: 1,
      titulo: 'Propuesta de Tesis',
      descripcion: 'Propuesta inicial para el proyecto de tesis.',
      fechaEntrega: '2024-01-10',
      tipo: 'Propuesta de Tesis',
    },
    {
      id: 2,
      titulo: 'Capítulo 1: Introducción',
      descripcion: 'Redactar la introducción del proyecto de tesis.',
      fechaEntrega: '2024-02-15',
      tipo: 'Capítulo',
    },
    {
      id: 3,
      titulo: 'Capítulo 2: Marco Teórico',
      descripcion: 'Desarrollar el marco teórico del proyecto.',
      fechaEntrega: '2024-03-01',
      tipo: 'Capítulo',
    },
    {
      id: 4,
      titulo: 'Capítulo 3: Metodología',
      descripcion: 'Escribir la metodología utilizada en el proyecto.',
      fechaEntrega: '2024-04-10',
      tipo: 'Capítulo',
    },
    {
      id: 5,
      titulo: 'Capítulo 4: Resultados',
      descripcion: 'Presentar los resultados obtenidos del proyecto.',
      fechaEntrega: '2024-05-05',
      tipo: 'Capítulo',
    },
    {
      id: 6,
      titulo: 'Capítulo 5: Conclusiones',
      descripcion: 'Redactar las conclusiones y recomendaciones.',
      fechaEntrega: '2024-06-15',
      tipo: 'Capítulo',
    },
    {
      id: 7,
      titulo: 'Capítulo 6: Revisión de Literatura',
      descripcion: 'Revisar la literatura y estudios previos.',
      fechaEntrega: '2024-07-01',
      tipo: 'Capítulo',
    },
    {
      id: 8,
      titulo: 'Capítulo 7: Análisis de Datos',
      descripcion: 'Realizar el análisis de los datos obtenidos.',
      fechaEntrega: '2024-08-10',
      tipo: 'Capítulo',
    },
    {
      id: 9,
      titulo: 'Capítulo 8: Discusión',
      descripcion: 'Discutir los resultados del análisis.',
      fechaEntrega: '2024-09-05',
      tipo: 'Capítulo',
    },
    {
      id: 10,
      titulo: 'Capítulo 9: Conclusiones Finales',
      descripcion: 'Escribir las conclusiones finales y recomendaciones.',
      fechaEntrega: '2024-10-20',
      tipo: 'Capítulo',
    },
  ];

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
          value={selectedCurso}
          onChange={handleCourseChange}
          style={{
            width: windowWidth < 768 ? '100%' : '70%',
            marginBottom: windowWidth < 768 ? '10px' : '0'
          }}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
        >
          <option value="">Seleccionar curso</option>
          <option value="Matemáticas">Matemáticas</option>
          <option value="Ciencias">Ciencias</option>
          <option value="Historia">Historia</option>
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

      {/* Listado de Tareas */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">Capítulos y Propuestas</h3>
        <ul className="space-y-4">
          {currentTareas.map((tarea) => (
            <li key={tarea.id} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-black dark:text-white">{tarea.titulo}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tarea.descripcion}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                Fecha de entrega: {tarea.fechaEntrega}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500"
          disabled={currentPage === 1}
        >
          &#8592;
        </button>

        {renderPaginationButtons()}

        <button
          onClick={() => paginate(currentPage + 1)}
          className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500"
          disabled={currentPage === totalPages}
        >
          &#8594;
        </button>
      </div>

      {/* Modal para crear nueva tarea */}
      {isModalOpen && <CreaTarea onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CrearTareas;
