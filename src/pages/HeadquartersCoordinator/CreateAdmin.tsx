import type React from "react"
import { useState, useEffect } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { getAdmins } from "../../ts/HeadquartersCoordinator/GetAdmins"
import { deleteAdmin } from "../../ts/HeadquartersCoordinator/DeleteAdmin"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import Swal from "sweetalert2"
import TourCreateAdmin from "../../components/Tours/HeadquartersCoordinator/TourCreateAdmin"
import CrearAdminModal from "../../components/Modals/CreateAdmin"
import { UserPlus, Users, Trash2, ChevronLeft, ChevronRight, UserX } from "lucide-react" // Import Lucide React icons

/**
 * Interface defining the structure of an Admin object
 */
interface Admin {
  id: number
  nombre: string
  email: string
  sede: string
  carnet: string
}

/**
 * Component for creating and managing administrators
 */
const CreateAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [adminsPerPage, setAdminsPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  useEffect(() => {
    fetchAdmins()
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const fetchAdmins = async () => {
    try {
      const perfil = await getDatosPerfil()
      const sedeId = perfil.sede
      const data = await getAdmins(sedeId)
      const transformedAdmins: Admin[] = data.map((admin) => ({
        id: admin.user_id,
        nombre: admin.name,
        email: admin.email,
        sede: admin.sede.nombre,
        carnet: admin.carnet,
      }))
      const sortedAdmins = transformedAdmins.sort((a, b) => a.id - b.id)
      setAdmins(sortedAdmins)
    } catch (error) {
      console.error("Error al obtener los administradores:", error)
      setAdmins([]) // Set to empty array on error
    }
  }

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setAdminsPerPage(8) // Adjusted for smaller screens
      setMaxPageButtons(3)
    } else {
      setAdminsPerPage(5) // Adjusted for larger screens
      setMaxPageButtons(5)
    }
  }

  const indexOfLastAdmin = currentPage * adminsPerPage
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin)
  const totalPages = Math.ceil(admins.length / adminsPerPage)

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
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDeleteClick = (adminId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Al eliminar el administrador se volverá un catedrático en la sede asignada!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      confirmButtonColor: "#ef4444", // Changed to red for delete action
      cancelButtonColor: "#6b7280", // Changed to gray for cancel
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdmin(adminId)
          Swal.fire({
            icon: "success",
            title: "Administrador eliminado",
            text: `El administrador ha sido eliminado exitosamente.`,
            confirmButtonColor: "#10b981", // Changed to green for success
            confirmButtonText: "OK",
          })
          await fetchAdmins()
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar administrador",
            text: error.message,
            confirmButtonColor: "#ef4444", // Changed to red for error
            confirmButtonText: "OK",
          })
        }
      }
    })
  }

  return (
    <>
      <Breadcrumb pageName="Crear Admin a Sede 👑" />
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
                  <h3 className="text-xl font-semibold text-white">Administradores Registrados</h3>
                  <p className="text-blue-100 text-sm">Gestiona los administradores del sistema</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  id="boton-crear-admin"
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Crear Nuevo</span>
                </button>
                <TourCreateAdmin />
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="p-8">
            <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
              <table id="tabla-admins" className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-center rounded-tl-xl hidden sm:table-cell">No.</th>
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-center hidden sm:table-cell">Correo</th>
                    <th className="py-3 px-4 text-center">Sede</th>
                    <th className="py-3 px-4 text-center hidden sm:table-cell">Código</th>
                    <th className="py-3 px-4 text-center rounded-tr-xl">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.length > 0 ? (
                    currentAdmins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-center text-gray-900 dark:text-white hidden sm:table-cell">
                          {admin.id}
                        </td>
                        <td className="py-3 px-4 text-left text-gray-900 dark:text-white">{admin.nombre}</td>
                        <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                          {admin.email}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-900 dark:text-white">{admin.sede}</td>
                        <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                          {admin.carnet}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            id="delete-admin"
                            onClick={() => handleDeleteClick(admin.id || 0)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <UserX className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No hay administradores registrados. 😔</p>
                          <p className="text-sm">Crea tu primer administrador para comenzar</p>
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
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
                      currentPage === page
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
      <CrearAdminModal isOpen={isModalOpen} onClose={handleCloseModal} onAdminCreated={fetchAdmins} />
    </>
  )
}

export default CreateAdmin
