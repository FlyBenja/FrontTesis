import { useState, useEffect } from "react"
import { getSedes } from "../../ts/GeneralCoordinator/GetHeadquarters"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import HeadquartersTour from "../../components/Tours/GeneralCoordinator/TourHeadquarters"
import CreateHeadquartersModal from "../../components/Modals/CreateHeadquarters"
import { Building, PlusCircle, Pencil, ChevronLeft, ChevronRight } from "lucide-react" // Import Lucide React icons

interface HeadquartersType {
  id: number
  nombre: string
  direccion: string
}

const CreateHeadquarters: React.FC = () => {
  const [headquarters, setHeadquarters] = useState<HeadquartersType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"crear" | "editar">("crear")
  const [selectedSede, setSelectedSede] = useState<HeadquartersType | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [headquartersPerPage, setHeadquartersPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  const fetchHeadquarters = async () => {
    try {
      const sedes = await getSedes()
      const mappedHeadquarters = sedes.map((sede) => ({
        id: sede.sede_id,
        nombre: sede.nameSede,
        direccion: sede.address,
      }))
      const sortedHeadquarters = mappedHeadquarters.sort((a, b) => a.id - b.id)
      setHeadquarters(sortedHeadquarters)
    } catch (error) {
      console.error("Error al obtener sedes:", error)
    }
  }

  useEffect(() => {
    fetchHeadquarters()
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setHeadquartersPerPage(8) // Adjusted for smaller screens
      setMaxPageButtons(3)
    } else {
      setHeadquartersPerPage(5) // Adjusted for larger screens
      setMaxPageButtons(5)
    }
  }

  const indexOfLastHeadquarters = currentPage * headquartersPerPage
  const indexOfFirstHeadquarters = indexOfLastHeadquarters - headquartersPerPage
  const currentHeadquarters = headquarters.slice(indexOfFirstHeadquarters, indexOfLastHeadquarters)
  const totalPages = Math.ceil(headquarters.length / headquartersPerPage)

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

  const handleOpenCreateModal = () => {
    setModalType("crear")
    setSelectedSede(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (sedeId: number) => {
    const sedeToEdit = headquarters.find((sede) => sede.id === sedeId)
    if (sedeToEdit) {
      setModalType("editar")
      setSelectedSede(sedeToEdit)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Breadcrumb pageName="Crear Sede" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header and Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 rounded-t-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Sedes Registradas</h3>
                  <p className="text-green-100 text-sm">Gestiona las sedes del sistema</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="boton-crear-sede"
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Crear Nueva Sede</span>
                </button>
                <HeadquartersTour />
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="p-8">
            <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
              <table id="tabla-sedes" className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left rounded-tl-xl hidden sm:table-cell">No.</th>
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-center hidden sm:table-cell">Dirección</th>
                    <th className="py-3 px-4 text-center rounded-tr-xl">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHeadquarters.length > 0 ? (
                    currentHeadquarters.map((sede) => (
                      <tr
                        key={sede.id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-center text-gray-900 dark:text-white font-medium hidden sm:table-cell">
                          {sede.id}
                        </td>
                        <td className="py-3 px-4 text-left text-gray-900 dark:text-white font-medium">{sede.nombre}</td>
                        <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                          {sede.direccion}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            id="boton-edita-sede"
                            onClick={() => handleEditClick(sede.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform shadow-md hover:shadow-lg inline-flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Building className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No existen sedes registradas</p>
                          <p className="text-sm">Crea tu primera sede para comenzar</p>
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
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${currentPage === page ? "bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"}`}
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
      <CreateHeadquartersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
        initialData={
          selectedSede
            ? { sede_id: selectedSede.id, nameSede: selectedSede.nombre, address: selectedSede.direccion }
            : undefined
        }
        onSuccess={fetchHeadquarters}
      />
    </>
  )
}

export default CreateHeadquarters
