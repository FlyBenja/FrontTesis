import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { getDatosPerfil } from "../../../ts/Generales/GetDatsPerfil";
import { getBitacora } from "../../../ts/Admin/GetBitacora";

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
  const [sedeId, setSedeId] = useState<number | null>(null);
  const [logsPerPage, setLogsPerPage] = useState(3);
  const [maxPageButtons, setMaxPageButtons] = useState(10);

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

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLogsPerPage(4);
        setMaxPageButtons(5);
      } else {
        setLogsPerPage(3);
        setMaxPageButtons(10);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sedeId !== null) {
      const fetchLogs = async () => {
        try {
          const response = await getBitacora(sedeId);
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

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const formatDateTime = (dateTime: string) => {
    const dateObj = new Date(dateTime);
    const formattedDate = dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${formattedDate} - ${formattedTime}`;
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
            <span className="text-xl sm:text-base">{log.username}</span>
          </div>

          <div className="flex-1 mt-2 sm:mt-0 sm:ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateTime(log.date)}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Acción:</strong> {log.action}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Detalles:</strong> {log.description}
            </p>
          </div>
        </div>
      ))}

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
            className={`mx-1 px-3 py-1 rounded-md border ${
              currentPage === page
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
