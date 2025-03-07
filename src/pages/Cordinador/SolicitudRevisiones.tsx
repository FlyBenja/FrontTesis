import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { useNavigate } from "react-router-dom"
import { getRevisionesPendientes } from "../../ts/Cordinador/GetRevisionesPendientes" // Importa la API

const SolicitudRevisiones: React.FC = () => {
  const navigate = useNavigate()

  const [revisiones, setRevisiones] = useState<any[]>([]) // Datos de las revisiones
  const [searchCarnet, setSearchCarnet] = useState("") // Campo de búsqueda del carnet
  const [order, setOrder] = useState<"asc" | "desc">("asc") // Orden de las revisiones
  const [filteredRevisiones, setFilteredRevisiones] = useState(revisiones) // Revisión filtrada
  const [isCarnetSearch, setIsCarnetSearch] = useState(false) // Nuevo estado para rastrear si se buscó por carnet

  // State hooks for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [revisionesPerPage, setRevisionesPerPage] = useState(5) // Default to 5 items per page
  const [maxPageButtons, setMaxPageButtons] = useState(10) // Default to 10 page buttons

  // Obtener las revisiones pendientes desde la API
  const fetchRevisiones = useCallback(async (order: "asc" | "desc", carnet: string) => {
    try {
      const revisions = await getRevisionesPendientes(order, carnet)
      setRevisiones(revisions)
      setFilteredRevisiones(revisions) // Inicializa el estado de revisiones filtradas

      // Actualizar el estado de búsqueda por carnet
      setIsCarnetSearch(carnet.length >= 10)
    } catch (error) {
      setRevisiones([])
      setFilteredRevisiones([])
      setIsCarnetSearch(carnet.length >= 10)
    }
  }, [])

  // Efecto para cargar las revisiones cuando cambia el carnet o el orden
  useEffect(() => {
    const carnetValue = searchCarnet.length >= 10 ? searchCarnet : "" // Validar formato del carnet (longitud >= 10)
    fetchRevisiones(order, carnetValue) // Ejecutar la API con carnet vacío o el carnet completo
  }, [order, searchCarnet, fetchRevisiones]) // Depende de searchCarnet y order

  // Pagination logic
  const indexOfLastRevision = currentPage * revisionesPerPage
  const indexOfFirstRevision = indexOfLastRevision - revisionesPerPage
  const currentRevisiones = filteredRevisiones.slice(indexOfFirstRevision, indexOfLastRevision)

  const totalPages = Math.ceil(filteredRevisiones.length / revisionesPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Cambiar el orden de las revisiones
  const handleChangeOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"))
  }

  // Formatear la fecha de la solicitud
  const formatDate = (date: string) => {
    const formattedDate = new Date(date)
    return (
      <>
        {formattedDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </>
    )
  }

  const handleVerDetalle = (userId: number) => {
    navigate(`/cordinador/revision-estudiante`, { state: { userId } })
  }

  // Agregar console.log para mostrar la longitud del carnet ingresado
  const handleChangeSearchCarnet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCarnet = e.target.value
    setSearchCarnet(newCarnet) // Actualizar el estado
  }

  // Effect hook to handle window resize and adjust page settings accordingly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRevisionesPerPage(8) // Ajusta el número de elementos por página en pantallas pequeñas
        setMaxPageButtons(5) // Ajusta la cantidad de botones de paginación en pantallas pequeñas
      } else {
        setRevisionesPerPage(5) // Ajusta el número de elementos por página en pantallas grandes
        setMaxPageButtons(10) // Ajusta la cantidad de botones de paginación en pantallas grandes
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <Breadcrumb pageName="Nuevas solicitudes de revisión" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar por Carnet"
            value={searchCarnet}
            onChange={handleChangeSearchCarnet}
            className="w-72 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          />
          <button onClick={handleChangeOrder} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Cambiar Orden ({order === "asc" ? "Ascendente" : "Descendente"})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">No.</th>
                <th className="py-2 px-4 text-center">Nombre</th>
                {/* Estas columnas se ocultan en pantallas pequeñas */}
                <th className="py-2 px-4 text-center hidden md:table-cell">Carnet</th>
                <th className="py-2 px-4 text-center hidden md:table-cell">Fec. Solicitud</th>
                <th className="py-2 px-4 text-center hidden md:table-cell">Estado</th>
                <th className="py-2 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentRevisiones.length > 0 ? (
                currentRevisiones.map((revision) => (
                  <tr key={revision.revision_thesis_id} className="border-t border-gray-200 dark:border-strokedark">
                    <td className="py-2 px-4 text-center text-black dark:text-white">{revision.revision_thesis_id}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{revision.user.name}</td>
                    {/* Estas columnas se ocultan en pantallas pequeñas */}
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden md:table-cell">
                      {revision.user.carnet}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden md:table-cell">
                      {formatDate(revision.date_revision)}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white bg-yellow-300 dark:bg-yellow-500 font-semibold hidden md:table-cell">
                      {revision.approvalThesis.status}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => handleVerDetalle(revision.user.user_id)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    {isCarnetSearch ? "No existe carnet del Estudiante" : "No hay solicitudes de revisión"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592;
          </button>
          {[...Array(Math.min(totalPages, maxPageButtons))].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
            >
              {i + 1}
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
    </>
  )
}

export default SolicitudRevisiones

