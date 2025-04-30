import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getTimeLineEstudiante } from "../../../ts/General/GetTimeLineStudent"
import type React from "react"
import TourTimeLine from '../../../components/Tours/Administrator/TourTimeLine';
import Swal from "sweetalert2"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import generaPDFIndividual from "../../../components/Pdfs/generatesIndividualPDF"

// Defining the structure of a single event in the timeline
interface TimeLineEvent {
  user_id: number
  typeEvent: string
  description: string
  task_id: number
  date: string
}

const TimeLine: React.FC = () => {
  // Retrieving current location and navigation from React Router
  const location = useLocation()
  const navigate = useNavigate()

  // Setting state for pagination, events, and loading indicator
  const [events, setEvents] = useState<TimeLineEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Extracting student data and selected year/course from the location state
  const { estudiante, selectedAño, selectedCurso } = location.state || {}
  const studentName = estudiante ? estudiante.userName : "Desconocido"
  const userId = estudiante ? estudiante.id : null

  /**
   * Fetches the timeline events when the component mounts or userId changes
   */
  useEffect(() => {
    // If no valid userId is provided, display an error alert
    if (!userId) {
      showAlert("error", "¡Error!", "No se proporcionó un user_id válido.")
      setLoading(false)
      return
    }

    // Function to fetch the timeline events
    const fetchTimeline = async () => {
      try {
        setLoading(true)
        // Fetching events for the student based on userId
        const logs = await getTimeLineEstudiante(userId)
        // Sorting events by date in descending order and formatting the date
        setEvents(
          logs
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Descending order
            .map((log) => ({
              user_id: log.user_id,
              typeEvent: log.typeEvent,
              description: log.description,
              task_id: log.task_id,
              date: new Date(log.date).toLocaleDateString(),
            })),
        )
      } catch (err: any) {
        // Handling errors if needed
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [userId])

  /**
   * Function to show SweetAlert messages
   */
  const showAlert = (type: "success" | "error", title: string, text: string) => {
    const confirmButtonColor = type === "success" ? "#28a745" : "#dc3545"
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor,
      confirmButtonText: "OK",
    })
  }

  /**
   * Function to handle PDF generation when the "Print Report" button is clicked
   */
  const handlePrintPDF = () => {
    if (estudiante && selectedAño) {
      generaPDFIndividual(estudiante, selectedAño, selectedCurso) // Call the function that generates the PDF
    }
  }

  /**
   * Responsive design: adjust container styles on window resize
   */
  useEffect(() => {
    const handleResize = () => {
      // We can add specific responsive adjustments here if needed
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Loading state: if still loading, display loading text
  if (loading) {
    return <div>Cargando línea de tiempo...</div>
  }

  return (
    <>
      <Breadcrumb pageName="TimeLine" />
      <div className="mb-4 flex items-center justify-between sm:justify-start gap-4">
        {/* Back button */}
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>

        {/* Help tour button */}
        <TourTimeLine />
      </div>

      <div className="mx-auto max-w-6xl px-6 -my-3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">Línea de Tiempo - {studentName}</h2>
          <div className="flex gap-4">
            <button
              id="print-report"
              onClick={handlePrintPDF}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
            >
              Imprimir Reporte
            </button>
            <button
              id="view-tasks"
              onClick={() => {
                navigate("/administrador/tareas-estudiante", {
                  state: { estudiante, selectedAño },
                })
              }}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
            >
              Ver Tareas
            </button>
          </div>
        </div>

        <div id="timeline" className="mt-8 overflow-x-auto pb-4">
          {events.length > 0 ? (
            <ol className="flex items-center min-w-max" style={{ paddingRight: "2rem" }}>
              {events.map((event, index) => (
                <li
                  key={index}
                  className="relative flex-shrink-0 flex flex-col justify-start"
                  style={{ minWidth: "280px", maxWidth: "350px", minHeight: "180px" }}
                >
                  <div className="flex items-start">
                    <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0 mt-2">
                      <svg
                        className="w-4 h-4 text-blue-800 dark:text-blue-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    {index < events.length - 1 && (
                      <div
                        className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700 mt-6 ml-2"
                        style={{ minWidth: "50px" }}
                      ></div>
                    )}
                  </div>
                  <div className="mt-4 pr-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.typeEvent}</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {event.date}
                    </time>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">{event.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <table className="min-w-full">
              <tbody>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                    No Se Encontraron Eventos En Este Estudiante.
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div></div>
      </div>
    </>
  )
}

export default TimeLine
