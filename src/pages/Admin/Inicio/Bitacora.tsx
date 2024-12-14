import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { getDatosPerfil } from "../../../ts/Generales/GetDatsPerfil";
import { getBitacora } from "../../../ts/Admin/GetBitacora"; // Asegúrate de importar la función

type Log = {
  date: string;
  username: string;
  id_user: number;
  action: string;
  description: string;
};

const Bitacora = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [sedeId, setSedeId] = useState<number | null>(null);
  const logsPerPage = 3;

  useEffect(() => {
    const fetchSedeId = async () => {
      try {
        const { sede } = await getDatosPerfil();
        setSedeId(sede);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchSedeId();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sedeId !== null) {
      const fetchLogs = async () => {
        try {
          const response = await getBitacora(sedeId); // Llamar a la API con el sedeId
          console.log(response.logs); // Acceder al campo logs
          setLogs(response.logs.map((log: any) => ({
            date: log.date,
            username: log.username,
            id_user: log.user_id,
            action: log.action,
            description: log.description,
          })));
        } catch (error) {
          console.error("Error al obtener los registros de la bitácora:", error);
        }
      };
  
      fetchLogs();
    }
  }, [sedeId]);  

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  // Número máximo de botones a mostrar
  const pagesToShow = isMobile ? 4 : 10;

  // Función para actualizar la página
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Crear el rango de botones a mostrar (paginación dinámica)
  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let end = Math.min(totalPages, start + pagesToShow - 1);

    if (end - start + 1 < pagesToShow) {
      start = Math.max(1, end - pagesToShow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="mt-5 px-4">
      <Breadcrumb pageName="Bitácora de Actividades" />
      {currentLogs.map((log, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-start sm:items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-boxdark p-4 rounded-lg mb-4"
        >
          <div className="flex-shrink-0 bg-blue-600 text-white font-bold text-center rounded-md px-4 py-2 sm:py-6 sm:h-[70px] sm:text-base mt-[-38px] sm:mt-0 sm:text-left sm:ml-4 absolute sm:static right-12">
            <span className="text-xl sm:text-base">{new Date(log.date).toLocaleDateString("en-CA")}</span>
          </div>

          <div className="flex-1 mt-2 sm:mt-0 sm:ml-4">
            <div className="flex justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{log.username}</h3>
              <span className="text-gray-600 dark:text-gray-300">ID: {log.id_user}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(log.date).toLocaleTimeString()}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Acción:</strong> {log.action}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Detalles:</strong> {log.description}
            </p>
          </div>
        </div>
      ))}

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
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white"
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
  );
};

export default Bitacora;
