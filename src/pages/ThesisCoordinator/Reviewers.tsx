import type React from "react"
import { useState, useEffect } from "react"
import { getRevisores } from "../../ts/ThesisCoordinatorandReviewer/GetReviewers"
import { activateReviewer } from "../../ts/ThesisCoordinatorandReviewer/ActivateReviewer"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import ActivaRevisores from "../../components/Switchers/ActivateReviewers"
import CrearRevisor from "../../components/Modals/CreateReviewer"
import Swal from "sweetalert2"
import { User, ChevronLeft, ChevronRight, PlusCircle, XCircle } from "lucide-react"
import TourReviewers from "../../components/Tours/ThesisCoordinator/TourReviewers"

const Reviewers: React.FC = () => {
  const [revisores, setRevisores] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedRevisor, setSelectedRevisor] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [revisoresPerPage, setRevisoresPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(10)

  useEffect(() => {
    fetchRevisores()
  }, [])

  const fetchRevisores = async () => {
    setLoading(true)
    try {
      const data = await getRevisores()
      const filteredRevisores = data.filter((revisor) => revisor.rol_id !== 6)
      setRevisores(filteredRevisores)
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const indexOfLastRevisor = currentPage * revisoresPerPage
  const indexOfFirstRevisor = indexOfLastRevisor - revisoresPerPage
  const currentRevisores = revisores.slice(indexOfFirstRevisor, indexOfLastRevisor)
  const totalPages = Math.ceil(revisores.length / revisoresPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRevisoresPerPage(8)
        setMaxPageButtons(5)
      } else {
        setRevisoresPerPage(5)
        setMaxPageButtons(10)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleActiveChange = async (userId: number, newStatus: boolean) => {
    const updatedRevisores = revisores.map((revisor) =>
      revisor.user_id === userId ? { ...revisor, active: newStatus } : revisor,
    )
    setRevisores(updatedRevisores)
    if (!newStatus) {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Este revisor no podrá iniciar sesión, ¿aún deseas desactivarlo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, desactivar",
        cancelButtonText: "No, cancelar",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#ef4444",
      })
      if (!result.isConfirmed) {
        setRevisores(revisores)
        return
      }
    }
    try {
      const response = await activateReviewer(userId)
      Swal.fire({
        title: "¡Éxito!",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      })
    } catch (err) {
      setRevisores((prev) =>
        prev.map((revisor) => (revisor.user_id === userId ? { ...revisor, active: !newStatus } : revisor)),
      )
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const openModal = (revisor: any | null = null) => {
    setSelectedRevisor(revisor)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRevisor(null)
  }

  const handleRevisorCreated = () => {
    fetchRevisores()
    closeModal()
  }

  const getPageRange = () => {
    const range: number[] = []
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)
    for (let i = startPage; i <= endPage; i++) {
      range.push(i)
    }
    return range
  }

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Revisores o Auxiliares" />
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando revisores...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Breadcrumb pageName="Revisores o Auxiliares" />
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </>
    )
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
      <Breadcrumb pageName="Revisores o Auxiliares" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 rounded-t-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Revisores o Auxiliares</h3>
                  <p className="text-blue-100 text-sm">Gestiona los revisores del sistema</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="boton-crear-revisor"
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Crear Nuevo</span>
                </button>
                <TourReviewers />
              </div>
            </div>
          </div>
          <div className="p-8">
            <div id="tabla-revisores" className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left rounded-tl-xl">Foto</th>
                    <th className="py-3 px-4 text-center hidden md:table-cell">Nombre</th>
                    <th className="py-3 px-4 text-center hidden md:table-cell">Correo</th>
                    <th className="py-3 px-4 text-center hidden md:table-cell">Código</th>
                    <th className="py-3 px-4 text-center rounded-tr-xl">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRevisores.length > 0 ? (
                    currentRevisores.map((revisor, index) => (
                      <tr
                        key={revisor.user_id}
                        className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${index % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/50" : ""
                          }`}
                      >
                        <td className="py-3 px-4 text-center">
                          {renderProfilePhoto(revisor.fotoPerfil, revisor.name)}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900 dark:text-white font-medium">
                          {revisor.name}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {revisor.email}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {revisor.carnet}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              id="boton-editar-revisor"
                              onClick={() => openModal(revisor)}
                              className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform shadow-md hover:shadow-lg"
                            >
                              Editar
                            </button>
                            <ActivaRevisores
                              enabled={revisor.active}
                              onChange={() => handleActiveChange(revisor.user_id, !revisor.active)}
                              uniqueId={`revisor-${revisor.user_id}`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No hay revisores registrados</p>
                          <p className="text-sm">Crea tu primer revisor para comenzar</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
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
      {showModal && <CrearRevisor onClose={handleRevisorCreated} revisor={selectedRevisor} />}
    </>
  )
}

export default Reviewers
