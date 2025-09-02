import type React from "react"
import { useState } from "react"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { enviaComentario } from "../../ts/ThesisCoordinatorandReviewer/SendComments"

interface SendCommentProps {
  onClose: () => void
  revision_thesis_id: number
}

const SendComment: React.FC<SendCommentProps> = ({ onClose, revision_thesis_id }) => {
  const [titulo, setTitulo] = useState("")
  const [comentario, setComentario] = useState("")
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo || !comentario || status === "") {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios.",
        icon: "error",
        confirmButtonText: "De Acuerdo",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setLoading(true)
    try {
      await enviaComentario({
        revision_thesis_id: revision_thesis_id,
        title: titulo,
        comment: comentario,
        status: Number(status),
      })

      Swal.fire({
        title: "¡Éxito!",
        text: "Comentario enviado correctamente",
        icon: "success",
        confirmButtonText: "De Acuerdo",
        confirmButtonColor: "#10b981",
      }).then(() => {
        onClose()
        navigate("/coordinadortesis/mis-asignaciones")
      })
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo enviar el comentario.",
        icon: "error",
        confirmButtonText: "De Acuerdo",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-2xl mt-32 md:max-w-3xl md:mt-40 lg:max-w-4xl lg:mt-35 lg:ml-[330px] transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Enviar Comentario</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Proporciona retroalimentación sobre la tesis</p>
        </div>

        <form onSubmit={handleSave}>
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">✏️ Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="Título del comentario"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">💬 Comentario</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={4}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none resize-none"
                placeholder="Escriba su comentario aquí"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📊 Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="1">✅ Aprobado</option>
                <option value="0">❌ Rechazado</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={loading}
              className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700
                         text-white font-medium rounded-md transition-all duration-200 transform text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SendComment
