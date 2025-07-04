import { useState, useEffect } from "react"
import { getSedes } from "../../ts/GeneralCoordinator/GetHeadquarters"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import HeadquartersComponent from "../../components/Tours/GeneralCoordinator/TourHeadquarters"
import CreateHeadquartersModal from "../../components/Modals/CreateHeadquarters"

interface HeadquartersType {
  id: number
  nombre: string
  direccion: string
}

const CreateHeadquarters: React.FC = () => {
  const [headquarters, setHeadquarters] = useState<HeadquartersType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'crear' | 'editar'>('crear')
  const [selectedSede, setSelectedSede] = useState<HeadquartersType | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [headquartersPerPage, setHeadquartersPerPage] = useState(5)
  const [maxPageButtons, setMaxPageButtons] = useState(5)

  // Hacemos fetchHeadquarters reutilizable
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
      setHeadquartersPerPage(10)
      setMaxPageButtons(3)
    } else {
      setHeadquartersPerPage(10)
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
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const end = Math.min(totalPages, start + maxPageButtons - 1)

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const handleOpenCreateModal = () => {
    setModalType('crear')
    setSelectedSede(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (sedeId: number) => {
    const sedeToEdit = headquarters.find((sede) => sede.id === sedeId)
    if (sedeToEdit) {
      setModalType('editar')
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
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">Sedes Registradas</h3>
          <div className="flex items-center space-x-3">
            <button
              id="boton-crear-sede"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center shadow-md hover:shadow-lg"
            >
              Crear Nueva Sede
            </button>
            <HeadquartersComponent />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            id="tabla-sedes"
            className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark"
          >
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left hidden sm:table-cell">Número</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-center hidden sm:table-cell">Dirección</th>
                <th className="py-2 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentHeadquarters.length > 0 ? (
                currentHeadquarters.map((sede) => (
                  <tr
                    key={sede.id}
                    className="border-t border-gray-200 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors duration-150"
                  >
                    <td className="py-2 px-4 text-left text-black dark:text-white hidden sm:table-cell">{sede.id}</td>
                    <td className="py-2 px-4 text-left text-black dark:text-white">{sede.nombre}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden sm:table-cell">{sede.direccion}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        id="edit-sede"
                        onClick={() => handleEditClick(sede.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M17.707 6.293l-2.414-2.414a1 1 0 0 0-1.414 0l-9 9a1 1 0 0 0-.293.707v3.586a1 1 0 0 0 1 1h3.586a1 1 0 0 0 .707-.293l9-9a1 1 0 0 0 0-1.414z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center text-gray-500 dark:text-gray-400">
                    No existen sedes registradas.
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

      <CreateHeadquartersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
        initialData={
          selectedSede
            ? {
              sede_id: selectedSede.id,
              nameSede: selectedSede.nombre,
              address: selectedSede.direccion
            }
            : undefined
        }
        onSuccess={fetchHeadquarters}
      />
    </>
  )
}

export default CreateHeadquarters
