import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getTareas } from "../../ts/General/GetTasks"
import { getTareasEstudiante } from "../../ts/Students/GetTasksStudent"
import { entregarTarea } from "../../ts/Students/DeliverTask"
import { Calendar, Clock, ArrowLeft, ArrowRight, MessageSquare, CheckCircle, XCircle, ChevronLeft } from "lucide-react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import Swal from "sweetalert2"
import type React from "react"

const InfoCurso: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { courseTitle, courseId } = location.state || {}

  const [tareas, setTareas] = useState<any[]>([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTareas = async () => {
      setLoading(true)
      try {
        const perfil = await getDatosPerfil()
        const currentYear = new Date().getFullYear()

        const tareasGenerales = await getTareas(perfil.sede, courseId, currentYear)
        const tareasEstudiante = await getTareasEstudiante(perfil.user_id, currentYear, perfil.sede)

        const tareasCombinadas = tareasGenerales
          .map((tarea) => {
            const tareaEstudiante = tareasEstudiante.find((t) => t.task_id === tarea.task_id)
            return {
              ...tarea,
              submission_complete: tareaEstudiante?.submission_complete ?? false,
            }
          })
          .filter((tarea) => tarea.typeTask_id !== 1)

        // Ordenar tareas: primero las no entregadas
        const tareasOrdenadas = tareasCombinadas.sort((a, b) => Number(a.submission_complete) - Number(b.submission_complete))

        setTareas(tareasOrdenadas)
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar las tareas",
          text: "Ocurrió un error al obtener las tareas. Intente nuevamente.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-600 text-white",
          },
        })
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchTareas()
    }
  }, [courseId])

  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "Aviso",
      text: "En este apartado, únicamente se debe confirmar la entrega de la tarea, sin que sea necesario cargar ningún archivo.",
      confirmButtonText: "DE ACUERDO",
      customClass: {
        confirmButton: "bg-red-600 text-white",
      },
    });
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getUTCDate().toString().padStart(2, "0")}/${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getUTCFullYear()}`
  }

  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number)
    const amPm = hours < 12 ? "AM" : "PM"
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${amPm}`
  }

  const handleNavigateToCapitulo = (
    task_id: number,
    submissionComplete: boolean,
    NameCapitulo: string,
    endTask: string,
    endTime: string | undefined,
  ) => {
    if (!submissionComplete) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No puedes acceder al capítulo porque la tarea no está entregada.",
        confirmButtonText: "Entendido",
        customClass: {
          confirmButton: "bg-red-600 text-white",
        },
      })
      return
    }
    navigate("/estudiantes/info-capitulo", {
      state: { task_id, endTask, endTime, NameCapitulo },
    })
  }

  const handleEntregarTarea = async (task_id: number) => {
    try {
      const perfil = await getDatosPerfil()
      const taskData = { user_id: perfil.user_id, task_id }
      const tareaEntregada = tareas.find((tarea) => tarea.task_id === task_id)

      if (tareaEntregada) {
        await entregarTarea(taskData)

        Swal.fire({
          icon: "success",
          title: "Tarea entregada",
          text: `Tarea "${tareaEntregada.title}" entregada correctamente.`,
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-green-600 text-white",
          },
        })

        setTareas((prevTareas) =>
          prevTareas.map((tarea) => (tarea.task_id === task_id ? { ...tarea, submission_complete: true } : tarea)),
        )
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al entregar tarea",
        text: error.message || "Ocurrió un error al intentar entregar la tarea.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-600 text-white",
        },
      })
    }
  }

  const isButtonDisabled = (endTask: string, endTime: string | undefined): boolean => {
    const currentDate = new Date()
    const endDate = new Date(endTask)
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    const currentHour = currentDate.getHours()
    const currentMinutes = currentDate.getMinutes()
    const currentSeconds = currentDate.getSeconds()

    const formattedCurrentTime = `${currentHour.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}:${currentSeconds.toString().padStart(2, "0")}`
    const formattedCurrentDateTime = `${currentDateOnly.toISOString().split("T")[0]} ${formattedCurrentTime}`

    const endDateOnly = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()))
    const formattedEndDateTime = `${endDateOnly.toISOString().split("T")[0]} ${endTime || ""}`

    if (isNaN(endDateOnly.getTime())) return true
    return formattedCurrentDateTime > formattedEndDateTime
  }

  const handleNextTask = () => {
    setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tareas.length)
  }

  const handlePreviousTask = () => {
    setCurrentTaskIndex((prevIndex) => (prevIndex - 1 + tareas.length) % tareas.length)
  }

  const currentTarea = tareas[currentTaskIndex]

  return (
    <>
      <Breadcrumb pageName={courseTitle} />

      <div className="mb-6">
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Regresar
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {tareas.length > 0 ? `${tareas.length} tareas disponibles` : "No hay tareas disponibles"}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : tareas.length > 0 ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Tarea {currentTaskIndex + 1} de {tareas.length}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousTask}
                    disabled={currentTaskIndex === 0}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 disabled:opacity-50 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Tarea anterior"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={handleNextTask}
                    disabled={currentTaskIndex === tareas.length - 1}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 disabled:opacity-50 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Tarea siguiente"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {currentTarea.title}
                      {currentTarea.submission_complete && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" /> Entregada
                        </span>
                      )}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">{currentTarea.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de inicio</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(currentTarea.taskStart)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hora de inicio</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime24Hour(currentTarea.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha límite</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(currentTarea.endTask)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hora límite</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime24Hour(currentTarea.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      onClick={() => handleEntregarTarea(currentTarea.task_id)}
                      disabled={
                        currentTarea.submission_complete || isButtonDisabled(currentTarea.endTask, currentTarea.endTime)
                      }
                      className={`px-4 py-2.5 rounded-lg font-medium text-white flex items-center justify-center ${currentTarea.submission_complete || isButtonDisabled(currentTarea.endTask, currentTarea.endTime)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 transition-colors"
                        }`}
                    >
                      {currentTarea.submission_complete ? (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" /> Entregada
                        </>
                      ) : isButtonDisabled(currentTarea.endTask, currentTarea.endTime) ? (
                        <>
                          <XCircle className="mr-2 h-5 w-5" /> Fuera de plazo
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" /> Entregar tarea
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleNavigateToCapitulo(
                          currentTarea.task_id,
                          currentTarea.submission_complete ?? false,
                          currentTarea.title,
                          currentTarea.endTask,
                          currentTarea.endTime,
                        )
                      }
                      disabled={!currentTarea.submission_complete}
                      className={`px-4 py-2.5 rounded-lg font-medium flex items-center justify-center ${!currentTarea.submission_complete
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        }`}
                    >
                      <MessageSquare className="mr-2 h-5 w-5" /> Comentarios
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentTarea.submission_complete
                    ? "Esta tarea ya ha sido entregada."
                    : isButtonDisabled(currentTarea.endTask, currentTarea.endTime)
                      ? "El plazo de entrega ha finalizado."
                      : "Entrega la tarea antes de la fecha límite."}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousTask}
                    disabled={currentTaskIndex === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md disabled:opacity-50 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextTask}
                    disabled={currentTaskIndex === tareas.length - 1}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:opacity-50 transition-colors hover:bg-blue-700"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                <XCircle className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">No hay tareas disponibles</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                No se encontraron tareas para este curso. Vuelve más tarde o contacta con tu profesor.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default InfoCurso

