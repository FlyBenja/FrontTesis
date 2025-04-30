import React, { useState } from "react"
import Swal from "sweetalert2"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { getDatosPerfil } from "../../ts/General/GetProfileData" // Make sure to import correctly
import { enviaRevision } from "../../ts/Administrator/SubmitReview" // Make sure to import correctly
import ModalCreateUserSinLogin from "../../components/Modals/CreateUserWithoutLogin"

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
      <div className="mx-auto max-w-4xl px-6 py-8 bg-white rounded-xl shadow-md">
        <div className="relative mb-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Formulario</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute right-0 top-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Crear Usuario
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 dark:text-white">
            Carnet
          </label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={handleStudentIdChange}
            className="w-full px-4 py-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-boxdark dark:border-strokedark dark:text-white"
            placeholder="Ingresa el carnet"
          />
        </div>

        <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-4 text-center">
          Archivos Solicitados
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="w-full">
            <label htmlFor="file1" className="block text-sm font-semibold text-gray-700 dark:text-white">
              Tesis Aprobada
            </label>
            <input
              type="file"
              id="file1"
              onChange={handleFile1Change}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>

          <div className="w-full">
            <label htmlFor="file2" className="block text-sm font-semibold text-gray-700 dark:text-white">
              Carta de Aprobación
            </label>
            <input
              type="file"
              id="file2"
              onChange={handleFile2Change}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 w-full sm:w-auto ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500`}
          >
            {loading ? "Enviando..." : "Enviar Revisión"}
          </button>
        </div>
      </div>
      {isModalOpen && <ModalCreateUserSinLogin onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default SubmitReview
