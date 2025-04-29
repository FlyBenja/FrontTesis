import type React from "react"
import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getEstudiantePorCarnet } from "../../ts/Administrator/GetStudentCard"
import { getEstudiantes } from "../../ts/Administrator/GetStudents"

/**
 * `BuscadorEstudiantes` is a component that allows searching for students by their student card number or by filtering 
 * students based on selected year and course.
 * 
 */
interface BuscadorEstudiantesProps {
  selectedAño: string // Selected year for student filtering
  selectedCurso: string // Selected course for student filtering
  onSearchResults: (estudiantes: any[]) => void // Callback to return search results
}

/**
 * `BuscadorEstudiantes` is a functional React component that allows searching for students either by their student card number
 * or by filtering based on the selected year and course.
 */
const BuscadorEstudiantes: React.FC<BuscadorEstudiantesProps> = ({ selectedAño, selectedCurso, onSearchResults }) => {
  const [searchCarnet, setSearchCarnet] = useState<string>("") // State to hold the value of the student card input
  const [isSearching, setIsSearching] = useState<boolean>(false) // State to track if a search is in progress

  // Execute search when the input changes
  useEffect(() => {
    // Create a timer to avoid multiple searches during rapid typing
    const timer = setTimeout(() => {
      if (searchCarnet.length >= 12 || searchCarnet.length === 11) {
        handleSearch() // Perform the search if the input is 11 or 12 characters long
      } else if (searchCarnet.length === 0) {
        // If the input is empty, show all students
        handleSearch()
      }
    }, 300) // Small delay to improve performance

    // Cleanup timer on component unmount or when searchCarnet changes
    return () => clearTimeout(timer)
  }, [searchCarnet, selectedAño, selectedCurso]) // Dependency array to trigger the effect when input or filters change

  /**
   * Handles the search logic based on the input value. If the carnet is valid (12 characters), it searches for a specific student.
   * If the carnet is empty or has fewer than 12 characters, it fetches all students based on the selected year and course.
   */
  const handleSearch = async () => {
    if (isSearching) return // Prevent simultaneous searches
    
    try {
      setIsSearching(true) // Set the search state to true to indicate a search is in progress
      const perfil = await getDatosPerfil() // Fetch profile data of the logged-in user

      if (!searchCarnet || searchCarnet.length < 12) {
        // If the input is empty or has less than 12 characters, show all students
        if (perfil.sede && selectedCurso && selectedAño) {
          // Fetch students based on the selected course, year, and the profile's campus
          const estudiantes = await getEstudiantes(
            perfil.sede,
            Number.parseInt(selectedCurso), // Convert selectedCurso to a number
            Number.parseInt(selectedAño), // Convert selectedAño to a number
          )
          onSearchResults(Array.isArray(estudiantes) ? estudiantes : []) // Return the list of students to the parent component
        }
      } else {
        // If the carnet is valid (12 characters), search for a specific student
        const estudianteEncontrado = await getEstudiantePorCarnet(perfil.sede, Number.parseInt(selectedAño), searchCarnet)
        onSearchResults(estudianteEncontrado ? [estudianteEncontrado] : []) // Return the found student or an empty array
      }
    } catch (error) {
      console.error("Error al buscar el estudiante:", error) // Log the error if something goes wrong
      onSearchResults([]) // Return an empty list in case of an error
    } finally {
      setIsSearching(false) // Set the search state to false once the search is complete
    }
  }

  return (
    <div className="mb-0 flex items-center">
      <input
        id="search-input"
        type="text"
        placeholder="Buscar por Carnet de Estudiante" // Input placeholder for the student card search
        value={searchCarnet} // Bind the input value to the searchCarnet state
        onChange={(e) => setSearchCarnet(e.target.value)} // Update the searchCarnet state on input change
        className="w-80 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
      />
      {isSearching && (
        <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Buscando...</div> // Display searching text while searching
      )}
    </div>
  )
}

export default BuscadorEstudiantes
