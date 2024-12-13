import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

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
  const [isMobile, setIsMobile] = useState(false); // Estado para determinar si es móvil
  const logsPerPage = 3; // Cambié a 3 registros por página

  useEffect(() => {
    // Simulación de registros
    const simulatedLogs: Log[] = [
      { date: "2024-12-10T10:00:00Z", username: "Usuario1", id_user: 1, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.1." },
      { date: "2024-12-09T14:00:00Z", username: "Usuario2", id_user: 2, action: "Edición de registro", description: "El usuario editó el registro con ID 123." },
      { date: "2024-12-08T09:30:00Z", username: "Usuario3", id_user: 3, action: "Creación de archivo", description: "El usuario creó un nuevo archivo de reporte." },
      { date: "2024-12-07T16:45:00Z", username: "Usuario4", id_user: 4, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.2." },
      { date: "2024-12-06T11:20:00Z", username: "Usuario5", id_user: 5, action: "Eliminación de archivo", description: "El usuario eliminó un archivo de registros antiguos." },
      { date: "2024-12-05T13:15:00Z", username: "Usuario6", id_user: 6, action: "Cambio de contraseña", description: "El usuario cambió su contraseña de acceso." },
      { date: "2024-12-04T08:00:00Z", username: "Usuario7", id_user: 7, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.3." },
      { date: "2024-12-03T10:10:00Z", username: "Usuario8", id_user: 8, action: "Edición de registro", description: "El usuario editó el registro con ID 124." },
      { date: "2024-12-02T09:00:00Z", username: "Usuario9", id_user: 9, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.4." },
      { date: "2024-12-01T14:30:00Z", username: "Usuario10", id_user: 10, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.5." },
      { date: "2024-11-30T10:00:00Z", username: "Usuario11", id_user: 11, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.6." },
      { date: "2024-11-29T13:30:00Z", username: "Usuario12", id_user: 12, action: "Edición de registro", description: "El usuario editó el registro con ID 125." },
      { date: "2024-11-28T09:15:00Z", username: "Usuario13", id_user: 13, action: "Creación de archivo", description: "El usuario creó un archivo de reporte de ventas." },
      { date: "2024-11-27T16:45:00Z", username: "Usuario14", id_user: 14, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.7." },
      { date: "2024-11-26T08:30:00Z", username: "Usuario15", id_user: 15, action: "Cambio de contraseña", description: "El usuario cambió su contraseña de acceso." },
      { date: "2024-11-25T15:00:00Z", username: "Usuario16", id_user: 16, action: "Eliminación de archivo", description: "El usuario eliminó un archivo de informes antiguos." },
      { date: "2024-11-24T12:45:00Z", username: "Usuario17", id_user: 17, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.8." },
      { date: "2024-11-23T10:00:00Z", username: "Usuario18", id_user: 18, action: "Edición de registro", description: "El usuario editó el registro con ID 126." },
      { date: "2024-11-22T14:00:00Z", username: "Usuario19", id_user: 19, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.9." },
      { date: "2024-11-21T09:15:00Z", username: "Usuario20", id_user: 20, action: "Creación de archivo", description: "El usuario creó un nuevo archivo de reporte de ingresos." },
      { date: "2024-11-20T13:30:00Z", username: "Usuario21", id_user: 21, action: "Cambio de contraseña", description: "El usuario cambió su contraseña de acceso." },
      { date: "2024-11-19T08:45:00Z", username: "Usuario22", id_user: 22, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.10." },
      { date: "2024-11-18T11:00:00Z", username: "Usuario23", id_user: 23, action: "Edición de registro", description: "El usuario editó el registro con ID 127." },
      { date: "2024-11-17T14:30:00Z", username: "Usuario24", id_user: 24, action: "Acceso al sistema", description: "El usuario accedió al sistema desde IP 192.168.0.11." },
      { date: "2024-11-16T12:15:00Z", username: "Usuario25", id_user: 25, action: "Eliminación de archivo", description: "El usuario eliminó un archivo de registros de proyectos." },
    ];
    setLogs(simulatedLogs);

    // Detectar si es móvil
    const handleResize = () => setIsMobile(window.innerWidth <= 768); // Considerar móvil si el ancho es <= 768px
    handleResize(); // Llamar una vez al inicio
    window.addEventListener("resize", handleResize); // Añadir listener
    return () => window.removeEventListener("resize", handleResize); // Limpiar el listener al desmontar el componente
  }, []);

  // Paginación
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  // Ajustar número de páginas visibles
  const pagesToShow = isMobile ? 4 : totalPages; // Mostrar 4 páginas en móvil

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="mt-5 px-4">
      <Breadcrumb pageName="Bitácora de Actividades" />
      {currentLogs.map((log, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-start sm:items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-boxdark p-4 rounded-lg mb-4"
        >
          {/* Contenedor de la fecha: mover completamente a la derecha en móvil */}
          <div className="flex-shrink-0 bg-blue-600 text-white font-bold text-center rounded-md px-4 py-2 w-[150px] sm:w-auto mt-[-38px] sm:mt-0 sm:text-left sm:ml-4 absolute sm:static right-12">
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
        {Array.from({ length: pagesToShow }, (_, i) => i + 1).map((page) => (
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
