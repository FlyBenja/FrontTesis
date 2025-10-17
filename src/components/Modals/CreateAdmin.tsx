import type React from "react"
import { useState, useEffect } from "react"
import { createAdmin } from "../../ts/HeadquartersCoordinator/CreateAdmin"
import Swal from "sweetalert2"

interface CreateAdminModalProps {
  isOpen: boolean
  onClose: () => void
  onAdminCreated: () => Promise<void>
  sedeId: number
}

const CreateAdmin: React.FC<CreateAdminModalProps> = ({ isOpen, onClose, onAdminCreated, sedeId }) => {
  const [adminUserName, setAdminUserName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminCarnet, setAdminCarnet] = useState("")
  const [loading, setLoading] = useState(false)

  // Limpiar campos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setAdminUserName("")
      setAdminEmail("")
      setAdminCarnet("")
      setLoading(false)
    }
  }, [isOpen])

  // Función para limpiar todos los campos
  const clearFields = () => {
    setAdminUserName("")
    setAdminEmail("")
    setAdminCarnet("")
    setLoading(false)
  }

  // Función para cerrar modal y limpiar campos
  const handleClose = () => {
    clearFields()
    onClose()
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!adminUserName || !adminEmail || !adminCarnet) {
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
      await createAdmin({
        email: adminEmail,
        name: adminUserName,
        carnet: adminCarnet,
        sede_id: sedeId,
      })

      Swal.fire({
        icon: "success",
        title: "¡Administrador creado!",
        text: `El administrador ${adminUserName} ha sido creado exitosamente.`,
        confirmButtonColor: "#10b981",
        confirmButtonText: "De Acuerdo",
      })

      await onAdminCreated()
      clearFields()
      onClose()
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al crear administrador",
        text: error.message || "Error desconocido",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "De Acuerdo",
      })
      clearFields() // Limpiar campos también después de error
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Crear Administrador</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Registra un nuevo administrador del sistema</p>
        </div>

        <form onSubmit={handleCreateAdmin}>
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="ejemplo@miumg.edu.gt"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🎫 Código</label>
              <input
                type="text"
                value={adminCarnet}
                onChange={(e) => setAdminCarnet(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="Ingresa el código"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              👤 Nombre Completo
            </label>
            <input
              type="text"
              value={adminUserName}
              onChange={(e) => setAdminUserName(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-600
                         transition-all duration-200 outline-none"
              placeholder="Ingresa el nombre completo"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-gray-700 dark:text-gray-300 font-medium rounded-md transition-all duration-200 text-sm
                         border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
            >
              Cancelar
            </button>
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
                  Cargando...
                </div>
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAdmin
