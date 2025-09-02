import { useState, useEffect } from "react"
import { getHeadquartersCoordinator } from "../../ts/GeneralCoordinator/GetHeadquartersCoordinator"
import { removeHeadquartersCoordinator } from "../../ts/GeneralCoordinator/RemoveHeadquartersCoordinator"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import TourCoordinatorHeadquarters from "../../components/Tours/GeneralCoordinator/TourCoordinatorHeadquarters"
import CreateCoordinatorModal from "../../components/Modals/CreateCoordinator"
import AssignCoordinatorModal from "../../components/Modals/AssignCoordinator"
import Swal from "sweetalert2"
import { Users, UserPlus, MapPin, Trash2, ChevronLeft, ChevronRight } from "lucide-react" // Import Lucide React icons

interface CoordinatorType {
  id: number
  nombre: string
  correo: string
  sede: string
  sede_id: number
  fotoPerfil: string
}

const CreateCoordinatorSede: React.FC = () => {
  const [coordinators, setCoordinators] = useState<CoordinatorType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [coordinatorsPerPage, setCoordinatorsPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  const fetchCoordinators = async () => {
    try {
      const data = await getHeadquartersCoordinator()
      const transformedData: CoordinatorType[] = data.map((item) => ({
        id: item.user_id,
        nombre: item.name,
        correo: item.email,
        sede: item.location?.nameSede || "Sin sede",
        sede_id: item.sede_id || 0,
        fotoPerfil: item.profilePhoto,
      }))
      const sortedCoordinators = transformedData.sort((a, b) => a.id - b.id)
      setCoordinators(sortedCoordinators)
    } catch (error) {
      
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
      setCoordinatorsPerPage(10) // Adjusted for smaller screens
      setMaxPageButtons(3)
    } else {
      setCoordinatorsPerPage(10) // Adjusted for larger screens
      setMaxPageButtons(10)
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
    const range: number[] = []
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i)
    }
    return range
  }

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleOpenAssignModal = () => setIsAssignModalOpen(true)
  const handleCloseAssignModal = () => setIsAssignModalOpen(false)

  const handleCreateCoordinator = async () => {
    await fetchCoordinators()
    handleCloseModal()
  }

  const handleAssignCoordinator = async () => {
    await fetchCoordinators()
  }

  const handleDeleteClick = async (coordinatorId: number, sedeId: number) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción removerá al coordinador de la sede",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, remover",
        cancelButtonText: "Cancelar",
      })
      if (result.isConfirmed) {
        await removeHeadquartersCoordinator(coordinatorId, sedeId)
        Swal.fire({
          icon: "success",
          title: "¡Coordinador removido!",
          text: "El coordinador ha sido removido exitosamente.",
          confirmButtonColor: "#10b981",
          confirmButtonText: "De Acuerdo",
        })
        await fetchCoordinators()
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message || "No se pudo eliminar el coordinador",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "De Acuerdo",
      })
    }
  }

  const renderProfilePhoto = (profilePhoto: string, userName: string) => {
    if (profilePhoto) {
      return (
        <img
          src={profilePhoto || "/placeholder.svg"}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow-sm"
        />
      )
    } else {
      const initial = userName.charAt(0).toUpperCase()
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-md">
          {initial}
        </div>
      )
    }
  }

  return (
    <>
      <Breadcrumb pageName="Crear Coordinador de Sede" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header and Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 rounded-t-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Coordinadores Registrados</h3>
                  <p className="text-blue-100 text-sm">Gestiona los coordinadores de sede</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="boton-crear-coordinador"
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Crear Nuevo</span>
                </button>
                <button
                  id="boton-asignar-coordinador"
                  onClick={handleOpenAssignModal}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Asignar</span>
                </button>
                <TourCoordinatorHeadquarters />
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="p-8">
            <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
              <table id="tabla-coordinadores" className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left rounded-tl-xl">Foto</th>
                    <th className="py-3 px-4 text-center hidden sm:table-cell">Nombre</th>
                    <th className="py-3 px-4 text-center hidden sm:table-cell">Correo</th>
                    <th className="py-3 px-4 text-center">Sede</th>
                    <th className="py-3 px-4 text-center rounded-tr-xl">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCoordinators.length > 0 ? (
                    currentCoordinators.map((coordinator) => (
                      <tr
                        key={coordinator.id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-center">
                          {renderProfilePhoto(coordinator.fotoPerfil, coordinator.nombre)}
                        </td>
                        <td className="py-3 px-4 text-left text-gray-900 dark:text-white font-medium">
                          {coordinator.nombre}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                          {coordinator.correo}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{coordinator.sede}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            id="remover-coordinador"
                            onClick={() => handleDeleteClick(coordinator.id, coordinator.sede_id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform shadow-md hover:shadow-lg inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No hay coordinadores registrados</p>
                          <p className="text-sm">Crea tu primer coordinador para comenzar</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div id="pagination" className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {getPageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${currentPage === page
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateCoordinatorModal isOpen={isModalOpen} onClose={handleCloseModal} onCreated={handleCreateCoordinator} />
      <AssignCoordinatorModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        onAssigned={handleAssignCoordinator}
      />
    </>
  )
}

export default CreateCoordinatorSede
