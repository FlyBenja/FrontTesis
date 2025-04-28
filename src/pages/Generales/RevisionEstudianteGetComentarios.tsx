import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getComentariosRevision } from "../../ts/CoordinadorYRevisorTesis/GetComentariosRevision"
import { ArrowLeft, Download, MessageSquare } from "lucide-react"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

const RevisionEstudianteComentarios: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [revisiones, setRevisiones] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const userId = location.state?.userId

  useEffect(() => {
    if (userId) {
      const fetchRevisiones = async () => {
        setIsLoading(true)
        try {
          const data = await getComentariosRevision(userId)
          setRevisiones(data)
        } catch (error) {
          console.error("Error al obtener detalles de revisiones pendientes:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchRevisiones()
    }
  }, [userId])

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error al descargar el archivo:", error)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return { short: "Fecha no disponible", long: "Fecha no disponible" }

    const date = new Date(dateString)

    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const formattedLongDate = date.toLocaleDateString("es-ES", {
      weekday: "long",
      month: "long",
      year: "numeric",
    })

    const formattedTime = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    return {
      short: formattedDate,
      long: `${formattedLongDate} / ${formattedTime}`,
    }
  }

  // Get student info from the first revision (assuming all revisions are from the same student)
  const studentInfo = revisiones.length > 0 ? revisiones[0].user : null
  const campusInfo = revisiones.length > 0 ? revisiones[0].user.location : null

  return (
    <>
      <Breadcrumb pageName="Revisión de estudiante" />

      <div className="mb-6">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : revisiones.length > 0 ? (
        <div className="space-y-6">
          {/* Student Information Card - Shown only once */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
            <div className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Información del Estudiante</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Student info */}
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {/* Profile photo */}
                  <div className="flex-shrink-0">
                    {studentInfo?.profilePhoto ? (
                      <img
                        src={studentInfo.profilePhoto || "/placeholder.svg"}
                        alt="Foto de perfil"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
                        {studentInfo?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Student details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Datos del Alumno</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Nombre:</span> {studentInfo?.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Carné:</span> {studentInfo?.carnet}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Correo:</span> {studentInfo?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campus info */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Datos de la Sede</h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Sede:</span> {campusInfo?.nameSede}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Año:</span> {studentInfo?.year.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revisions List - Each revision shown separately */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4">
            Revisiones ({revisiones.length})
          </h2>

          <div className="grid gap-6">
            {revisiones.map((revision) => (
              <div
                key={revision.revision_thesis_id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Header with status */}
                <div
                  className={`px-6 py-3 flex justify-between items-center ${revision.active_process ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                >
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Revisión #{revision.revision_thesis_id}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      revision.active_process
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {revision.active_process ? "En proceso" : "Finalizado"}
                  </span>
                </div>

                {/* Main content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Reviewer info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Datos del Revisor</h3>
                      <div className="space-y-3">
                        {revision.AssignedReviews.map((assignedReview: any) => (
                          <div
                            key={assignedReview.assigned_review_id}
                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Nombre:</span> {assignedReview.user.name}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Correo:</span> {assignedReview.user.email}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Fecha de Revisión</h3>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {revision.approvaltheses &&
                        revision.approvaltheses[0]?.status === "approved" &&
                        revision.approvaltheses[0]?.date_approved ? (
                          <div>
                            <p className="text-base font-medium text-gray-800 dark:text-white">
                              {formatDate(new Date(revision.approvaltheses[0].date_approved).toString()).short}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(new Date(revision.approvaltheses[0].date_approved).toString()).long}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-base font-medium text-gray-800 dark:text-white">
                              {formatDate(revision.AssignedReviews[0]?.date_assigned || "").short}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(revision.AssignedReviews[0]?.date_assigned || "").long}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" /> Comentarios
                    </h3>

                    {revision.AssignedReviews.some(
                      (review: any) => review.commentsRevisions && review.commentsRevisions.length > 0,
                    ) ? (
                      <div className="space-y-4">
                        {revision.AssignedReviews.map((assignedReview: any) =>
                          assignedReview.commentsRevisions && assignedReview.commentsRevisions.length > 0 ? (
                            <div key={`comments-${assignedReview.assigned_review_id}`} className="space-y-3">
                              {assignedReview.commentsRevisions.map((comment: any, index: number) => (
                                <div
                                  key={`comment-${index}`}
                                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-grey-500"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                                      {comment.title || "Sin título"}
                                    </h4>
                                    {comment.date_comment && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(comment.date_comment).short}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                    {comment.comment || "Sin comentario"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Por: {assignedReview.user.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : null,
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400">No hay comentarios disponibles</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    {revision.thesis_dir && (
                      <button
                        className="flex items-center px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                        onClick={() =>
                          handleDownload(revision.thesis_dir, `tesis_${revision.AssignedReviews[0].user.user_id}.pdf`)
                        }
                      >
                        <Download className="mr-2 h-4 w-4" /> Descargar Tesis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Cargando información o no hay revisiones pendientes...
          </p>
        </div>
      )}
    </>
  )
}

export default RevisionEstudianteComentarios

