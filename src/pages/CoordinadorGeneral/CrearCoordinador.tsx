import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js
import { driver } from 'driver.js';
import ModalCrearCoordinador from '../../components/Modals/CrearCoordinador.tsx'; // Importa el nuevo componente ModalCrearCoordinador

// Interface defining the structure of a Coordinador object
interface Coordinador {
  id: number;
  nombre: string;
  correo: string;
}

const CrearCoordinador: React.FC = () => {
  // State for storing list of coordinadores
  const [coordinadores, setCoordinadores] = useState<Coordinador[]>([]);
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [coordinadoresPerPage, setCoordinadoresPerPage] = useState(5);
  const [maxPageButtons, setMaxPageButtons] = useState(5);

  // Effect hook to fetch coordinadores when the component mounts
  useEffect(() => {
    // Function to simulate fetching coordinadores
    const fetchCoordinadores = () => {
      const mockCoordinadores = [
        { id: 1, nombre: 'Coordinador 1', correo: 'coordinador1@example.com' },
        { id: 2, nombre: 'Coordinador 2', correo: 'coordinador2@example.com' },
        { id: 3, nombre: 'Coordinador 3', correo: 'coordinador3@example.com' },
      ];
      const sortedCoordinadores = mockCoordinadores.sort((a, b) => a.id - b.id);
      setCoordinadores(sortedCoordinadores);
    };

    fetchCoordinadores();

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to handle window resize
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setCoordinadoresPerPage(4);
      setMaxPageButtons(5);
    } else {
      setCoordinadoresPerPage(5);
      setMaxPageButtons(10);
    }
  };

  // Paginación
  const indexOfLastCoordinador = currentPage * coordinadoresPerPage;
  const indexOfFirstCoordinador = indexOfLastCoordinador - coordinadoresPerPage;
  const currentCoordinadores = coordinadores.slice(indexOfFirstCoordinador, indexOfLastCoordinador);
  const totalPages = Math.ceil(coordinadores.length / coordinadoresPerPage);

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

  // Function to open the modal
  const handleOpenModal = () => setIsModalOpen(true);
  // Function to close the modal
  const handleCloseModal = () => setIsModalOpen(false);

  // Function to handle coordinador creation
  const handleCreateCoordinador = (nombre: string, correo: string) => {
    const newCoordinador = {
      id: coordinadores.length + 1,
      nombre,
      correo,
    };
    setCoordinadores([...coordinadores, newCoordinador]);
    handleCloseModal();
  };

  // Function to handle coordinador deletion
  const handleDeleteClick = (coordinadorId: number) => {
    setCoordinadores(coordinadores.filter((coordinador) => coordinador.id !== coordinadorId));
  };

  // Recorrido del componente principal
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: 'Paso {{current}} de {{total}}',
    });

    driverObj.setSteps([
      {
        element: '#tabla-coordinadores', // ID de la tabla de coordinadores
        popover: {
          title: 'Tabla de Coordinadores',
          description: 'Aquí se muestran todos los coordinadores registrados en el sistema.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#boton-crear-coordinador', // ID del botón "Crear Coordinador"
        popover: {
          title: 'Crear Coordinador',
          description: 'Haz clic aquí para abrir el formulario de creación de un nuevo coordinador.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#delete-coordinador', // Clase de los botones "Eliminar"
        popover: {
          title: 'Eliminar Coordinador',
          description: 'Puedes eliminar un coordinador haciendo clic en el botón "Eliminar" de la fila correspondiente.',
          side: 'bottom',
          align: 'start',
        },
      },
    ]);

    driverObj.drive();
  };

  return (
    <>
      <Breadcrumb pageName="Crear Coordinador" />

      <div className="mx-auto max-w-6xl px-6 py-3">
        <div id="tabla-coordinadores" className="bg-white dark:bg-boxdark rounded-lg shadow-md p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">Coordinadores Registrados</h3>
            <div className="flex items-center ml-auto space-x-2">
              <button
                id="boton-crear-coordinador"
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Crear Nuevo Coordinador
              </button>

              {/* Botón para iniciar los recorridos */}
              <button
                style={{ width: '35px', height: '35px' }}
                onClick={startTour}
                className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 group"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <circle cx="12" cy="17" r="1" fill="#ffffff"></circle>
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              id="tabla-coordinadores"
              className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark"
            >
              <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-center">Correo</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentCoordinadores.length > 0 ? (
                  currentCoordinadores.map((coordinador) => (
                    <tr
                      key={coordinador.id}
                      className="border-t border-gray-200 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors duration-150"
                    >
                      <td className="py-2 px-4 text-left text-black dark:text-white">
                        {coordinador.nombre}
                      </td>
                      <td className="py-2 px-4 text-center text-black dark:text-white">
                        {coordinador.correo}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          id="delete-coordinador"
                          onClick={() => handleDeleteClick(coordinador.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        >
                          <svg
                            className="w-4 h-4 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-gray-400">
                      No hay coordinadores registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            id="pagination"
            className="mt-4 flex justify-center"
          >
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
      </div>

      {/* Modal para crear nuevo coordinador */}
      <ModalCrearCoordinador
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateCoordinador={handleCreateCoordinador}
      />
    </>
  );
};

export default CrearCoordinador;
