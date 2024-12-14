import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface TimeLineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
}

const TimeLine: React.FC = () => {
  const location = useLocation();  // Obtén los datos de la ubicación
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(3);
  const [maxPageButtons, setMaxPageButtons] = useState(10); // 10 botones en pantallas grandes
  const navigate = useNavigate();

  // Recuperar los datos enviados desde la página anterior
  const { estudiante, selectedCurso, selectedAño } = location.state || {};

  // Nombre del estudiante
  const studentName = estudiante ? estudiante.userName : "Desconocido";

  // Datos simulados del timeline (puedes personalizar según tus necesidades)
  const events: TimeLineEvent[] = [
    { id: 1, title: 'Inicio de clases', description: 'Comienzo del semestre de Primavera 2024.', date: '2024-01-10', icon: '📚' },
    { id: 2, title: 'Entrega de proyecto', description: 'Entrega final del proyecto de matemáticas.', date: '2024-02-20', icon: '📊' },
    { id: 3, title: 'Exámenes parciales', description: 'Primeros exámenes parciales del semestre.', date: '2024-03-15', icon: '📝' },
    { id: 4, title: 'Taller de desarrollo', description: 'Taller de desarrollo personal y habilidades blandas.', date: '2024-04-12', icon: '🛠️' },
    { id: 5, title: 'Fin de semestre', description: 'Cierre oficial del semestre de Primavera 2024.', date: '2024-05-30', icon: '🎓' },
    { id: 6, title: 'Incorporación a la red social', description: 'Registro en la red social de la universidad.', date: '2024-06-05', icon: '💻' },
    { id: 7, title: 'Inscripción a nuevas asignaturas', description: 'Proceso de inscripción para el siguiente semestre.', date: '2024-07-01', icon: '📅' },
    { id: 8, title: 'Examen final de programación', description: 'Evaluación final de la asignatura de programación.', date: '2024-08-10', icon: '💻' },
    { id: 9, title: 'Conferencia internacional', description: 'Asistencia a la conferencia de tecnología avanzada.', date: '2024-09-15', icon: '🎤' },
    { id: 10, title: 'Graduación', description: 'Ceremonia de graduación en la universidad.', date: '2024-10-20', icon: '🎓' },
    { id: 11, title: 'Feria de empleo', description: 'Participación en la feria de empleo para estudiantes.', date: '2024-11-10', icon: '🧳' },
    { id: 12, title: 'Presentación de tesis', description: 'Exposición de tesis ante el jurado académico.', date: '2024-12-01', icon: '📄' },
    { id: 13, title: 'Inicio de prácticas profesionales', description: 'Comienzo de prácticas profesionales en una empresa.', date: '2024-01-15', icon: '🏢' },
    { id: 14, title: 'Certificación profesional', description: 'Obtención de la certificación profesional de desarrollo.', date: '2024-02-18', icon: '📜' },
    { id: 15, title: 'Reunión de exalumnos', description: 'Encuentro con antiguos compañeros de universidad.', date: '2024-03-20', icon: '👥' },
    { id: 16, title: 'Jornada de voluntariado', description: 'Participación en jornada de voluntariado social.', date: '2024-04-25', icon: '❤️' },
    { id: 17, title: 'Curso de actualización', description: 'Curso intensivo sobre nuevas tecnologías.', date: '2024-05-10', icon: '📚' },
    { id: 18, title: 'Conferencia sobre innovación', description: 'Asistencia a conferencia sobre innovación tecnológica.', date: '2024-06-30', icon: '💡' },
    { id: 19, title: 'Certificación en inglés', description: 'Obteniendo la certificación de nivel avanzado de inglés.', date: '2024-07-15', icon: '🇬🇧' },
    { id: 20, title: 'Proyecto de investigación', description: 'Iniciación de proyecto de investigación en inteligencia artificial.', date: '2024-08-01', icon: '🔬' },
    { id: 21, title: 'Concurso de startups', description: 'Participación en el concurso de startups de tecnología.', date: '2024-09-05', icon: '🚀' },
    { id: 22, title: 'Curso de liderazgo', description: 'Curso de desarrollo de habilidades de liderazgo.', date: '2024-10-05', icon: '🧑‍🏫' },
    { id: 23, title: 'Incorporación a la empresa', description: 'Ingreso a la empresa como ingeniero de software.', date: '2024-11-01', icon: '💼' },
    { id: 24, title: 'Exposición de resultados', description: 'Exposición de resultados del proyecto de investigación.', date: '2024-12-15', icon: '📊' },
    { id: 25, title: 'Muestra tecnológica', description: 'Participación en la muestra de innovaciones tecnológicas.', date: '2024-01-30', icon: '🔧' },
    { id: 26, title: 'Revisión de tesis', description: 'Revisión final de la tesis antes de la entrega.', date: '2024-02-10', icon: '📝' },
    { id: 27, title: 'Foro académico', description: 'Asistencia al foro sobre educación superior.', date: '2024-03-22', icon: '🎓' },
    { id: 28, title: 'Hackathon universitaria', description: 'Participación en el Hackathon universitario.', date: '2024-04-30', icon: '👨‍💻' },
    { id: 29, title: 'Conferencia de tecnología', description: 'Asistencia a conferencia internacional sobre tecnología.', date: '2024-05-25', icon: '🌐' },
    { id: 30, title: 'Cierre de semestre', description: 'Cierre oficial del semestre de Otoño 2024.', date: '2024-06-10', icon: '📅' },
  ];

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
        setEventsPerPage(4); // Más elementos por página en pantallas pequeñas
        setMaxPageButtons(5); // Menos botones de paginación
      } else {
        setEventsPerPage(3); // Número estándar de eventos por página en pantallas grandes
        setMaxPageButtons(10); // Más botones de paginación en pantallas grandes
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            Línea de Tiempo - {studentName} (Curso: {selectedCurso}, Año: {selectedAño})
          </h2>
          <button
            onClick={() => {
              console.log({ estudiante, selectedCurso, selectedAño });
              navigate('/admin/tareas-estudiante', { state: { estudiante, selectedCurso, selectedAño } });
            }}
            className="rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity"
          >
            Ver Tareas
          </button>
        </div>

        <div className="relative border-l-2 border-gray-200 dark:border-strokedark">
          {currentEvents.map((event, index) => (
            <div key={event.id} className="mb-8 pl-8 relative">
              <div className="absolute left-[-1.25rem] top-0 flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                <span>{event.icon}</span>
              </div>
              <div className={`p-4 rounded-lg shadow-md ${index === 0 ? 'bg-white dark:bg-boxdark' : 'bg-white dark:bg-boxdark'} dark:text-white`}>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">{event.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
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
