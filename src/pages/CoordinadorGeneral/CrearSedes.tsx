"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import "driver.js/dist/driver.css"
import { driver } from "driver.js"
import CrearSedes from "../../components/Modals/CrearSede"

// Interface defining the structure of a Sede object
interface Sede {
  id: number
  nombre: string
  direccion: string
}

const CrearSede: React.FC = () => {
  // State for storing list of sedes
  const [sedes, setSedes] = useState<Sede[]>([])
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [sedesPerPage, setSedesPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  // Effect hook to fetch sedes when the component mounts
  useEffect(() => {
    // Function to simulate fetching sedes
    const fetchSedes = () => {
      const mockSedes = [
        { id: 1, nombre: "Sede 1", direccion: "Dirección 1" },
        { id: 2, nombre: "Sede 2", direccion: "Dirección 2" },
        { id: 3, nombre: "Sede 3", direccion: "Dirección 3" },
      ]
      const sortedSedes = mockSedes.sort((a, b) => a.id - b.id)
      setSedes(sortedSedes)
    }

    fetchSedes()

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Function to handle window resize
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSedesPerPage(4)
      setMaxPageButtons(3)
    } else {
      setSedesPerPage(5)
      setMaxPageButtons(5)
    }
  }

  // Paginación
  const indexOfLastSede = currentPage * sedesPerPage
  const indexOfFirstSede = indexOfLastSede - sedesPerPage
  const currentSedes = sedes.slice(indexOfFirstSede, indexOfLastSede)
  const totalPages = Math.ceil(sedes.length / sedesPerPage)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const end = Math.min(totalPages, start + maxPageButtons - 1)

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  // Function to open the modal
  const handleOpenModal = () => setIsModalOpen(true)
  // Function to close the modal
  const handleCloseModal = () => setIsModalOpen(false)

  // Function to handle sede creation
  const handleCreateSede = (nombre: string, direccion: string) => {
    const newSede = {
      id: sedes.length + 1,
      nombre,
      direccion,
    }
    setSedes([...sedes, newSede])
    handleCloseModal()
  }

  // Function to handle sede deletion
  const handleDeleteClick = (sedeId: number) => {
    setSedes(sedes.filter((sede) => sede.id !== sedeId))
  }

  // Recorrido del componente principal
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      prevBtnText: "Anterior",
      nextBtnText: "Siguiente",
      doneBtnText: "Finalizar",
      progressText: "Paso {{current}} de {{total}}",
    })

    driverObj.setSteps([
      {
        element: "#tabla-sedes",
        popover: {
          title: "Tabla de Sedes",
          description: "Aquí se muestran todas las sedes registradas en el sistema.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#boton-crear-sede",
        popover: {
          title: "Crear Sede",
          description: "Haz clic aquí para abrir el formulario de creación de una nueva sede.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#delete-sede",
        popover: {
          title: "Eliminar Sede",
          description: 'Puedes eliminar una sede haciendo clic en el botón "Eliminar" de la fila correspondiente.',
          side: "bottom",
          align: "start",
        },
      },
    ])

    driverObj.drive()
  }

  return (
    <>
      <Breadcrumb pageName="Crear Sede" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div id="tabla-sedes" className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              Sedes Registradas
            </h3>
            <div className="flex items-center space-x-3">
              <button
                id="boton-crear-sede"
                onClick={handleOpenModal}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Nueva Sede
              </button>

              {/* Botón para iniciar los recorridos */}
              <button
                onClick={startTour}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg transition duration-300 group"
                aria-label="Iniciar recorrido guiado"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                >
                  <g>
                    <path
                      d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                  </g>
                </svg>
                <span className="sr-only">Iniciar recorrido guiado</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              id="tabla-sedes"
              className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark"
            >
              <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-center">Dirección</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentSedes.length > 0 ? (
                  currentSedes.map((sede) => (
                    <tr
                      key={sede.id}
                      className="border-t border-gray-200 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors duration-150"
                    >
                      <td className="py-2 px-4 text-left text-black dark:text-white">
                        {sede.nombre}
                      </td>
                      <td className="py-2 px-4 text-center text-black dark:text-white">
                        {sede.direccion}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          id="delete-sede"
                          onClick={() => handleDeleteClick(sede.id)}
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
                      No hay sedes registradas. Haga clic en "Crear Nueva Sede" para agregar una.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div id="pagination" className="mt-6 flex justify-center items-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {getPageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === page
                      ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-200"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear nueva sede */}
      <CrearSedes isOpen={isModalOpen} onClose={handleCloseModal} onCreateSede={handleCreateSede} />
    </>
  )
}

export default CrearSede
