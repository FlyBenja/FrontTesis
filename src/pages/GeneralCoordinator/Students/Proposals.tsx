import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getPropuesta } from '../../../ts/General/GetProposal';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from "sweetalert2"
import TourProposals from '../../../components/Tours/Administrator/TourProposals';

interface LocationState {
  tarea: string
  estudiante: { id: number; userName: string }
  selectedAño: number
}

const Proposals: React.FC = () => {
  const navigate = useNavigate() // Hook to handle navigation
  const location = useLocation() // Hook to get the current location (for accessing route state)
  const { estudiante } = location.state as LocationState // Retrieve student data from location state
  const userId = estudiante ? estudiante.id : null // Get the student's ID

  const [pdfUrl, setPdfUrl] = useState<string | null>(null) // URL for the proposal PDF
  const [noProposals, setNoProposals] = useState<boolean>(false) // Flag for no proposals uploaded


  /**
   * Fetches proposal data from the server
   */
  const fetchProposal = async (user_id: number) => {
    try {
      // Call to get the proposal data based on the student ID
      const proposalData = await getPropuesta(user_id)

      // If proposal data is returned, update the state
      if (proposalData) {
        setPdfUrl(proposalData.file_path)
      } else {
        // If no proposal is found, update state to indicate this
        setNoProposals(true)
      }
    } catch (error) {
      // Show error if proposal fetching fails
      Swal.fire({
        icon: "error",
        title: "Error al obtener la propuesta",
        text: "No se pudo cargar la propuesta.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-600 text-white",
        },
      })
    }
  }

  // useEffect hook to fetch proposal data when the component mounts
  useEffect(() => {
    if (userId) {
      fetchProposal(userId) // Call fetchProposal function if student ID is available
    } else {
      // Show error if student ID is not available
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener el ID del estudiante.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-600 text-white",
        },
      })
    }
  }, [userId])

  return (
    <>
      <Breadcrumb pageName="Propuestas del Estudiante" /> {/* Breadcrumb component for navigation */}
      <div className="mb-4 flex items-center justify-between sm:justify-start gap-4">
        {/* Back button */}
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>

        {/* Help tour button (only if there is a proposal submission) */}
        {pdfUrl && <TourProposals />}
      </div>
      <div className="mx-auto max-w-5xl px-4 py-4">
        {/* Display message if no proposals are found */}
        {noProposals ? (
          <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6 flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-white text-center">
              Estudiante No Ha Subido Sus Propuestas
            </p>
          </div>
        ) : (
          <>

            {/* Section to display PDF if available */}
            {pdfUrl && (
              <div id="pdf-viewer">
                {" "}
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                  Visualización de Documento PDF
                </h3>
                <iframe src={pdfUrl} title="Vista PDF" className="w-full h-[600px] rounded-md shadow-sm"></iframe>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Proposals
