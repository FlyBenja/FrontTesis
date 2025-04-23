import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Swal from "sweetalert2"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import { getTimeLineEstudiante } from "../../../ts/Generales/GetTimeLineEstudiante"
import generaPDFIndividual from "../../../components/Pdfs/generaPDFIndividual"
import { driver } from "driver.js" // Importa driver.js
import "driver.js/dist/driver.css" // Importa los estilos de driver.js

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
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage, setEventsPerPage] = useState(3)
  const [maxPageButtons, setMaxPageButtons] = useState(10)
  const [events, setEvents] = useState<TimeLineEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Extracting student data and selected year/course from the location state
  const { estudiante, selectedAño, selectedCurso } = location.state || {}
  const studentName = estudiante ? estudiante.userName : "Desconocido"
  const userId = estudiante ? estudiante.id : null

  // Fetching the timeline events when the component mounts or userId changes
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
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Orden descendente
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

  // Function to show SweetAlert messages
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

  // Function to handle PDF generation when the "Imprimir Reporte" button is clicked
  const handlePrintPDF = () => {
    if (estudiante && selectedAño) {
      generaPDFIndividual(estudiante, selectedAño, selectedCurso) // Llamamos a la función que genera el PDF
    }
  }

  // Ya no necesitamos paginación, mostramos todos los eventos
  // const indexOfLastEvent = currentPage * eventsPerPage
  // const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  // const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent)
  // const totalPages = Math.ceil(events.length / eventsPerPage)

  // Pagination logic: calculate the indices of the current page's events
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(events.length / eventsPerPage)

  // Function to handle page change on pagination
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Function to determine the range of page buttons to display
  const getPageRange = () => {
    const range: number[] = []
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    for (let i = startPage; i <= endPage; i++) {
      range.push(i)
    }

    return range
  }

  // Responsive design: adjust container styles on window resize
  useEffect(() => {
    const handleResize = () => {
      // Podemos agregar ajustes responsivos específicos aquí si es necesario
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Responsive design: adjust the number of events per page and max page buttons on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEventsPerPage(4)
        setMaxPageButtons(5)
      } else {
        setEventsPerPage(10)
        setMaxPageButtons(10)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Función para iniciar el recorrido
  const startTour = () => {
    const driverObj = driver({
      showProgress: true, // Muestra la barra de progreso
      animate: true, // Habilita animaciones
      prevBtnText: "Anterior", // Texto del botón "Anterior"
      nextBtnText: "Siguiente", // Texto del botón "Siguiente"
      doneBtnText: "Finalizar", // Texto del botón "Finalizar"
      progressText: "Paso {{current}} de {{total}}", // Texto de la barra de progreso
    })

    driverObj.setSteps([
      {
        element: "#back-button", // ID del botón "Regresar"
        popover: {
          title: "Regresar",
          description: "Haz clic aquí para regresar a la lista de estudiantes.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#print-report", // ID del botón "Imprimir Reporte"
        popover: {
          title: "Imprimir Reporte",
          description: "Haz clic aquí para generar un reporte en PDF de la línea de tiempo del estudiante.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#view-tasks", // ID del botón "Ver Tareas"
        popover: {
          title: "Ver Tareas",
          description: "Haz clic aquí para ver las tareas asignadas a este estudiante.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#timeline", // ID de la línea de tiempo
        popover: {
          title: "Línea de Tiempo",
          description: "Aquí se muestran los eventos de la línea de tiempo del estudiante.",
          side: "top",
          align: "start",
        },
      },
    ])

    driverObj.drive() // Inicia el recorrido
  }

  // Loading state: if still loading, display loading text
  if (loading) {
    return <div>Cargando línea de tiempo...</div>
  }

  return (
    <>
      <Breadcrumb pageName="TimeLine" />
      <div className="mb-4 flex items-center justify-between sm:justify-start gap-4">
        {/* Botón de regresar */}
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>

        {/* Botón para iniciar el recorrido */}
        <button
          style={{ width: "35px", height: "35px" }}
          onClick={startTour}
          className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 group"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
            <g id="SVGRepo_iconCarrier">
              <path
                d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <circle cx="12" cy="17" r="1" fill="#ffffff"></circle>
            </g>
          </svg>

          <span className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Iniciar recorrido de ayuda
          </span>
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-6 -my-3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">Línea de Tiempo - {studentName}</h2>
          <div className="flex gap-4">
            <button
              id="print-report" // Agrega este ID
              onClick={handlePrintPDF}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
            >
              Imprimir Reporte
            </button>
            <button
              id="view-tasks" // Agrega este ID
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
          {currentEvents.length > 0 ? (
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

        {/* Paginación (solo se muestra si hay más de una página) */}
        {totalPages > 1 && (
          <div id="pagination" className="mt-4 flex justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
            >
              &#8592;
            </button>
            {getPageRange().map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`mx-1 px-3 py-1 rounded-md border ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default TimeLine
