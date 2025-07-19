import React, { useState } from "react"
import Swal from "sweetalert2"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { getDatosPerfil } from "../../ts/General/GetProfileData" // Make sure to import correctly
import { enviaRevision } from "../../ts/Administrator/SubmitReview" // Make sure to import correctly
import ModalCreateUserSinLogin from "../../components/Modals/CreateUserWithoutLogin"
import { User, FileText, CheckCircle, Loader2, UploadCloud } from "lucide-react"

/**
 * Component for submitting thesis reviews
 * Allows users to upload thesis documents and approval letters
 */
const SubmitReview: React.FC = () => {
  // State for form data
  const [studentId, setStudentId] = useState<string>("")
  const [approvedThesis, setApprovedThesis] = useState<File | null>(null)
  const [approvalLetter, setApprovalLetter] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [campusId, setCampusId] = useState<number | null>(null) // State to store the campus_id
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  /**
   * Handles changes to the student ID input
   */
  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value)
  }

  /**
   * Handles changes to the thesis file input
   */
  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setApprovedThesis(e.target.files[0])
    }
  }

  /**
   * Handles changes to the approval letter file input
   */
  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setApprovalLetter(e.target.files[0])
    }
  }

  /**
   * Fetches profile data to get the campus ID
   */
  const fetchCampusId = async () => {
    try {
      const profileData = await getDatosPerfil()
      setCampusId(profileData.sede) // Sets the campus_id from the API
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al obtener los datos del perfil.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-600 text-white", // Sets the button to red with white text
        },
      })
    }
  }

  /**
   * Handles form submission
   * Validates inputs and submits the review
   */
  const handleSubmit = async () => {
    if (!studentId || !approvedThesis || !approvalLetter || campusId === null) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-600 text-white", // Sets the button to red with white text
        },
      })
      return
    }

    setLoading(true) // Starts the loading indicator

    try {
      // Calls the API to submit the review
      await enviaRevision({
        carnet: studentId,
        sede_id: campusId, // Sends the retrieved campus_id
        approval_letter: approvalLetter, // Sends the approval letter file
        thesis: approvedThesis, // Sends the thesis file
      })
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "La revisión ha sido enviada correctamente.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-green-600 text-white", // Sets the button to green with white text
        },
      })
    } catch (error: any) {
      // Shows the error message from the API
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un error al enviar la revisión. Inténtalo nuevamente.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-600 text-white", // Sets the button to red with white text
        },
      })
    } finally {
      setLoading(false) // Stops the loading indicator
    }
  }

  // Calls the fetchCampusId function when the component mounts
  React.useEffect(() => {
    fetchCampusId()
  }, [])

  return (
    <>
      <Breadcrumb pageName="Enviar Tesis a Revisión" />
      <div className="mx-auto max-w-4xl px-6 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="relative mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Formulario de Revisión</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Crear Usuario
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="studentId" className="block text-lg font-semibold text-gray-700 dark:text-white mb-2">
            <User className="inline-block h-5 w-5 mr-2 text-blue-500" /> Carnet del Estudiante
          </label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={handleStudentIdChange}
            className="w-full px-4 py-3 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 text-base"
            placeholder="Ingresa el carnet del estudiante"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Archivos Solicitados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="w-full">
            <label htmlFor="file1" className="block text-lg font-semibold text-gray-700 dark:text-white mb-2">
              <FileText className="inline-block h-5 w-5 mr-2 text-green-500" /> Tesis Aprobada
            </label>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-all duration-300">
              <input
                type="file"
                id="file1"
                onChange={handleFile1Change}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center">
                {approvedThesis ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{approvedThesis.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Archivo seleccionado</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-12 w-12 text-blue-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Arrastra y suelta tu tesis aquí
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">o haz clic para seleccionar</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="file2" className="block text-lg font-semibold text-gray-700 dark:text-white mb-2">
              <FileText className="inline-block h-5 w-5 mr-2 text-purple-500" /> Carta de Aprobación
            </label>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-all duration-300">
              <input
                type="file"
                id="file2"
                onChange={handleFile2Change}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center">
                {approvalLetter ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{approvalLetter.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Archivo seleccionado</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-12 w-12 text-blue-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Arrastra y suelta tu carta aquí
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">o haz clic para seleccionar</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading || !studentId || !approvedThesis || !approvalLetter || campusId === null}
            className={`px-8 py-3 w-full flex justify-center items-center rounded-lg bg-gradient-to-br from-green-500 to-teal-600 font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${loading || !studentId || !approvedThesis || !approvalLetter || campusId === null
                ? "opacity-50 cursor-not-allowed"
                : ""
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-3" /> Enviando...
              </>
            ) : (
              "Enviar Revisión"
            )}
          </button>
        </div>
      </div>
      {isModalOpen && <ModalCreateUserSinLogin onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default SubmitReview
