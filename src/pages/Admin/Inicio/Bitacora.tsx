import { useEffect, useState } from "react";
import "./Bitacora.css";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";  // Importa el componente Breadcrumb

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
  const logsPerPage = 3; // Cambié a 3 registros por página
  const [maxPageButtons] = useState(10); // Limitar los botones de página

  useEffect(() => {
    const simulatedLogs: Log[] = [
      {
        date: "2024-12-10T10:00:00Z",
        username: "Usuario1",
        id_user: 1,
        action: "Acceso al sistema",
        description: "El usuario accedió al sistema desde IP 192.168.0.1.",
      },
      {
        date: "2024-12-09T14:00:00Z",
        username: "Usuario2",
        id_user: 2,
        action: "Edición de registro",
        description: "El usuario editó el registro con ID 123.",
      },
      {
        date: "2024-12-08T09:30:00Z",
        username: "Usuario3",
        id_user: 3,
        action: "Creación de archivo",
        description: "El usuario creó un nuevo archivo de reporte.",
      },
      {
        date: "2024-12-07T16:45:00Z",
        username: "Usuario4",
        id_user: 4,
        action: "Acceso al sistema",
        description: "El usuario accedió al sistema desde IP 192.168.0.2.",
      },
      {
        date: "2024-12-06T11:20:00Z",
        username: "Usuario5",
        id_user: 5,
        action: "Eliminación de archivo",
        description: "El usuario eliminó un archivo de registros antiguos.",
      },
      {
        date: "2024-12-05T13:15:00Z",
        username: "Usuario6",
        id_user: 6,
        action: "Cambio de contraseña",
        description: "El usuario cambió su contraseña de acceso.",
      },
      {
        date: "2024-12-04T08:00:00Z",
        username: "Usuario7",
        id_user: 7,
        action: "Acceso al sistema",
        description: "El usuario accedió al sistema desde IP 192.168.0.3.",
      },
      {
        date: "2024-12-03T10:10:00Z",
        username: "Usuario8",
        id_user: 8,
        action: "Edición de registro",
        description: "El usuario editó el registro con ID 124.",
      },
      {
        date: "2024-12-02T09:00:00Z",
        username: "Usuario9",
        id_user: 9,
        action: "Acceso al sistema",
        description: "El usuario accedió al sistema desde IP 192.168.0.4.",
      },
      {
        date: "2024-12-01T14:30:00Z",
        username: "Usuario10",
        id_user: 10,
        action: "Acceso al sistema",
        description: "El usuario accedió al sistema desde IP 192.168.0.5.",
      },
      {
        date: "2024-11-30T17:50:00Z",
        username: "Usuario11",
        id_user: 11,
        action: "Cambio de configuración",
        description: "El usuario cambió la configuración de la cuenta.",
      },
      {
        date: "2024-11-29T12:40:00Z",
        username: "Usuario12",
        id_user: 12,
        action: "Acceso al sistema",
        description: "El usuario accedió al sistema desde IP 192.168.0.6.",
      },
    ];

    setLogs(simulatedLogs);
  }, []);

  // Paginación
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
    <div className="bitacora-admin mt-5">
      <Breadcrumb pageName="Bitácora de Actividades" />  {/* Aquí agregas el Breadcrumb */}
      <div className="bitacora-container">
        {currentLogs.map((log, index) => (
          <div key={index} className="bitacora-item">
            <div className="bitacora-label">
              {new Date(log.date).toLocaleDateString("en-CA")}
            </div>
            <div className="bitacora-content">
              <span className="bitacora-time">
                {new Date(log.date).toLocaleTimeString()}
              </span>
              <div className="bitacora-header">
                <h3 className="bitacora-title">{log.username}</h3>
                <span>ID: {log.id_user}</span>
              </div>
              <div className="bitacora-body">
                <p><strong>Acción:</strong> {log.action}</p>
                <p><strong>Detalles:</strong> {log.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination mt-4 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500 dark:bg-boxdark dark:text-white"
        >
          &#8592;
        </button>
        {Array.from({ length: Math.min(totalPages, maxPageButtons) }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={`mx-1 px-3 py-1 rounded-md border ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500 dark:bg-boxdark dark:text-white'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-500 dark:bg-boxdark dark:text-white"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Bitacora;
