import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../../ts/General/GetProfileData"
import { getYears } from "../../../ts/General/GetYears"
import { getEstudiantes } from "../../../ts/Administrator/GetStudents"
import { getCursos } from "../../../ts/General/GetCourses"
import { useNavigate } from "react-router-dom"
import type React from "react"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import generaPDFGeneral from "../../../components/Pdfs/generatePDFGeneral"
import BuscadorEstudiantes from "../../../components/Searches/SearchStudents"
import TourStudents from "../../../components/Tours/Administrator/TourStudents"

/**
 * Interface for student data
 */
interface Student {
  id: number
  userName: string
  carnet: string
  curso: string
  año: number
  fotoPerfil: string
}

/**
 * Interface for course data
 */
interface Course {
  course_id: number
  courseName: string
}

/**
 * Component for listing and managing students
 */
const ListStudents: React.FC = () => {
  // State variables for managing students data, years, courses, etc.
  const [students, setStudents] = useState<Student[]>([]) // List of students
  const [years, setYears] = useState<number[]>([]) // List of available years
  const [selectedYear, setSelectedYear] = useState<string>("") // Selected year
  const [currentPage, setCurrentPage] = useState(1) // Current page for pagination
  const [courses, setCourses] = useState<Course[]>([]) // List of available courses
  const [selectedCourse, setSelectedCourse] = useState<string>("") // Selected course
  const [studentsPerPage, setStudentsPerPage] = useState(4) // Number of students per page
  const [maxPageButtons, setMaxPageButtons] = useState(10) // Maximum number of page buttons to show
  const navigate = useNavigate() // To navigate to other pages

  /**
   * Effect hook to fetch initial data on component mount
   */
  useEffect(() => {
    // Fetch initial data such as profile, years, and courses
    const fetchInitialData = async () => {
      const profile = await getDatosPerfil() // Fetch profile data
      const retrievedYears = await getYears() // Fetch available years
      setYears(retrievedYears.map((yearObj) => yearObj.year)) // Set years in state

      // Set the current year if it exists in the list
      const currentYear = new Date().getFullYear().toString()
      if (retrievedYears.map((yearObj) => yearObj.year.toString()).includes(currentYear)) {
        setSelectedYear(currentYear) // Set current year as selected
      }

      // Set the course based on the current month (June onwards -> course_id = 2, else course_id = 1)
      const currentMonth = new Date().getMonth()
      const initialCourseId = currentMonth >= 6 ? "2" : "1"
      setSelectedCourse(initialCourseId)

      // Fetch students and courses for the selected year and course if profile and year are available
      if (profile.sede && currentYear) {
        fetchStudents(profile.sede, initialCourseId, currentYear) // Fetch students
        fetchCourses(profile.sede) // Fetch courses
      }
    }

    fetchInitialData() // Call the function to fetch data on initial render
  }, []) // Empty dependency array ensures it runs only once on mount

  /**
   * Fetch students based on selected year, course, and campus
   */
  const fetchStudents = async (campusId: number, courseId: string, year: string) => {
    try {
      const retrievedStudents = await getEstudiantes(campusId, Number.parseInt(courseId), Number.parseInt(year))
      setStudents(Array.isArray(retrievedStudents) ? retrievedStudents : []) // Set students in state
    } catch {
      setStudents([]) // Set empty list in case of error
    }
  }

  /**
   * Fetch courses based on selected year and campus
   */
  const fetchCourses = async (campusId: number) => {
    try {
      const selectedYearValue = selectedYear ? Number.parseInt(selectedYear) : new Date().getFullYear() // Set selected year or current year
      const retrievedCourses = await getCursos(campusId, selectedYearValue) // Fetch courses
      setCourses(Array.isArray(retrievedCourses) ? retrievedCourses : []) // Set courses in state
    } catch (error) {
      setCourses([]) // Set empty list in case of error
    }
  }

  /**
   * Handle change of selected year from dropdown
   */
  const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value // Get selected year
    setSelectedYear(selectedYear) // Update state with selected year
    const profile = await getDatosPerfil() // Fetch profile data
    if (profile.sede && selectedYear) {
      const retrievedCourses = await getCursos(profile.sede, Number.parseInt(selectedYear)) // Fetch courses for selected year
      setCourses(Array.isArray(retrievedCourses) ? retrievedCourses : []) // Set courses in state
    }
    if (profile.sede && selectedYear && selectedCourse) {
      fetchStudents(profile.sede, selectedCourse, selectedYear) // Fetch students for selected year and course
    }
  }

  /**
   * Handle change of selected course from dropdown
   */
  const handleCourseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value) // Update state with selected course
    const profile = await getDatosPerfil() // Fetch profile data
    if (profile.sede && selectedYear && e.target.value) {
      fetchStudents(profile.sede, e.target.value, selectedYear) // Fetch students for selected year and course
    }
  }

  /**
   * Handle click on student row to navigate to the student's timeline
   */
  const handleStudentClick = (student: Student) => {
    navigate(`/administrador/time-line`, {
      state: {
        estudiante: student,
        selectedAño: selectedYear,
        selectedCurso: selectedCourse,
      },
    })
  }

  /**
   * Handle print PDF for the selected year and course
   */
  const handlePrintPDF = (selectedYear: number, selectedCourse: number) => {
    generaPDFGeneral(selectedYear, selectedCourse) // Generate PDF report
  }

  /**
   * Handle search results from the BuscadorEstudiantes component
   */
  const handleSearchResults = (results: Student[]) => {
    setStudents(results)
    setCurrentPage(1) // Reset to first page when search results change
  }

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage // Index of last student on current page
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage // Index of first student on current page
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent) // Slice students for current page
  const totalPages = Math.ceil(students.length / studentsPerPage) // Total number of pages

  /**
   * Pagination function to set the current page
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber) // Update current page
    }
  }

  /**
   * Get page range for pagination buttons
   */
  const getPageRange = () => {
    const range: number[] = []
    const totalPages = Math.ceil(students.length / studentsPerPage) // Calculate total pages
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)) // Calculate start page
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1) // Calculate end page

    for (let i = startPage; i <= endPage; i++) {
      range.push(i) // Add pages to range
    }

    return range
  }

  /**
   * Render the student's profile photo or an initial if no photo is available
   */
  const renderProfilePhoto = (profilePhoto: string, userName: string) => {
    if (profilePhoto) {
      return <img src={profilePhoto || "/placeholder.svg"} alt={userName} className="w-10 h-10 rounded-full" /> // Render photo if available
    } else {
      const initial = userName.charAt(0).toUpperCase() // Get first letter of user name
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
          {initial} {/* Render initial if no photo */}
        </div>
      )
    }
  }

  /**
   * Effect hook to adjust UI based on screen size
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setStudentsPerPage(8) // Set more students per page on smaller screens
        setMaxPageButtons(5) // Set fewer page buttons
      } else {
        setStudentsPerPage(10) // Set default students per page
        setMaxPageButtons(10) // Set default page buttons
      }
    }

    handleResize() // Initial check for screen size
    window.addEventListener("resize", handleResize) // Add resize event listener
    return () => window.removeEventListener("resize", handleResize) // Cleanup event listener
  }, [])

  return (
    <>
      <Breadcrumb pageName="Listar Estudiantes" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex flex-wrap items-center space-x-2">
          <div className="flex items-center flex-grow">
            <BuscadorEstudiantes
              selectedAño={selectedYear}
              selectedCurso={selectedCourse}
              onSearchResults={handleSearchResults}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="print-report"
              className="px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
              onClick={() => handlePrintPDF(Number(selectedYear), Number(selectedCourse))}
            >
              Imprimir Reporte
            </button>
            <TourStudents />
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select
            id="select-year"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <select
            id="select-course"
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar curso</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id.toString()}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table
            id="student-table"
            className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark"
          >
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">Foto</th>
                <th className="py-2 px-4 text-center">Nombre Estudiante</th>
                <th className="py-2 px-4 text-center">Carnet</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
                    className="border-t border-gray-200 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 relative group"
                  >
                    <td className="py-2 px-4 text-center">
                      {renderProfilePhoto(student.fotoPerfil, student.userName)}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white relative group">
                      {student.userName}
                      <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-lg px-1 py-1 -top-10 left-[60%] transform -translate-x-1/2 w-40 dark:bg-white dark:text-gray-800">
                        Ir Hacia TimeLine Estudiante
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">{student.carnet}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center">
                    No se encontraron estudiantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
    </>
  )
}

export default ListStudents
