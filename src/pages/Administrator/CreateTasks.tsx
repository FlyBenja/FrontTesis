import type React from "react"
import { useState, useEffect } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import CreaTarea from "../../components/Modals/CreateTask"
import { getCursos } from "../../ts/General/GetCourses"
import { getYears } from "../../ts/General/GetYears"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getTareas } from "../../ts/General/GetTasks"
import TourCreatesTasks from "../../components/Tours/Administrator/TourCreatesTasks"
import { CalendarDays, Book, PlusCircle, Edit, ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Define the type for a "Task" object
 */
export interface Task {
  task_id: number
  asigCourse_id: number
  typeTask_id: number
  title: string
  description: string
  taskStart: string
  endTask: string
  startTime: string
  endTime: string
  year_id: number
}

/**
 * Component for creating and managing tasks
 */
const CreateTasks: React.FC = () => {
  // State hooks for managing component data
  const [isModalOpen, setIsModalOpen] = useState(false) // Controls the modal visibility
  const [selectedCourse, setSelectedCourse] = useState("") // Stores selected course
  const [selectedYear, setSelectedYear] = useState("") // Stores selected year
  const [years, setYears] = useState<number[]>([]) // List of years
  const [courses, setCourses] = useState<any[]>([]) // List of courses
  const [tasks, setTasks] = useState<Task[]>([]) // List of tasks
  const [modalMode, setModalMode] = useState<"create" | "edit">("create") // Determines if modal is in "create" or "edit" mode
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null) // Stores selected task ID for editing
  const [currentPage, setCurrentPage] = useState(1) // Current page number for pagination
  const [tasksPerPage, setTasksPerPage] = useState(3) // Number of tasks per page
  const [maxPageButtons, setMaxPageButtons] = useState(5) // Maximum number of page buttons to display

  /**
   * Effect hook to fetch initial data for years and set the current year if available
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      const retrievedYears = await getYears() // Fetch available years
      setYears(retrievedYears.map((yearObj) => yearObj.year)) // Set years to state
      const currentYear = new Date().getFullYear() // Get current year
      if (retrievedYears.some((yearObj) => yearObj.year === currentYear)) {
        setSelectedYear(currentYear.toString()) // Set current year as selected year
      }
    }
    fetchInitialData() // Call the fetch function to load initial data
    const currentMonth = new Date().getMonth() + 1 // Get current month
    setSelectedCourse(currentMonth > 6 ? "2" : "1") // Set the selected course based on the current month
  }, [])

  /**
   * Effect hook to fetch courses when the selected year changes
   */
  useEffect(() => {
    const fetchCoursesAndUpdateTasks = async () => {
      if (selectedYear) {
        const profile = await getDatosPerfil() // Fetch user profile
        const retrievedCourses = await getCursos(profile.sede, Number(selectedYear)) // Fetch courses based on selected year and profile data
        setCourses(Array.isArray(retrievedCourses) ? retrievedCourses : []) // Set courses to state
        const currentMonth = new Date().getMonth() + 1 // Get current month
        setSelectedCourse(currentMonth > 6 ? "2" : "1") // Set selected course based on the current month
      }
    }
    fetchCoursesAndUpdateTasks() // Call the fetch function when selected year changes
  }, [selectedYear])

  /**
   * Effect hook to fetch tasks when the selected course or year changes
   */
  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedCourse && selectedYear) {
        const profile = await getDatosPerfil() // Fetch user profile
        const retrievedTasks = await getTareas(profile.sede, Number(selectedCourse), Number(selectedYear))
        // Sort tasks in descending order by task_id
        const sortedTasks = retrievedTasks.sort((a: Task, b: Task) => {
          return b.task_id - a.task_id // Sort in descending order
        })
        setTasks(Array.isArray(sortedTasks) ? sortedTasks : []) // Set tasks to state
      }
    }
    fetchTasks() // Call the fetch function when selected course or year changes
  }, [selectedCourse, selectedYear])

  /**
   * Handle closing the modal and fetching tasks again
   */
  const handleModalClose = () => {
    setIsModalOpen(false) // Close the modal
    const fetchTasks = async () => {
      if (selectedCourse && selectedYear) {
        const profile = await getDatosPerfil() // Fetch user profile
        const retrievedTasks = await getTareas(profile.sede, Number(selectedCourse), Number(selectedYear))
        // Sort tasks in descending order by task_id
        const sortedTasks = retrievedTasks.sort((a: Task, b: Task) => {
          return b.task_id - a.task_id // Sort in descending order
        })
        setTasks(Array.isArray(sortedTasks) ? sortedTasks : []) // Set tasks to state
      }
    }
    fetchTasks() // Call the fetch function when modal is closed
  }

  /**
   * Format time from 24-hour format to 12-hour format
   */
  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number) // Split time string into hours, minutes, and seconds
    const amPm = hours < 12 ? "AM" : "PM" // Determine AM or PM
    const formattedHours = hours % 12 || 12 // Convert to 12-hour format, 0 becomes 12
    return `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${amPm}` // Return formatted time
  }

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage // Index of the last task on the current page
  const currentTasks = tasks.slice(indexOfLastTask - tasksPerPage, indexOfLastTask) // Get tasks for the current page
  const totalPages = Math.ceil(tasks.length / tasksPerPage) // Calculate total number of pages

  /**
   * Function to change the current page
   */
  const paginate = (page: number) => {
    if (page < 1) page = 1 // Ensure page is not less than 1
    if (page > totalPages) page = totalPages // Ensure page is not greater than total pages
    setCurrentPage(page) // Update the current page
  }

  /**
   * Function to get the range of page numbers for pagination buttons
   */
  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)) // Calculate start page number
    const end = Math.min(totalPages, start + maxPageButtons - 1) // Calculate end page number
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1) // Adjust start page number if necessary
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i) // Return an array of page numbers
  }

  /**
   * Function to format a date string to a readable format
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr) // Create a Date object from the string
    return `${date.getUTCDate().toString().padStart(2, "0")}/${(date.getUTCMonth() + 1).toString().padStart(2, "0")}/${date.getUTCFullYear()}` // Return formatted date
  }

  /**
   * Effect hook to adjust the number of tasks per page and the number of page buttons based on window size
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTasksPerPage(8) // Set tasks per page to 8 for small screens
        setMaxPageButtons(5) // Set maximum page buttons to 5 for small screens
      } else {
        setTasksPerPage(5) // Set tasks per page to 5 for large screens
        setMaxPageButtons(10) // Set maximum page buttons to 10 for large screens
      }
    }
    handleResize() // Call the resize function on initial load
    window.addEventListener("resize", handleResize) // Add event listener for window resize
    return () => {
      window.removeEventListener("resize", handleResize) // Cleanup event listener on unmount
    }
  }, [])

  // Check if the selected year is the current year
  const isCurrentYear = selectedYear === new Date().getFullYear().toString()

  return (
    <>
      <Breadcrumb pageName="Crear Tareas" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header with Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 rounded-t-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Gestión de Tareas</h3>
                <p className="text-indigo-100 text-sm">Administra las tareas del sistema</p>
              </div>
            </div>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="year-select" className="block text-indigo-100 text-sm font-medium mb-2">
                  📅 Año Académico
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl text-sm bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:border-white/40 focus:ring-4 focus:ring-white/20 focus:bg-white/20 transition-all duration-200 outline-none"
                >
                  <option value="" className="text-gray-900">
                    Seleccionar año
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()} className="text-gray-900">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="curso-select" className="block text-indigo-100 text-sm font-medium mb-2">
                  📚 Curso
                </label>
                <select
                  id="curso-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-xl text-sm bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:border-white/40 focus:ring-4 focus:ring-white/20 focus:bg-white/20 transition-all duration-200 outline-none"
                >
                  <option value="" className="text-gray-900">
                    Seleccionar curso
                  </option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id.toString()} className="text-gray-900">
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-4">
                <button
                  id="crear-tarea-button"
                  onClick={() => {
                    setIsModalOpen(true)
                    setModalMode("create")
                  }}
                  className={`px-6 py-3 rounded-xl hover:bg-gradient-to-l transition duration-300 flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg ${
                    isCurrentYear
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                  disabled={!isCurrentYear}
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Nueva Tarea
                </button>
                {/* Button to start the tour */}
                <TourCreatesTasks />
              </div>
            </div>
          </div>
          {/* Tasks List */}
          <div className="p-8">
            {tasks.length > 0 ? (
              <div id="tareas-list" className="space-y-6">
                {currentTasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">#{task.task_id}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{task.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CalendarDays className="w-4 h-4" />
                            <span className="font-medium">
                              Inicio: {formatDate(task.taskStart)} - {formatTime24Hour(task.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <CalendarDays className="w-4 h-4" />
                            <span className="font-medium">
                              Final: {formatDate(task.endTask)} - {formatTime24Hour(task.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => {
                            setIsModalOpen(true)
                            setModalMode("edit")
                            setSelectedTaskId(task.task_id)
                          }}
                          className={`ml-4 px-3 py-2 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
                            isCurrentYear ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!isCurrentYear}
                        >
                          <Edit className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div id="pagination" className="flex justify-center mt-8 gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {getPageRange().map((page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                          currentPage === page
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay tareas disponibles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecciona un año y curso para ver las tareas disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && <CreaTarea onClose={handleModalClose} mode={modalMode} taskId={selectedTaskId} />}
    </>
  )
}

export default CreateTasks
