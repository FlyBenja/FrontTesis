import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getTimeLineEstudiante } from '../../ts/Generales/GetTimeLineEstudiante';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';

interface TimeLineEvent {
  user_id: number;
  typeEvent: string;
  description: string;
  task_id: number;
  date: string;
}

const TimeLine: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(3);
  const [maxPageButtons, setMaxPageButtons] = useState(10);
  const [events, setEvents] = useState<TimeLineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchProfileAndTimeline = async () => {
      try {
        setLoading(true);
        const perfil = await getDatosPerfil();
        setUserName(perfil.userName);

        const logs = await getTimeLineEstudiante(perfil.user_id);
        setEvents(
          logs.map((log) => ({
            user_id: log.user_id,
            typeEvent: log.typeEvent,
            description: log.description,
            task_id: log.task_id,
            date: new Date(log.date).toLocaleDateString(),
          }))
        );
      } catch (err: any) {
        // Manejo de errores si es necesario
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTimeline();
  }, []);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageRange = () => {
    const range: number[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEventsPerPage(4);
        setMaxPageButtons(5);
      } else {
        setEventsPerPage(3);
        setMaxPageButtons(10);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <div>Cargando línea de tiempo...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="TimeLine" />

      <div className="mx-auto max-w-6xl px-6 -my-3">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
          Línea de Tiempo - {userName}
        </h2>

        <div className="relative border-l-2 border-gray-200 dark:border-strokedark">
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <div key={index} className="mb-8 pl-8 relative">
                <div className="absolute left-[-1.25rem] top-0 flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                  <span>📝</span>
                </div>
                <div className={`p-4 rounded-lg shadow-md bg-white dark:bg-boxdark dark:text-white`}>
                  <h3 className="text-lg font-semibold">{event.typeEvent}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">{event.date}</p>
                </div>
              </div>
            ))
          ) : (
            <table className="min-w-full">
              <tbody>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                    No Se Encontrarón Eventos En Este Estudiante.
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

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
    </>
  );
};

export default TimeLine;
