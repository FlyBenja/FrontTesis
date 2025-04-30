import type React from "react"
import { useState, useEffect } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import TourCoordinator from "../../components/Tours/GeneralCoordinator/TourCoordinator"
import CreateCoordinatorModal from "../../components/Modals/CreateCoordinator"

// Interface defining the structure of a Coordinator object
interface Coordinator {
  id: number
  nombre: string
  correo: string
}

const CreateCoordinator: React.FC = () => {
  // State for storing list of coordinators
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [coordinatorsPerPage, setCoordinatorsPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  /**
   * Effect hook to fetch coordinators when the component mounts
   * and handle window resize events
   */
  useEffect(() => {
    // Function to simulate fetching coordinators
    const fetchCoordinators = () => {
      const mockCoordinators = [
        { id: 1, nombre: "Coordinador 1", correo: "coordinador1@example.com" },
        { id: 2, nombre: "Coordinador 2", correo: "coordinador2@example.com" },
        { id: 3, nombre: "Coordinador 3", correo: "coordinador3@example.com" },
      ]
      const sortedCoordinators = mockCoordinators.sort((a, b) => a.id - b.id)
      setCoordinators(sortedCoordinators)
    }

    fetchCoordinators()

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  /**
   * Function to handle window resize
   * Adjusts the number of items per page and max page buttons based on screen size
   */
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setCoordinatorsPerPage(4)
      setMaxPageButtons(5)
    } else {
      setCoordinatorsPerPage(5)
      setMaxPageButtons(10)
    }
  }

  // Pagination calculations
  const indexOfLastCoordinator = currentPage * coordinatorsPerPage
  const indexOfFirstCoordinator = indexOfLastCoordinator - coordinatorsPerPage
  const currentCoordinators = coordinators.slice(indexOfFirstCoordinator, indexOfLastCoordinator)
  const totalPages = Math.ceil(coordinators.length / coordinatorsPerPage)

  /**
   * Function to handle pagination
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  /**
   * Function to get the range of page numbers to display in pagination
   */
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

  /**
   * Function to handle coordinator creation
   */
  const handleCreateCoordinator = (name: string, email: string) => {
    const newCoordinator = {
      id: coordinators.length + 1,
      nombre: name,
      correo: email,
    }
    setCoordinators([...coordinators, newCoordinator])
    handleCloseModal()
  }

  /**
   * Function to handle coordinator deletion
   */
  const handleDeleteClick = (coordinatorId: number) => {
    setCoordinators(coordinators.filter((coordinator) => coordinator.id !== coordinatorId))
  }

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

              {/* Help tour button */}
              <TourCoordinator />
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
                {currentCoordinators.length > 0 ? (
                  currentCoordinators.map((coordinator) => (
                    <tr
                      key={coordinator.id}
                      className="border-t border-gray-200 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors duration-150"
                    >
                      <td className="py-2 px-4 text-left text-black dark:text-white">{coordinator.nombre}</td>
                      <td className="py-2 px-4 text-center text-black dark:text-white">{coordinator.correo}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          id="delete-coordinador"
                          onClick={() => handleDeleteClick(coordinator.id)}
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
          <div id="pagination" className="mt-4 flex justify-center">
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
      </div>

      {/* Modal for creating new coordinator */}
      <CreateCoordinatorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        CreateCoordinator={handleCreateCoordinator}
      />
    </>
  )
}

export default CreateCoordinator
