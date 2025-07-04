import { useState, useEffect } from "react"
import { getYears } from "../../ts/General/GetYears"
import { getTareas } from "../../ts/General/GetTasks"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import TourCreatesTasks from "../../components/Tours/Administrator/TourCreatesTasks"

// Define the type for a "Task" object
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

const CreateTasks: React.FC = () => {
  // State hooks for managing component data
  const [selectedCourse, setSelectedCourse] = useState("") // Stores selected course
  const [selectedYear, setSelectedYear] = useState("") // Stores selected year
  const [years, setYears] = useState<number[]>([]) // List of years
  const [courses, setCourses] = useState<any[]>([]) // List of courses
  const [tasks, setTasks] = useState<Task[]>([]) // List of tasks

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
        // Set static courses
        setCourses([
          { course_id: 1, courseName: "Proyecto De Graduación I" },
          { course_id: 2, courseName: "Proyecto De Graduación II" },
        ])

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
        // Obtener la sede-id desde localStorage en lugar de la API
        const selectedSedeId = Number(localStorage.getItem("selectedSedeId"))
        const retrievedTasks = await getTareas(selectedSedeId, Number(selectedCourse), Number(selectedYear))

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
   * Format time from 24-hour format to 12-hour format
   */
  const formatTime24Hour = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number) // Split time string into hours, minutes, and seconds
    const amPm = hours < 12 ? "AM" : "PM" // Determine AM or PM
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${amPm}` // Return formatted time
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

  return (
    <>
      <Breadcrumb pageName="Crear Tareas" />
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-1 gap-3">
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white w-full md:w-2/4"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <select
            id="curso-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white w-full md:w-1/2"
          >
            <option value="">Seleccionar curso</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id.toString()}>
                {course.courseName}
              </option>
            ))}
          </select>

          {/* Help tour button */}
          <TourCreatesTasks />
        </div>

        {tasks.length > 0 ? (
          <div id="tareas-list" className="space-y-4">
            {currentTasks.map((task) => (
              <div key={task.task_id} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
                <div>
                  <h4 className="text-lg font-semibold text-black dark:text-white">{task.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                  <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                    <p>
                      Fecha/Hora de Inicio: {formatDate(task.taskStart)} - {formatTime24Hour(task.startTime)}
                    </p>
                    <p>
                      Fecha/Hora Final: {formatDate(task.endTask)} - {formatTime24Hour(task.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                  className={`mx-1 px-3 py-1 rounded-md border ${
                    currentPage === page
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
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-3">No hay tareas disponibles</p>
        )}
      </div>
    </>
  )
}

export default CreateTasks
