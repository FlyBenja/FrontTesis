import type React from "react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { createSede } from "../../ts/GeneralCoordinator/CreateHeadquarters"
import { updateSede } from "../../ts/GeneralCoordinator/UpdateHeadquarters"
import { useSedes } from "../ReloadPages/HeadquarterSelectContext"  // Importa el hook del contexto

interface CreateHeadquartersProps {
  isOpen: boolean
  onClose: () => void
  type: "crear" | "editar"
  initialData?: {
    sede_id: number
    nameSede: string
    address: string
  }
  onSuccess: () => void
}

const CreateHeadquartersModal: React.FC<CreateHeadquartersProps> = ({
  isOpen,
  onClose,
  type,
  initialData,
  onSuccess,
}) => {
  const [sedeNombre, setSedeNombre] = useState("")
  const [sedeDireccion, setSedeDireccion] = useState("")
  const [loading, setLoading] = useState(false)
  const { reloadSedes } = useSedes() // Usa el contexto para recargar sedes

  useEffect(() => {
    setSedeNombre("")
    setSedeDireccion("")

    if (type === "editar" && initialData) {
      setTimeout(() => {
        setSedeNombre(initialData.nameSede || "")
        setSedeDireccion(initialData.address || "")
      }, 0)
    }
  }, [type, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sedeNombre.trim() || !sedeDireccion.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setLoading(true)
    try {
      const nombreActual = sedeNombre.trim()
      const direccionActual = sedeDireccion.trim()

      if (type === "crear") {
        await createSede(nombreActual, direccionActual)
        Swal.fire({
          icon: "success",
          title: "¡Sede creada!",
          text: `La sede "${nombreActual}" ha sido creada exitosamente.`,
          confirmButtonColor: "#10b981",
          confirmButtonText: "Aceptar",
        })
      } else if (type === "editar" && initialData) {
        const noCambios =
          nombreActual === (initialData.nameSede || "").trim() &&
          direccionActual === (initialData.address || "").trim()

        if (noCambios) {
          onClose()
          return
        }

        await updateSede(initialData.sede_id, nombreActual, direccionActual)
        Swal.fire({
          icon: "success",
          title: "¡Sede actualizada!",
          text: `La sede "${nombreActual}" ha sido actualizada exitosamente.`,
          confirmButtonColor: "#10b981",
          confirmButtonText: "Aceptar",
        })
      }

      await reloadSedes() // Recarga las sedes para actualizar el selector

      onSuccess()
      setSedeNombre("")
      setSedeDireccion("")
      onClose()
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: type === "crear" ? "Error al crear sede" : "Error al actualizar sede",
        text: error.message,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Aceptar",
      })
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
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {type === "crear" ? "Crear Nueva Sede" : "Editar Sede"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {type === "crear" ? "Registra una nueva sede en el sistema" : "Actualiza la información de la sede"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                🏢 Nombre de la Sede
              </label>
              <input
                type="text"
                value={sedeNombre}
                onChange={(e) => setSedeNombre(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="Ingrese el nombre de la sede"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📍 Dirección</label>
              <input
                type="text"
                value={sedeDireccion}
                onChange={(e) => setSedeDireccion(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="Ingrese la dirección completa"
                required
              />
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
              className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700
                         text-white font-medium rounded-md transition-all duration-200 transform text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Cargando...
                </div>
              ) : type === "crear" ? (
                "Crear"
              ) : (
                "Actualizar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateHeadquartersModal
