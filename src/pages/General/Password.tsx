import { useState } from "react"
import { updatePassword } from "../../ts/General/UpdatePassword"
import { useNavigate } from "react-router-dom"
import type React from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

const MySwal = withReactContent(Swal)

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setLoading(false)
      MySwal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Por favor, asegúrate de que la nueva contraseña y la confirmación sean idénticas.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    try {
      await updatePassword(currentPassword, newPassword)
      MySwal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Contraseña cambiada exitosamente.",
        confirmButtonColor: "#10b981",
      }).then(() => {
        setLoading(false)
        localStorage.clear()
        window.location.reload()
        navigate("/")
      })
    } catch (error: any) {
      setLoading(false)
      MySwal.fire({
        icon: "error",
        title: "Error al cambiar la contraseña",
        text: error.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  return (
    <>
      <Breadcrumb pageName="Contraseña" />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Cambiar Contraseña</h3>
                <p className="text-blue-100 text-sm">Actualiza tu contraseña de acceso</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔐 Contraseña Actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  🆕 Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ✅ Repetir Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                             text-white font-medium rounded-xl transition-all duration-200 transform
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                             shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Guardando...
                    </div>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Password
