import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaEnvelope, FaArrowLeft } from "react-icons/fa"
import { recuperaContraCorreo } from "../../ts/General/RecoverAgainstMail"
import type React from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import umgLogo from "../../images/Login/logo3.png"
import ofiLogo from "../../images/Login/sistemas1_11zon.png"

const MySwal = withReactContent(Swal)

const RecoverPassword: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@miumg\.edu\.gt$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      MySwal.fire({
        icon: "error",
        title: "Correo no válido",
        text: "Por favor, ingresa un correo electrónico válido con el dominio @miumg.edu.gt",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setLoading(true)
    try {
      const successMessage = await recuperaContraCorreo(email)
      setLoading(false)
      MySwal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        text: successMessage,
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate(-1)
      })
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        (error.response && error.response.data?.message) ||
        "Ocurrió un error inesperado al intentar recuperar la contraseña."
      setLoading(false)
      MySwal.fire({
        icon: "error",
        title: "Error al recuperar contraseña",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${ofiLogo})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 
                       hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Regresar
          </button>

          {/* Header */}
          <div className="text-center mb-8 mt-8">
            <div className="inline-block p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mb-4">
              <img src={umgLogo || "/placeholder.svg"} alt="UMG Logo" className="w-20 h-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Al enviar el correo electrónico se enviará una nueva contraseña temporal a tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                📧 Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white dark:focus:bg-gray-600
                             transition-all duration-200 outline-none"
                  placeholder="tu.correo@miumg.edu.gt"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <FaEnvelope className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700
                         text-white font-medium rounded-xl transition-all duration-200 transform text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                "📤 Enviar Contraseña"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RecoverPassword
