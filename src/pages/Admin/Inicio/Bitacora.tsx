import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getBitacora } from '../../../ts/Admin/GetBitacora';

interface LogEntry {
  uniqueKey: number;
  user: string;
  role: string;
  action: string;
  date: string;
  time: string;
}

const Bitacora: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 8;
  const [maxPageButtons, setMaxPageButtons] = useState(10);

  const updateMaxButtons = () => {
    if (window.innerWidth < 640) {
      setMaxPageButtons(4); // Mostrar solo 4 botones en pantallas pequeñas
    } else {
      setMaxPageButtons(10); // Mostrar 10 botones en pantallas más grandes
    }
  };

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        setLoading(true);
        const perfil = await getDatosPerfil();
        const bitacoraResponse = await getBitacora(perfil?.sede || '');

        const logsData = Array.isArray(bitacoraResponse?.logs) ? bitacoraResponse.logs : [];

        let keyCounter = 0;
        const mappedLogs = logsData.map((log: any) => ({
          uniqueKey: ++keyCounter,
          user: log.username || 'Desconocido',
          role: log.role || 'Sin rol',
          action: log.action || 'Sin acción',
          date: log.date?.split('T')[0] || 'Fecha no disponible',
          time: log.date?.split('T')[1]?.slice(0, 8) || 'Hora no disponible',
        }));
        setLogs(mappedLogs);
      } catch (error) {
        console.error('Error al recuperar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitacora();

    // Actualizar la cantidad de botones cuando cambia el tamaño de la pantalla
    updateMaxButtons();
    window.addEventListener('resize', updateMaxButtons);

    return () => window.removeEventListener('resize', updateMaxButtons);
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Breadcrumb pageName="Bitácora" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <div className="block sm:hidden">
              {currentLogs.length === 0 ? (
                <p>No hay registros para mostrar</p>
              ) : (
                currentLogs.map((log) => (
                  <div
                    key={log.uniqueKey}
                    className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg dark:bg-boxdark dark:border-strokedark"
                  >
                    <p className="text-lg font-bold text-black dark:text-white">{log.user}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{log.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{log.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.date} - {log.time}
                    </p>
                  </div>
                ))
              )}
            </div>

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
                  {currentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">No hay registros para mostrar</td>
                    </tr>
                  ) : (
                    currentLogs.map((log) => (
                      <tr
                        key={log.uniqueKey}
                        className="border-t border-gray-200 dark:border-strokedark"
                      >
                        <td className="py-2 px-4 text-black dark:text-white">{log.user}</td>
                        <td className="py-2 px-4 text-black dark:text-white">{log.role}</td>
                        <td className="py-2 px-4 text-black dark:text-white">{log.action}</td>
                        <td className="py-2 px-4 text-black dark:text-white">{log.date}</td>
                        <td className="py-2 px-4 text-black dark:text-white">{log.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
          </>
        )}
      </div>
    </>
  );
};

export default Bitacora;
