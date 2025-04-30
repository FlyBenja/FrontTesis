import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaLock } from "react-icons/fa"
import { updatePassword } from "../../ts/General/UpdatePassword.ts"
import type React from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import umgLogo from "../../images/Login/logo3.png"
import ofiLogo from "../../images/Login/sistemas1_11zon.png"

// Initialize SweetAlert with React content
const MySwal = withReactContent(Swal)

/**
 * Component for changing user password
 */
const ChangePassword: React.FC = () => {
  // State variables to handle the form data and loading status
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState<string>("") // State for old password
  const [newPassword, setNewPassword] = useState<string>("") // State for new password
  const [confirmPassword, setConfirmPassword] = useState<string>("") // State for confirming new password
  const [loading, setLoading] = useState<boolean>(false) // State for loading status

  /**
   * Function to retrieve authentication token from localStorage
   */
  const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken")
  }

  /**
   * Handle form submission
   * Validates passwords and submits the change request
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission behavior
    setLoading(true) // Set loading to true while processing the form

    // Check if the new password and confirmation match
    if (newPassword !== confirmPassword) {
      setLoading(false) // Reset loading state
      MySwal.fire({
        icon: "error",
        title: "Contraseñas no coinciden", // Alert for mismatched passwords
        text: "Por favor, asegúrate de que la nueva contraseña y la confirmación sean idénticas.",
        confirmButtonColor: "#d33",
      })
      return
    }

    if (newPassword.length < 4) {
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "La nueva contraseña debe tener al menos 4 caracteres.",
        confirmButtonColor: "#d33",
      })
      return
    }

    // Retrieve auth token from localStorage
    const token = getAuthToken()
    if (!token) {
      setLoading(false) // Reset loading state
      MySwal.fire({
        icon: "error",
        title: "Autenticación requerida", // Alert for missing authentication token
        text: "No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.",
        confirmButtonColor: "#d33",
      })
      return
    }

    try {
      // Call the updatePassword function to change the password
      const response: any = await updatePassword(oldPassword, newPassword)
      const successMessage = response?.message || "Contraseña cambiada exitosamente." // Default success message

      // Clear localStorage and redirect to the home page
      localStorage.clear()
      setLoading(false) // Reset loading state
      MySwal.fire({
        icon: "success",
        title: "Contraseña actualizada", // Alert for successful password change
        text: successMessage,
        confirmButtonColor: "#28a745",
      }).then(() => {
        navigate("/") // Redirect to the homepage after success
      })
    } catch (error: any) {
      // Handle errors if the password change process fails
      const errorMessage =
        error?.message ||
        (error.response && error.response.data?.message) ||
        "Ocurrió un error inesperado al intentar cambiar la contraseña." // Default error message

      setLoading(false) // Reset loading state
      MySwal.fire({
        icon: "error",
        title: "Error al cambiar la contraseña", // Alert for error during password change
        text: errorMessage,
        confirmButtonColor: "#d33",
      })
    }
  }

  // Prevent going back to the previous page using the browser's back button
  if (window.history && window.history.pushState) {
    window.history.pushState(null, "", window.location.href) // Push the current URL to history
    window.addEventListener("popstate", () => {
      navigate("/") // Redirect to homepage if the user tries to go back
    })
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${ofiLogo})` }} // Background image for the page
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <img src={umgLogo || "/placeholder.svg"} alt="UMG Logo" className="w-24 mx-auto" /> {/* Logo for the page */}
          <h1 className="my-3 text-xl font-semibold text-gray-700">Cambia tu Contraseña</h1> {/* Page heading */}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Contraseña Actual {/* Label for old password field */}
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)} // Handle old password change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu contraseña actual" // Placeholder text
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock /> {/* Lock icon for password field */}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña {/* Label for new password field */}
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} // Handle new password change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nueva contraseña" // Placeholder text
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock /> {/* Lock icon for new password field */}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña {/* Label for confirm password field */}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Handle confirm password change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirmar nueva contraseña" // Placeholder text
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock /> {/* Lock icon for confirm password field */}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={loading} // Disable button if loading
          >
            {loading ? "Cargando..." : "Cambiar Contraseña"} {/* Button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
