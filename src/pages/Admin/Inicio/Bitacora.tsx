import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil'; // Importa la API de perfil
import { getBitacora } from '../../../ts/Admin/GetBitacora'; // Importa la API de bitácora

interface LogEntry {
  uniqueKey: number; // Clave única para React
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

  useEffect(() => {
    let keyCounter = 0; // Contador inicial

    const fetchBitacora = async () => {
      try {
        setLoading(true);
        const perfil = await getDatosPerfil();
        const bitacoraResponse = await getBitacora(perfil?.sede || '');

        const logsData = Array.isArray(bitacoraResponse?.logs) ? bitacoraResponse.logs : [];

        const mappedLogs = logsData.map((log: any) => ({
          uniqueKey: ++keyCounter, // Incrementar el contador
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
                    key={log.uniqueKey} // Usar el contador como clave única
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
                        key={log.uniqueKey} // Usar el contador como clave única
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
          </>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
            disabled={currentPage === 1}
          >
            &#8592;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded-md border ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'
              }`}
            >
              {index + 1}
            </button>
          ))}

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
