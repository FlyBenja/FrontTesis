import type React from "react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { getNote } from "../../ts/General/GetNote"
import { updateNote } from "../../ts/Administrator/UpdateNote"

interface ModalNotaProps {
  isOpen: boolean
  onClose: () => void
  studentId: number
  courseId: number
}

const ModalNota: React.FC<ModalNotaProps> = ({ isOpen, onClose, studentId, courseId }) => {
  const [nota, setNota] = useState("")
  const [role, setRole] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const storedRole = localStorage.getItem("userRole")
      setRole(storedRole ? Number(storedRole) : null)
      fetchNota()
    }
  }, [isOpen])

  const fetchNota = async () => {
    const data = await getNote(studentId, courseId)
    setNota(data.note !== null ? String(data.note) : "")
  }

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()

    const notaNumerica = Number(nota)
    if (isNaN(notaNumerica)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La nota debe ser un número válido.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setLoading(true)
    try {
      const error = await updateNote({
        student_id: studentId,
        course_id: courseId,
        note: notaNumerica,
      })

      if (!error) {
        Swal.fire({
          icon: "success",
          title: "¡Nota actualizada!",
          text: `La nota del estudiante ha sido actualizada exitosamente a ${notaNumerica} puntos.`,
          confirmButtonColor: "#10b981",
        })
        onClose()
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar nota",
          text: error || "Error desconocido",
          confirmButtonColor: "#ef4444",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-2xl mt-32 md:max-w-3xl md:mt-40 lg:max-w-4xl lg:mt-35 lg:ml-[330px] transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Nota Estudiante</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {role === 5 ? "Consulta la nota del estudiante" : "Actualiza la nota del estudiante"}
          </p>
        </div>

        <form onSubmit={handleGuardar}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📊 Nota</label>
            <input
              type="number"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600
                         transition-all duration-200 outline-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ingrese la nota"
              disabled={role === 5}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-gray-700 dark:text-gray-300 font-medium rounded-md transition-all duration-200 text-sm
                         border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
            >
              {role === 5 ? "Cerrar" : "Cancelar"}
            </button>
            {role !== 5 && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                       text-white font-medium rounded-md transition-all duration-200 text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </div>
                ) : (
                  "Editar"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNota
