import type React from "react"
import { useState, useEffect } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { getAdmins } from "../../ts/HeadquartersCoordinator/GetAdmins"
import { deleteAdmin } from "../../ts/HeadquartersCoordinator/DeleteAdmin"
import { getDatosPerfil } from '../../ts/General/GetProfileData';
import Swal from "sweetalert2"
import TourCreateAdmin from "../../components/Tours/HeadquartersCoordinator/TourCreateAdmin"
import CrearAdminModal from "../../components/Modals/CreateAdmin"

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
  // State for storing list of admins
  const [admins, setAdmins] = useState<Admin[]>([])
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [adminsPerPage, setAdminsPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  /**
   * Effect hook to fetch admins and set up window resize listener when the component mounts
   */
  useEffect(() => {
    // Fetch the data for admins
    fetchAdmins()

    // Add listener for window resize
    window.addEventListener("resize", handleResize)
    handleResize() // Call handleResize on load to set initial values

    return () => {
      window.removeEventListener("resize", handleResize) // Clean up the listener when component unmounts
    }
  }, []) // Empty dependency array means it runs only once when the component mounts

  /**
   * Function to fetch the list of admins
   */
  const fetchAdmins = async () => {
    try {
      // Fetch user profile data
      const perfil = await getDatosPerfil();
      // Get the current 'sede' (campus) from the profile data
      const sedeId = perfil.sede;
      const data = await getAdmins(sedeId)
      // Transform the data to match the Admin interface
      const transformedAdmins: Admin[] = data.map((admin) => ({
        id: admin.user_id,
        nombre: admin.name,
        email: admin.email,
        sede: admin.sede.nombre,
        carnet: admin.carnet,
      }))
      // Sort admins by id in ascending order
      const sortedAdmins = transformedAdmins.sort((a, b) => a.id - b.id)
      setAdmins(sortedAdmins)
    } catch (error) {
      console.error("Error al obtener los administradores:", error)
    }
  }

  /**
   * Function to handle window resize
   */
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setAdminsPerPage(10)
      setMaxPageButtons(3)
    } else {
      setAdminsPerPage(10)
      setMaxPageButtons(5)
    }
  }

  // Pagination calculations
  const indexOfLastAdmin = currentPage * adminsPerPage
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin)
  const totalPages = Math.ceil(admins.length / adminsPerPage)

  /**
   * Function to handle pagination
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  /**
   * Function to get the range of page numbers to display
   */
  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const end = Math.min(totalPages, start + maxPageButtons - 1)

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  /**
   * Function to open the modal
   */
  const handleOpenModal = () => setIsModalOpen(true)

  /**
   * Function to close the modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  /**
   * Function to handle admin deletion
   */
  const handleDeleteClick = (adminId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Al eliminar el administrador se volverá un catedrático en la sede asignada!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call the deleteAdmin API to delete the admin
          await deleteAdmin(adminId)
          // Display success alert after deletion
          Swal.fire({
            icon: "success",
            title: "Administrador eliminado",
            text: `El administrador ha sido eliminado exitosamente.`,
            confirmButtonColor: "#28a745",
            confirmButtonText: "OK",
          })

          // Reload the list of admins after deletion
          await fetchAdmins()
        } catch (error: any) {
          // Display error alert if deletion fails
          Swal.fire({
            icon: "error",
            title: "Error al eliminar administrador",
            text: error.message,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "OK",
          })
        }
      }
    })
  }

  return (
    <>
      <Breadcrumb pageName="Crear Admin a Sede" />

      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            Administradores Registrados
          </h3>
          <div className="flex items-center space-x-3">
            <button
              id="boton-crear-admin"
              onClick={handleOpenModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
            >
              Crear Nuevo <span className="ml-2">👤</span>
            </button>
            <TourCreateAdmin />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            id="tabla-admins"
            className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark"
          >
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-center hidden sm:table-cell">No.</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-center hidden sm:table-cell">Correo</th>
                <th className="py-2 px-4 text-center">Sede</th>
                <th className="py-2 px-4 text-center hidden sm:table-cell">Código</th>
                <th className="py-2 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.length > 0 ? (
                currentAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-t border-gray-200 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors duration-150"
                  >
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden sm:table-cell">
                      {admin.id}
                    </td>
                    <td className="py-2 px-4 text-left text-black dark:text-white">{admin.nombre}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden sm:table-cell">
                      {admin.email}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{admin.sede}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden sm:table-cell">
                      {admin.carnet}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        id="delete-admin"
                        onClick={() => handleDeleteClick(admin.id || 0)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay administradores registrados
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

      {/* Modal para crear administrador */}
      <CrearAdminModal isOpen={isModalOpen} onClose={handleCloseModal} onAdminCreated={fetchAdmins} />
    </>
  )
}

export default CreateAdmin
