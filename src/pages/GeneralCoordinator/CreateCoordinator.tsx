import { useState, useEffect } from "react"
import { getHeadquartersCoordinator } from "../../ts/GeneralCoordinator/GetHeadquartersCoordinator"
import { removeHeadquartersCoordinator } from "../../ts/GeneralCoordinator/RemoveHeadquartersCoordinator"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import TourCoordinator from "../../components/Tours/GeneralCoordinator/TourCoordinator"
import CreateCoordinatorModal from "../../components/Modals/CreateCoordinator"
import AssignCoordinatorModal from "../../components/Modals/AssignCoordinator"
import Swal from "sweetalert2"

interface CoordinatorType {
  id: number
  nombre: string
  correo: string
  sede: string
  sede_id: number
}

const CreateCoordinator: React.FC = () => {
  const [coordinators, setCoordinators] = useState<CoordinatorType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [coordinatorsPerPage, setCoordinatorsPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  // Función para cargar coordinadores desde la API
  const fetchCoordinators = async () => {
    try {
      const data = await getHeadquartersCoordinator()

      const transformedData: CoordinatorType[] = data.map((item) => ({
        id: item.user_id,
        nombre: item.name,
        correo: item.email,
        sede: item.location?.nameSede || "Sin sede",
        sede_id: item.sede_id || 0, // Add sede_id
      }))

      const sortedCoordinators = transformedData.sort((a, b) => a.id - b.id)
      setCoordinators(sortedCoordinators)
    } catch (error) {
      console.error("Error al obtener coordinadores:", error)
    }
  }

  useEffect(() => {
    fetchCoordinators()

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setCoordinatorsPerPage(10)
      setMaxPageButtons(3)
    } else {
      setCoordinatorsPerPage(10)
      setMaxPageButtons(5)
    }
  }

  const indexOfLastCoordinator = currentPage * coordinatorsPerPage
  const indexOfFirstCoordinator = indexOfLastCoordinator - coordinatorsPerPage
  const currentCoordinators = coordinators.slice(indexOfFirstCoordinator, indexOfLastCoordinator)
  const totalPages = Math.ceil(coordinators.length / coordinatorsPerPage)

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

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleOpenAssignModal = () => setIsAssignModalOpen(true)
  const handleCloseAssignModal = () => setIsAssignModalOpen(false)

  // Cuando se cree un coordinador, recargamos la lista
  const handleCreateCoordinator = async () => {
    await fetchCoordinators()
    handleCloseModal()
  }

  // When a coordinator is assigned, reload the list
  const handleAssignCoordinator = async () => {
    await fetchCoordinators()
  }

  const handleDeleteClick = async (coordinatorId: number, sedeId: number) => {
    try {
      // Confirm deletion
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción removerá al coordinador de la sede",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, remover",
        cancelButtonText: "Cancelar",
      })

      if (result.isConfirmed) {
        await removeHeadquartersCoordinator(coordinatorId, sedeId)

        Swal.fire({
          icon: 'success',
          title: 'Coordinador removido',
          text: 'El coordinador ha sido removido exitosamente.',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Aceptar',
        });

        // Refresh the list
        await fetchCoordinators()
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message || "No se pudo eliminar el coordinador",
        confirmButtonColor: "#FF5A5F",
        confirmButtonText: "Aceptar",
      })
    }
  }

  return (
    <>
      <Breadcrumb pageName="Crear Coordinador" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            Coordinadores Registrados
          </h3>
          <div className="flex items-center space-x-3">
            <button
              id="boton-crear-coordinador"
              onClick={handleOpenModal}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center shadow-md hover:shadow-lg"
            >
              Crear Nuevo
            </button>
            <button
              id="boton-asignar-coordinador"
              onClick={handleOpenAssignModal}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center shadow-md hover:shadow-lg"
            >
              Asignar
            </button>
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
                <th className="py-2 px-4 text-center hidden sm:table-cell">Correo</th>
                <th className="py-2 px-4 text-center">Sede</th>
                <th className="py-2 px-4 text-center">Acción</th>
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
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden sm:table-cell">
                      {coordinator.correo}
                    </td>
                    <td className="py-2 px-4 text-left text-black dark:text-white">{coordinator.sede}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        id="delete-coordinador"
                        onClick={() => handleDeleteClick(coordinator.id, coordinator.sede_id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay coordinadores registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      {/* Modal para crear coordinador */}
      <CreateCoordinatorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreated={handleCreateCoordinator}
      />

      {/* Modal para asignar coordinador */}
      <AssignCoordinatorModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        onAssigned={handleAssignCoordinator}
      />
    </>
  )
}

export default CreateCoordinator
