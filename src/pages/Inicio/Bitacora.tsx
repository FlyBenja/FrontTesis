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
  const logsPerPage = 10; // Definimos el número de registros por página

  // Estado para detectar el tamaño de la pantalla
  const [maxPageButtons, setMaxPageButtons] = useState(10); // Por defecto, mostramos 10 botones

  // Generar 300 ejemplos de entradas de bitácora con roles, fecha y hora
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
        const dateString = randomDate.toISOString().split('T')[0]; // Obtener fecha en formato YYYY-MM-DD
        const timeString = randomDate.toTimeString().split(' ')[0]; // Obtener hora en formato HH:MM:SS

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

    // Escuchar el tamaño de la pantalla y ajustar la cantidad de botones
    const updateMaxButtons = () => {
      if (window.innerWidth < 640) {
        setMaxPageButtons(6); // Mostrar solo 6 botones en pantallas pequeñas
      } else {
        setMaxPageButtons(10); // Mostrar 10 botones en pantallas más grandes
      }
    };

    // Actualizar cuando se cambie el tamaño de la pantalla
    window.addEventListener('resize', updateMaxButtons);

    // Llamada inicial para definir el número de botones al cargar
    updateMaxButtons();

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

    // Siempre mostrar el botón para la primera página
    buttons.push(
      <button
        key={1}
        onClick={() => paginate(1)}
        className={`mx-1 px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'}`}
      >
        1
      </button>
    );

    // Calcular el rango de botones de página a mostrar
    const startPage = Math.max(2, currentPage - Math.floor((maxPageButtons - 2) / 2)); // -2 para dejar espacio a los botones de inicio y final
    const endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 3); // -3 para incluir inicio, final y flechas

    // Botones intermedios
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

    // Mostrar el botón de la última página
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'}`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">Bitácora de Actividades</h2>
      <div className="max-w-full overflow-x-auto">
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
        {/* Botón de flecha izquierda */}
        <button
          onClick={() => paginate(currentPage - 1)}
          className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
          disabled={currentPage === 1}
        >
          &#8592;
        </button>

        {/* Botones de paginación */}
        {renderPaginationButtons()}

        {/* Botón de flecha derecha */}
        <button
          onClick={() => paginate(currentPage + 1)}
          className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
          disabled={currentPage === totalPages}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Bitacora;
