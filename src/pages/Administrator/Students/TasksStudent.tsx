import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import Swal from "sweetalert2"
import { getDatosPerfil } from "../../../ts/General/GetProfileData"
import { getTareasSede, type Tarea } from "../../../ts/General/GetTasksHeadquarters"
import { getTareasEstudiante, type TareaEstudiante } from "../../../ts/Students/GetTasksStudent"
import StudentTasksTour from "../../../components/Tours/Administrator/StudentTasksTour"

/**
 * Student Tasks Component
 * Displays tasks assigned to a specific student
 */
const TasksStudent: React.FC = () => {
  // React Router hooks to navigate and get the current location
  const navigate = useNavigate()
  const location = useLocation()

  // State hooks to store tasks data and student data
  const [tareas, setTareas] = useState<Tarea[]>([]) // Tasks for the current sede
  const [sedeId, setSedeId] = useState<number | null>(null) // Sede ID for the current session
  const [tareasEstudiante, setTareasEstudiante] = useState<TareaEstudiante[]>([]) // Tasks for the specific student

  // Destructuring student and year from location state
  const { estudiante, selectedAño } = location.state || {}

  /**
   * Fetch profile data to get the current sede ID
   */
  useEffect(() => {
    const fetchDatosPerfil = async () => {
      try {
        const { sede } = await getDatosPerfil() // Fetch the current sede
        setSedeId(sede) // Set the sede ID in state
      } catch (err) {}
    }

    fetchDatosPerfil()
  }, []) // This effect runs once when the component mounts

  /**
   * Fetch tasks for the specific sede and selected year
   */
  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null && selectedAño) {
        try {
          const tareasRecuperadas = await getTareasSede(sedeId, selectedAño) // Fetch tasks for the sede and year
          setTareas(tareasRecuperadas) // Set tasks in state
        } catch (err) {}
      }
    }

    fetchTareas()
  }, [sedeId, selectedAño]) // This effect runs when either sedeId or selectedAño changes

  /**
   * Fetch tasks specific to the student
   */
  useEffect(() => {
    const fetchTareasEstudiante = async () => {
      if (estudiante && selectedAño && sedeId !== null) {
        const tareasEst = await getTareasEstudiante(estudiante.id, selectedAño, sedeId) // Fetch tasks for the student
        setTareasEstudiante(tareasEst) // Set student tasks in state
      }
    }

    fetchTareasEstudiante()
  }, [estudiante, selectedAño, sedeId]) // This effect runs when student, year, or sedeId changes

  // Sort the tasks with typeTask_id of 1 first
  const tareasOrdenadas = tareas.sort((a, b) => {
    if (a.typeTask_id === 1 && b.typeTask_id !== 1) {
      return -1 // Place tasks with typeTask_id 1 before others
    }
    if (a.typeTask_id !== 1 && b.typeTask_id === 1) {
      return 1 // Place tasks with typeTask_id 1 before others
    }
    return 0 // Keep the order the same for tasks with the same typeTask_id
  })

  /**
   * Handle task navigation and validation before proceeding
   */
  const handleNavigate = (tarea: Tarea) => {
    // Find the student-specific task from tareasEstudiante
    const tareaEstudiante = tareasEstudiante.find((t) => t.task_id === tarea.task_id)

    // If task type is not 1, validate if it is submitted by the student
    if (tareaEstudiante && tarea.typeTask_id !== 1) {
      // If task is not submitted, show a warning and prevent navigation
      if (!tareaEstudiante.submission_complete) {
        Swal.fire({
          icon: "warning",
          title: "Aviso",
          text: "No puedes acceder al capítulo porque la tarea no ha sido entregada por el estudiante.",
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "bg-red-600 text-white",
          },
        })
        return
      }
    }

    // Navigate based on task type
    if (tarea.typeTask_id === 1) {
      navigate("/administrador/propuestas", {
        state: { tarea, estudiante, selectedAño },
      }) // Navigate to proposals if task type is 1
    } else {
      navigate("/administrador/capitulo", {
        state: { tarea, estudiante, selectedAño },
      }) // Navigate to chapter if task type is not 1
    }
  }

  /**
   * Format date to dd/mm/yyyy format
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getUTCDate().toString().padStart(2, "0")}/${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getUTCFullYear()}`
  }

  /**
   * Format time to 12-hour AM/PM format
   */
  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number)
    const amPm = hours < 12 ? "AM" : "PM"
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${amPm}`
  }

  return (
    <>
      <Breadcrumb pageName="Tareas del Estudiante" />

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
        <StudentTasksTour />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-4">

        {/* If no tasks are found, show a message */}
        {tareasOrdenadas.length === 0 ? (
          <table className="min-w-full table-auto">
            <tbody>
              <tr>
                <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                  No Se Encontrarón Tareas Creadas.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            {/* Display tasks with typeTask_id = 1 (Proposals) */}
            <div id="proposals-section">
              {" "}
              {/* Agrega este ID */}
              {tareasOrdenadas
                .filter((tarea) => tarea.typeTask_id === 1)
                .map((tarea) => (
                  <div
                    key={tarea.task_id}
                    className="mb-6 p-4 rounded-lg shadow-md cursor-pointer bg-blue-100 dark:bg-boxdark"
                    onClick={() => handleNavigate(tarea)}
                  >
                    <h3 className="text-lg font-bold text-black dark:text-white">{tarea.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tarea.description}</p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                      <p>
                        Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}
                      </p>
                      <p>
                        Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Display tasks with typeTask_id !== 1 (Chapters) */}
            <div id="chapters-section">
              {" "}
              {/* Agrega este ID */}
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Capítulos</h3>
              {tareasOrdenadas
                .filter((tarea) => tarea.typeTask_id !== 1)
                .map((tarea) => (
                  <div
                    key={tarea.task_id}
                    className="mb-6 p-4 rounded-lg shadow-md cursor-pointer bg-white dark:bg-boxdark"
                    onClick={() => handleNavigate(tarea)}
                  >
                    <h3 className="text-lg font-bold text-black dark:text-white">{tarea.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tarea.description}</p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                      <p>
                        Fecha/Hora de Inicio: {formatDate(tarea.taskStart)} - {formatTime24Hour(tarea.startTime)}
                      </p>
                      <p>
                        Fecha/Hora Final: {formatDate(tarea.endTask)} - {formatTime24Hour(tarea.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default TasksStudent
