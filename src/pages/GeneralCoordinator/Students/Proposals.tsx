import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getPropuesta } from '../../../ts/General/GetProposal';
import { aprobarPropuesta } from '../../../ts/Administrator/ApproveProposal';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from "sweetalert2"
import TourProposals from '../../../components/Tours/Administrator/TourProposals';

// Define TypeScript interfaces for the expected data structure
interface Proposal {
  id: number
  titulo: string
}

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

  // State management using React's useState hook
  const [proposals] = useState<Proposal[]>([
    { id: 1, titulo: "Propuesta 1" },
    { id: 2, titulo: "Propuesta 2" },
    { id: 3, titulo: "Propuesta 3" },
  ])
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null) // Selected proposal ID
  const [approvedProposal, setApprovedProposal] = useState<number | null>(null) // Approved proposal ID
  const [pdfUrl, setPdfUrl] = useState<string | null>(null) // URL for the proposal PDF
  const [noProposals, setNoProposals] = useState<boolean>(false) // Flag for no proposals uploaded
  const [thesisSubmissionsId, setThesisSubmissionsId] = useState<number | null>(null) // Thesis submission ID

  /**
   * Fetches proposal data from the server
   */
  const fetchProposal = async (user_id: number) => {
    try {
      // Call to get the proposal data based on the student ID
      const proposalData = await getPropuesta(user_id)

      // If proposal data is returned, update the state
      if (proposalData) {
        setPdfUrl(proposalData.file_path) // Set PDF URL
        setThesisSubmissionsId(proposalData.thesisSubmissions_id) // Set thesis submission ID

        // If proposal is not approved, reset the approval state
        if (proposalData.approved_proposal === 0) {
          setApprovedProposal(null)
        } else {
          // If proposal is approved, update the state with the proposal ID
          setApprovedProposal(proposalData.approved_proposal)
          setSelectedProposal(proposalData.approved_proposal)
        }
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

  /**
   * Handles proposal selection
   */
  const handleSelectProposal = (id: number) => {
    // Allow selection only if the proposal is not approved
    if (approvedProposal === null) {
      setSelectedProposal(id)
    }
  }

  /**
   * Handles approval of the selected proposal
   */
  const handleApproveProposal = async () => {
    // Ensure selected proposal and thesis submission ID are not null
    if (selectedProposal !== null && thesisSubmissionsId !== null && userId !== null) {
      const approvedProposalValue = selectedProposal // Store selected proposal ID for approval

      try {
        // Call API to approve the proposal
        await aprobarPropuesta(thesisSubmissionsId, userId, approvedProposalValue)

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Propuesta Aprobada",
          text: `La propuesta ${selectedProposal} ha sido aprobada correctamente.`,
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-green-600 text-white",
          },
        })

        // Update state after successful approval
        setApprovedProposal(selectedProposal)
        setSelectedProposal(null) // Reset selected proposal after approval
      } catch (error: any) {
        // Show error message if approval fails
        Swal.fire({
          icon: "error",
          title: "Error al aprobar la propuesta",
          text: error?.response?.data?.message || "No se pudo aprobar la propuesta.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-600 text-white",
          },
        })
      }
    }
  }

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
            {/* Section to select a proposal */}
            <div id="select-proposal">
              {" "}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Seleccione una Propuesta</h3>
              <div className="space-y-3">
                {/* Render each proposal */}
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition ${approvedProposal === proposal.id
                      ? "bg-green-500 text-white" // Highlight approved proposal
                      : selectedProposal === proposal.id
                        ? "bg-blue-500 text-white" // Highlight selected proposal
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    onClick={() => handleSelectProposal(proposal.id)}
                  >
                    {/* Radio button to select proposal */}
                    <input
                      type="radio"
                      checked={selectedProposal === proposal.id}
                      onChange={() => handleSelectProposal(proposal.id)}
                      className="mr-2 cursor-pointer"
                      disabled={approvedProposal !== null} // Disable selection if proposal is already approved
                    />
                    <label className="cursor-pointer">{proposal.titulo}</label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                {/* Button to approve proposal */}
                <button
                  id="approve-button"
                  className={`w-full px-4 py-3 rounded-md text-white transition ${selectedProposal === null || [1, 2, 3].includes(approvedProposal ?? 0)
                    ? "bg-gray-400 cursor-not-allowed" // Disable button when no proposal is selected or proposal is approved
                    : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  onClick={handleApproveProposal}
                  disabled={selectedProposal === null || [1, 2, 3].includes(approvedProposal ?? 0)}
                >
                  Aprobar Propuesta
                </button>
              </div>
            </div>

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
