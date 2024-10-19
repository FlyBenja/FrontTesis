import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface TimeLineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
}

const TimeLine: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const eventsPerPage = 3; // Mostrar 3 líneas de tiempo por página
  const maxPageButtons = 5; // Máximo número de botones de paginación

  const navigate = useNavigate();

  // Nombre del estudiante (quemado por ahora)
  const studentName = "Juan Pérez";

  // Datos simulados del timeline
  const events: TimeLineEvent[] = [
    { id: 1, title: 'Inicio de clases', description: 'Comienzo del semestre de Primavera 2024.', date: '2024-01-10', icon: '📚' },
    { id: 2, title: 'Entrega de proyecto', description: 'Entrega final del proyecto de matemáticas.', date: '2024-02-20', icon: '📊' },
    { id: 3, title: 'Exámenes parciales', description: 'Primeros exámenes parciales del semestre.', date: '2024-03-15', icon: '📝' },
    { id: 4, title: 'Taller de desarrollo', description: 'Taller de desarrollo personal y habilidades blandas.', date: '2024-04-12', icon: '🛠️' },
    { id: 5, title: 'Fin de semestre', description: 'Cierre oficial del semestre de Primavera 2024.', date: '2024-05-30', icon: '🎓' },
  ];

  // Calcular el índice de los eventos para la paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Número total de páginas
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generar botones de paginación
  const renderPaginationButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Breadcrumb pageName="TimeLine" />

      {/* Botón de retroceder */}
      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)} // Regresar a la página anterior
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-6 -my-3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Línea de Tiempo - {studentName}
          </h2>
          {/* Botón para Ver Tareas */}
          <button
            onClick={() => navigate('/admin/tareas-estudiante')}
            className="rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity"
          >
            Ver Tareas
          </button>
        </div>

        <div className="relative border-l-2 border-gray-200 dark:border-strokedark">
          {currentEvents.map((event, index) => (
            <div key={event.id} className="mb-8 pl-8 relative">
              {/* Icono */}
              <div className="absolute left-[-1.25rem] top-0 flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                <span>{event.icon}</span>
              </div>

              {/* Contenido del evento */}
              <div className={`p-4 rounded-lg shadow-md ${index === 0 ? 'bg-white dark:bg-boxdark' : 'bg-white dark:bg-boxdark'} dark:text-white`}>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">{event.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            disabled={currentPage === 1}
          >
            &#8592;
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => paginate(currentPage + 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            disabled={currentPage === totalPages}
          >
            &#8594;
          </button>
        </div>
      </div>
    </>
  );
};

export default TimeLine;
