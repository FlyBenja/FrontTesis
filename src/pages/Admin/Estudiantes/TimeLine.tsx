import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getTimeLineEstudiante } from '../../../ts/Generales/GetTimeLineEstudiante';
import generaPDFIndividual from '../../../components/Pdfs/generaPDFIndividual';  

interface TimeLineEvent {
  user_id: number;
  typeEvent: string;
  description: string;
  task_id: number;
  date: string;
}

const TimeLine: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(3);
  const [maxPageButtons, setMaxPageButtons] = useState(10);
  const [events, setEvents] = useState<TimeLineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const { estudiante, selectedAño, selectedCurso } = location.state || {};
  const studentName = estudiante ? estudiante.userName : "Desconocido";
  const userId = estudiante ? estudiante.id : null;

  useEffect(() => {
    if (!userId) {
      showAlert('error', '¡Error!', 'No se proporcionó un user_id válido.');
      setLoading(false);
      return;
    }

    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const logs = await getTimeLineEstudiante(userId);
        setEvents(
          logs
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Orden descendente
            .map((log) => ({
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

    fetchTimeline();
  }, [userId]);

  const showAlert = (type: 'success' | 'error', title: string, text: string) => {
    const confirmButtonColor = type === 'success' ? '#28a745' : '#dc3545';
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor,
      confirmButtonText: 'OK',
    });
  };

  const handlePrintPDF = () => {
    if (estudiante && selectedAño) {
      generaPDFIndividual(estudiante, selectedAño, selectedCurso);  // Llamamos a la función que genera el PDF
    }
  };

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
      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-6 -my-3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Línea de Tiempo - {studentName}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                navigate('/admin/tareas-estudiante', { state: { estudiante, selectedAño } });
              }}
              className="rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity"
            >
              Ver Tareas
            </button>
            <button
              onClick={handlePrintPDF}
              className="rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity"
            >
              Imprimir PDF
            </button>
          </div>
        </div>

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
                    No Se Encontraron Eventos En Este Estudiante.
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
