import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../../ts/General/GetProfileData"
import { getCatedraticos } from "../../../ts/HeadquartersCoordinator/GetProfessor"
import { activaUsuario } from "../../../ts/General/ActivateUser"
import type React from "react"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import ActivaCatedraticos from "../../../components/Switchers/ActiveProfessors"
import Swal from "sweetalert2"
import BusquedaCatedratico from "../../../components/Searches/SearchProfessor"
import TourProfessors from "../../../components/Tours/HeadquartersCoordinator/TourProfessors"

/**
 * Interface to define the structure of a professor's data
 */
interface Professor {
  user_id: number // Unique identifier for the professor
  email: string // Professor's email address
  userName: string // Professor's name
  professorCode: string // Unique professor code
  profilePhoto: string | null // Profile photo URL or null if not available
  active: boolean // Status if the professor is active or not
}

const ListProfessors: React.FC = () => {
  // State hooks for managing various aspects of the component
  const [professors, setProfessors] = useState<Professor[]>([]) // List of professors
  const [currentPage, setCurrentPage] = useState(1) // Current page number for pagination
  const [professorsPerPage, setProfessorsPerPage] = useState(5) // Number of professors per page for pagination
  const [maxPageButtons, setMaxPageButtons] = useState(10) // Maximum number of page buttons to display in pagination

  /**
   * Effect hook to handle window resize and adjust page settings accordingly
   */
  useEffect(() => {
    const handleResize = () => {
      // If screen width is less than 768px, display 8 items per page and 5 page buttons
      if (window.innerWidth < 768) {
        setProfessorsPerPage(8)
        setMaxPageButtons(5)
      } else {
        // Otherwise, display 5 items per page and 10 page buttons
        setProfessorsPerPage(10)
        setMaxPageButtons(10)
      }
    }

    handleResize() // Call it once on mount to set the initial values
    window.addEventListener("resize", handleResize) // Add resize event listener to handle changes

    return () => window.removeEventListener("resize", handleResize) // Clean up the event listener on unmount
  }, [])

  /**
   * Effect hook to fetch the profile data and professors data when the component is mounted
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getDatosPerfil() // Fetch profile data
        if (profile.sede) {
          fetchProfessors(profile.sede) // If profile has 'sede', fetch the professors for that sede
        }
      } catch {
        setProfessors([]) // If there's an error, set empty list of professors
      }
    }

    fetchProfile() // Call the fetchProfile function
  }, [])

  /**
   * Function to fetch the list of professors based on the sede ID
   */
  const fetchProfessors = async (headquartersId: number) => {
    try {
      const retrievedProfessors = await getCatedraticos(headquartersId) // Fetch professors based on the sede ID
      setProfessors(Array.isArray(retrievedProfessors) ? retrievedProfessors : []) // Update the state if the response is an array
    } catch {
      setProfessors([]) // If there's an error, set empty list of professors
    }
  }

  /**
   * Handle search results from the SearchProfessor component
   */
  const handleSearchResults = (results: Professor[]) => {
    setProfessors(results)
    setCurrentPage(1) // Reset to first page when search results change
  }

  /**
   * Function to handle the activation/deactivation of a professor
   */
  const handleActiveChange = async (userId: number, newStatus: boolean) => {
    if (!newStatus) {
      // If deactivating a professor, show confirmation alert
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Este catedrático no podrá iniciar sesión, ¿aún deseas desactivarlo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, desactivar",
        cancelButtonText: "No, cancelar",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
      })

      if (!result.isConfirmed) {
        return // If user cancels, do nothing
      }
    }

    // Update the professor's active status in the state
    const updatedProfessors = professors.map((prof) =>
      prof.user_id === userId ? { ...prof, active: newStatus } : prof,
    )
    setProfessors(updatedProfessors)

    try {
      await activaUsuario(userId, newStatus) // Call the API to update the professor's status
    } catch {
      setProfessors((prev) => prev.map((prof) => (prof.user_id === userId ? { ...prof, active: !newStatus } : prof))) // If there's an error, revert the professor's status in the state
    }
  }

  // Pagination calculations
  const indexOfLastProfessor = currentPage * professorsPerPage // Index of the last professor on the current page
  const indexOfFirstProfessor = indexOfLastProfessor - professorsPerPage // Index of the first professor on the current page
  const currentProfessors = professors.slice(indexOfFirstProfessor, indexOfLastProfessor) // Slice the professors list based on the current page and page size

  // Total number of pages required for pagination
  const totalPages = Math.ceil(professors.length / professorsPerPage)

  /**
   * Function to handle pagination (navigate to a specific page)
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber) // Set the current page
    }
  }

  /**
   * Function to render the profile photo of the professor
   */
  const renderProfilePhoto = (profilePhoto: string | null, userName: string) =>
    profilePhoto ? (
      <img src={profilePhoto || "/placeholder.svg"} alt={userName} className="w-10 h-10 rounded-full" />
    ) : (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
        {userName.charAt(0).toUpperCase()}
      </div>
    )

  /**
   * Function to get the page range for pagination buttons
   */
  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)) // Calculate the start page
    const end = Math.min(totalPages, start + maxPageButtons - 1) // Calculate the end page

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1) // Adjust start page if the range is less than the max page buttons
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i) // Return the page numbers as an array
  }

  return (
    <>
      <Breadcrumb pageName="Listar Catedráticos" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <BusquedaCatedratico onSearchResults={handleSearchResults} />
          </div>

          {/* Help tour button */}
          <div className="flex items-center">
            <TourProfessors />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            id="professors-table"
            className="min-w-full bg-white border rounded-lg dark:bg-boxdark dark:border-strokedark"
          >
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">Photo</th>
                <th className="py-2 px-4 text-center">Name</th>
                <th className="py-2 px-4 text-center">Code</th>
                <th className="py-2 px-4 text-right">Active</th>
              </tr>
            </thead>
            <tbody>
              {currentProfessors.length > 0 ? (
                currentProfessors.map((prof) => (
                  <tr key={prof.user_id} className="border-t border-gray-200 dark:border-strokedark">
                    <td className="py-2 px-4 text-center">
                      {renderProfilePhoto(prof.profilePhoto, prof.userName)} {/* Render professor's photo */}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{prof.userName}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{prof.professorCode}</td>
                    <td className="py-2 px-4 flex justify-end" id="active-switcher">
                      <ActivaCatedraticos
                        enabled={prof.active}
                        onChange={() => handleActiveChange(prof.user_id, !prof.active)} // Toggle professor's active status
                        uniqueId={prof.user_id.toString()}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron catedráticos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {professors.length > professorsPerPage && (
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
        )}
      </div>
    </>
  )
}

export default ListProfessors
