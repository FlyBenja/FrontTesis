import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { asignaRevisor } from "../../ts/ThesisCoordinatorandReviewer/AssignReviewer"
import { getRevisores } from "../../ts/ThesisCoordinatorandReviewer/GetReviewers"

interface AssignReviewerProps {
  onClose: () => void
  revisionThesisId: number
}

interface Revisor {
  user_id: number
  name: string
  active: boolean
}

const AssignReviewer: React.FC<AssignReviewerProps> = ({ onClose, revisionThesisId }) => {
  const [selectedRevisor, setSelectedRevisor] = useState<string>("")
  const [revisores, setRevisores] = useState<Revisor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRevisores = async () => {
      try {
        const revisoresList = await getRevisores()
        const filteredRevisores = revisoresList.filter((revisor: Revisor) => revisor.active)
        setRevisores(filteredRevisores)
      } catch (err) {
        setError("Error al cargar los revisores.")
      } finally {
        setLoading(false)
      }
    }

    fetchRevisores()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRevisor) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor seleccione un revisor.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setSubmitting(true)
    try {
      await asignaRevisor({
        revision_thesis_id: revisionThesisId,
        user_id: Number(selectedRevisor),
      })

      Swal.fire({
        title: "¡Éxito!",
        text: "Revisor asignado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#10b981",
      }).then(() => {
        onClose()
        navigate("/coordinadortesis/solicitud-revisiones")
      })
    } catch (error) {
      let errorMessage = "Error desconocido"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-2xl mt-32 md:max-w-3xl md:mt-40 lg:max-w-4xl lg:mt-35 lg:ml-[330px] transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Asignar Revisor</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona un revisor para la tesis</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              👨‍🏫 Selecciona un revisor
            </label>
            {loading ? (
              <div className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                Cargando revisores...
              </div>
            ) : error ? (
              <div className="w-full px-3 py-1.5 border-2 border-red-200 dark:border-red-600 rounded-md text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : (
              <select
                value={selectedRevisor}
                onChange={(e) => setSelectedRevisor(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                required
              >
                <option value="">Seleccione un revisor</option>
                {revisores.map((revisor) => (
                  <option key={revisor.user_id} value={revisor.user_id}>
                    {revisor.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 mr-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-gray-700 dark:text-gray-300 font-medium rounded-md transition-all duration-200 text-sm
                         border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedRevisor || submitting}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                         text-white font-medium rounded-md transition-all duration-200 transform text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Asignando...
                </div>
              ) : (
                "Asignar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignReviewer
