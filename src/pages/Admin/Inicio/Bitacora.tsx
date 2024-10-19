import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import React, { useState, useEffect } from 'react';

// Definir el tipo de datos para la bitácora, incluyendo el campo "role"
interface LogEntry {
  id: number;
  user: string;
  role: 'Administrador' | 'Catedrático' | 'Estudiante'; // Roles de usuario
  action: string;
  date: string;
  time: string;
}

// Componente Bitacora
const Bitacora: React.FC = () => {
  // Estado para almacenar las entradas de la bitácora
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const logsPerPage = 9; // Definimos el número de registros por página

  // Estado para manejar la cantidad de botones de paginación
  const [maxPageButtons, setMaxPageButtons] = useState(10);

  // Escuchar el tamaño de la pantalla y ajustar la cantidad de botones
  const updateMaxButtons = () => {
    if (window.innerWidth < 640) {
      setMaxPageButtons(4); // Mostrar solo 4 botones en pantallas pequeñas
    } else {
      setMaxPageButtons(10); // Mostrar 10 botones en pantallas más grandes
    }
  };

  useEffect(() => {
    const generateLogs = (): LogEntry[] => {
      const users = ['Juan Pérez', 'María López', 'Pedro González', 'Ana Méndez', 'Carlos Rivera'];
      const roles: LogEntry['role'][] = ['Administrador', 'Catedrático', 'Estudiante'];
      const actions = ['Creó una tarea', 'Eliminó un archivo', 'Actualizó un registro', 'Inició sesión', 'Cerró sesión'];
      
      const logsArray: LogEntry[] = [];
      for (let i = 1; i <= 300; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomDate = new Date(2024, 9, Math.floor(Math.random() * 30) + 1);
        const dateString = randomDate.toISOString().split('T')[0];
        const timeString = randomDate.toTimeString().split(' ')[0];

        logsArray.push({
          id: i,
          user: randomUser,
          role: randomRole,
          action: randomAction,
          date: dateString,
          time: timeString,
        });
      }
      return logsArray;
    };

    const logsData = generateLogs();
    setLogs(logsData);

    // Actualizar la cantidad de botones cuando cambia el tamaño de la pantalla
    updateMaxButtons();
    window.addEventListener('resize', updateMaxButtons);

    // Limpiar el event listener al desmontar el componente
    return () => window.removeEventListener('resize', updateMaxButtons);
  }, []);

  // Calcular el índice de los logs para la paginación
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  // Número total de páginas
  const totalPages = Math.ceil(logs.length / logsPerPage);

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
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Breadcrumb pageName="Bitácora" /> {/* Agregar el Breadcrumb */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">


        {/* Modo teléfono: mostrar como cards */}
        <div className="block sm:hidden">
          {currentLogs.map((log) => (
            <div key={log.id} className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg dark:bg-boxdark dark:border-strokedark">
              <p className="text-lg font-bold text-black dark:text-white">{log.user}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{log.role}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{log.action}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{log.date} - {log.time}</p>
            </div>
          ))}
        </div>

        {/* Modo escritorio: mostrar como tabla */}
        <div className="hidden sm:block max-w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 dark:bg-meta-4 dark:text-white">
                <th className="py-2 px-4">Usuario</th>
                <th className="py-2 px-4">Rol</th>
                <th className="py-2 px-4">Acción</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Hora</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-200 dark:border-strokedark">
                  <td className="py-2 px-4 text-black dark:text-white">{log.user}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{log.role}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{log.action}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{log.date}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
            disabled={currentPage === 1}
          >
            &#8592;
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => paginate(currentPage + 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
            disabled={currentPage === totalPages}
          >
            &#8594;
          </button>
        </div>
      </div>
    </>
  );
};

export default Bitacora;
