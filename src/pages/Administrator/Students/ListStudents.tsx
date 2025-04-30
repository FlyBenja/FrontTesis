import type React from "react"
import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../../ts/General/GetProfileData"
import { getYears } from "../../../ts/General/GetYears"
import { getEstudiantes } from "../../../ts/Administrator/GetStudents"
import { getCursos } from "../../../ts/General/GetCourses"
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import generaPDFGeneral from "../../../components/Pdfs/generatePDFGeneral"
import BuscadorEstudiantes from "../../../components/Searches/SearchStudents"
import TourStudents from "../../../components/Tours/Administrator/TourStudents"

/**
 * Interface for student data
 */
interface Estudiante {
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
interface Curso {
  course_id: number
  courseName: string
}

/**
 * List Students Component
 * Displays a list of students with filtering and pagination
 */
const ListStudents: React.FC = () => {
  // State variables for managing students data, years, courses, etc.
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]) // List of students
  const [years, setYears] = useState<number[]>([]) // List of available years
  const [selectedAño, setSelectedAño] = useState<string>("") // Selected year
  const [currentPage, setCurrentPage] = useState(1) // Current page for pagination
  const [cursos, setCursos] = useState<Curso[]>([]) // List of available courses
  const [selectedCurso, setSelectedCurso] = useState<string>("") // Selected course
  const [estudiantesPerPage, setEstudiantesPerPage] = useState(4) // Number of students per page
  const [maxPageButtons, setMaxPageButtons] = useState(10) // Maximum number of page buttons to show
  const navigate = useNavigate() // To navigate to other pages

  /**
   * Effect hook to fetch initial data
   */
  useEffect(() => {
    // Fetch initial data such as profile, years, and courses
    const fetchInitialData = async () => {
      const perfil = await getDatosPerfil() // Fetch profile data
      const yearsRecuperados = await getYears() // Fetch available years
      setYears(yearsRecuperados.map((yearObj) => yearObj.year)) // Set years in state

      // Set the current year if it exists in the list
      const currentYear = new Date().getFullYear().toString()
      if (yearsRecuperados.map((yearObj) => yearObj.year.toString()).includes(currentYear)) {
        setSelectedAño(currentYear) // Set current year as selected
      }

      // Set the course based on the current month (June onwards -> course_id = 2, else course_id = 1)
      const currentMonth = new Date().getMonth()
      const initialCourseId = currentMonth >= 6 ? "2" : "1"
      setSelectedCurso(initialCourseId)

      // Fetch students and courses for the selected year and course if profile and year are available
      if (perfil.sede && currentYear) {
        fetchEstudiantes(perfil.sede, initialCourseId, currentYear) // Fetch students
        fetchCursos(perfil.sede) // Fetch courses
      }
    }

    fetchInitialData() // Call the function to fetch data on initial render
  }, []) // Empty dependency array ensures it runs only once on mount

  /**
   * Fetch students based on selected year, course, and campus
   */
  const fetchEstudiantes = async (sedeId: number, courseId: string, nameYear: string) => {
    try {
      const estudiantesRecuperados = await getEstudiantes(sedeId, Number.parseInt(courseId), Number.parseInt(nameYear))
      setEstudiantes(Array.isArray(estudiantesRecuperados) ? estudiantesRecuperados : []) // Set students in state
    } catch {
      setEstudiantes([]) // Set empty list in case of error
    }
  }

  /**
   * Fetch courses based on selected year and campus
   * @param sedeId - Campus ID
   */
  const fetchCursos = async (sedeId: number) => {
    try {
      const añoSeleccionado = selectedAño ? Number.parseInt(selectedAño) : new Date().getFullYear() // Set selected year or current year
      const cursosRecuperados = await getCursos(sedeId, añoSeleccionado) // Fetch courses
      setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []) // Set courses in state
    } catch (error) {
      setCursos([]) // Set empty list in case of error
    }
  }

  /**
   * Handle change of selected year from dropdown
   * @param e - Change event from select
   */
  const handleAñoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const añoSeleccionado = e.target.value // Get selected year
    setSelectedAño(añoSeleccionado) // Update state with selected year
    const perfil = await getDatosPerfil() // Fetch profile data
    if (perfil.sede && añoSeleccionado) {
      const cursosRecuperados = await getCursos(perfil.sede, Number.parseInt(añoSeleccionado)) // Fetch courses for selected year
      setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []) // Set courses in state
    }
    if (perfil.sede && añoSeleccionado && selectedCurso) {
      fetchEstudiantes(perfil.sede, selectedCurso, añoSeleccionado) // Fetch students for selected year and course
    }
  }

  /**
   * Handle change of selected course from dropdown
   * @param e - Change event from select
   */
  const handleCursoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value) // Update state with selected course
    const perfil = await getDatosPerfil() // Fetch profile data
    if (perfil.sede && selectedAño && e.target.value) {
      fetchEstudiantes(perfil.sede, e.target.value, selectedAño) // Fetch students for selected year and course
    }
  }

  /**
   * Handle click on student row to navigate to the student's timeline
   * @param estudiante - Student data to pass to timeline
   */
  const handleStudentClick = (estudiante: Estudiante) => {
    navigate(`/administrador/time-line`, {
      state: {
        estudiante,
        selectedAño,
        selectedCurso,
      },
    })
  }

  /**
   * Handle print PDF for the selected year and course
   * @param selectedAño - Selected year
   * @param selectedCurso - Selected course
   */
  const handlePrintPDF = (selectedAño: number, selectedCurso: number) => {
    generaPDFGeneral(selectedAño, selectedCurso) // Generate PDF report
  }

  /**
   * Handle search results from the BuscadorEstudiantes component
   * @param resultados - Search results array
   */
  const handleSearchResults = (resultados: Estudiante[]) => {
    setEstudiantes(resultados)
    setCurrentPage(1) // Reset to first page when search results change
  }

  // Pagination logic
  const indexOfLastEstudiante = currentPage * estudiantesPerPage // Index of last student on current page
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage // Index of first student on current page
  const currentEstudiantes = estudiantes.slice(indexOfFirstEstudiante, indexOfLastEstudiante) // Slice students for current page
  const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage) // Total number of pages

  /**
   * Pagination function to set the current page
   * @param pageNumber - Page number to navigate to
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber) // Update current page
    }
  }

  /**
   * Get page range for pagination buttons
   * @returns Array of page numbers to display
   */
  const getPageRange = () => {
    const range: number[] = []
    const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage) // Calculate total pages
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)) // Calculate start page
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1) // Calculate end page

    for (let i = startPage; i <= endPage; i++) {
      range.push(i) // Add pages to range
    }

    return range
  }

  /**
   * Render the student's profile photo or an initial if no photo is available
   * @param profilePhoto - URL of profile photo
   * @param userName - Student's name
   * @returns JSX element for profile photo
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
   * Adjust number of students per page and pagination buttons on window resize
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEstudiantesPerPage(8) // Set more students per page on smaller screens
        setMaxPageButtons(5) // Set fewer page buttons
      } else {
        setEstudiantesPerPage(10) // Set default students per page
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
              selectedAño={selectedAño}
              selectedCurso={selectedCurso}
              onSearchResults={handleSearchResults}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="print-report"
              className="px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
              onClick={() => handlePrintPDF(Number(selectedAño), Number(selectedCurso))}
            >
              Imprimir Reporte
            </button>
            <TourStudents />
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select
            id="select-year"
            value={selectedAño}
            onChange={handleAñoChange}
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
            value={selectedCurso}
            onChange={handleCursoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.course_id} value={curso.course_id.toString()}>
                {curso.courseName}
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
              {currentEstudiantes.length > 0 ? (
                currentEstudiantes.map((est) => (
                  <tr
                    key={est.id}
                    onClick={() => handleStudentClick(est)}
                    className="border-t border-gray-200 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 relative group"
                  >
                    <td className="py-2 px-4 text-center">{renderProfilePhoto(est.fotoPerfil, est.userName)}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white relative group">
                      {est.userName}
                      <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-lg px-1 py-1 -top-10 left-[60%] transform -translate-x-1/2 w-40 dark:bg-white dark:text-gray-800">
                        Ir Hacia TimeLine Estudiante
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">{est.carnet}</td>
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
