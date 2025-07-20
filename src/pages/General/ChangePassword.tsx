import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaLock } from "react-icons/fa"
import { updatePassword } from "../../ts/General/UpdatePassword.ts"
import { FaArrowLeft } from "react-icons/fa"
import type React from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import umgLogo from "../../images/Login/logo3.png"
import ofiLogo from "../../images/Login/sistemas1_11zon.png"

const MySwal = withReactContent(Swal)

const ChangePassword: React.FC = () => {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (newPassword.length < 4) {
      setLoading(false)
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "La nueva contraseña debe tener al menos 4 caracteres.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    const token = getAuthToken()
    if (!token) {
      setLoading(false)
      MySwal.fire({
        icon: "error",
        title: "Autenticación requerida",
        text: "No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    try {
      const response: any = await updatePassword(oldPassword, newPassword)
      const successMessage = response?.message || "Contraseña cambiada exitosamente."

      localStorage.clear()
      setLoading(false)
      MySwal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: successMessage,
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/")
      })
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        (error.response && error.response.data?.message) ||
        "Ocurrió un error inesperado al intentar cambiar la contraseña."
      setLoading(false)
      MySwal.fire({
        icon: "error",
        title: "Error al cambiar la contraseña",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      })
    }
  }

  if (window.history && window.history.pushState) {
    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", () => {
      navigate("/")
    })
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${ofiLogo})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 
                                     hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
            >
              <FaArrowLeft className="w-4 h-4" />
              Regresar
            </button>
            <div className="inline-block p-2 rounded-2xl mb-4">
              <img src={umgLogo || "/placeholder.svg"} alt="UMG Logo" className="w-48 h-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Cambiar Contraseña</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Actualiza tu contraseña de acceso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                🔐 Contraseña Actual
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <FaLock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                🆕 Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <FaLock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ✅ Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <FaLock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700
                         text-white font-medium rounded-xl transition-all duration-200 transform text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Cambiando contraseña...
                </div>
              ) : (
                "🔄 Cambiar Contraseña"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
