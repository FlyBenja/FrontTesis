import type React from "react"
import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getCatedraticos } from "../../ts/HeadquartersCoordinator/GetProfessor"
import { getCatedraticoPorCarnet } from "../../ts/HeadquartersCoordinator/GetProfessorCard"

/**
 * Props for the SearchProfessor component.
 */
interface SearchProfessorProps {
  onSearchResults: (catedraticos: any[]) => void
}

/**
 * SearchProfessor component allows searching for professors by their ID (carnet) or by name.
 *
 * This component performs an asynchronous search operation to fetch professor data from an API based on the input provided.
 * It utilizes a debounced search to minimize the number of requests when typing.
 *
 * <SearchProfessor onSearchResults={handleSearchResults} />
 */
const SearchProfessor: React.FC<SearchProfessorProps> = ({ onSearchResults }) => {
  const [searchCarnet, setSearchCarnet] = useState<string>("") // State for search input value
  const [isSearching, setIsSearching] = useState<boolean>(false) // State to track if a search is in progress

  // Execute search when input changes
  useEffect(() => {
    // Create a timer to avoid multiple searches during rapid typing
    const timer = setTimeout(() => {
      if (searchCarnet.length >= 12 || searchCarnet.length === 11) {
        handleSearch() // If the input length is 11 or 12, trigger search
      } else if (searchCarnet.length === 0) {
        // If input is empty, show all professors
        handleSearch()
      }
    }, 300) // Small delay to improve performance

    return () => clearTimeout(timer) // Cleanup the timer on component unmount
  }, [searchCarnet])

  /**
   * Function to perform the search operation.
   * This function checks if the input is empty or has less than 12 characters.
   * If true, it fetches all professors from the current profile's sede (location).
   * If the input length is greater than or equal to 12, it searches for a specific professor by carnet.
   */
  const handleSearch = async () => {
    if (isSearching) return // Prevent multiple searches simultaneously

    try {
      setIsSearching(true)

      if (!searchCarnet || searchCarnet.length < 12) {
        // If the input is empty or has fewer than 12 characters, show all professors
        const perfil = await getDatosPerfil() // Fetch the current profile data
        if (perfil.sede) {
          const catedraticosRecuperados = await getCatedraticos(perfil.sede) // Fetch professors from the current sede
          onSearchResults(Array.isArray(catedraticosRecuperados) ? catedraticosRecuperados : []) // Return the result
        }
      } else {
        // If the input length is 12 or more, search for a specific professor by carnet
        const catedraticoEncontrado = await getCatedraticoPorCarnet(searchCarnet) // Fetch professor by carnet
        onSearchResults(catedraticoEncontrado ? [catedraticoEncontrado] : []) // Return the found professor or an empty array
      }
    } catch (error) {
      console.error("Error al buscar el catedrático:", error) // Log any error during the search
      onSearchResults([]) // Return an empty array in case of error
    } finally {
      setIsSearching(false) // Set the searching state to false after the operation is completed
    }
  }

  return (
    <div className="mb-4 flex items-center">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <input
          id="search-input"
          type="text"
          placeholder="🔍 Buscar por Código / Nombre Catedrático" // "Search by Code / Professor Name"
          value={searchCarnet}
          onChange={(e) => setSearchCarnet(e.target.value)} // Update the searchCarnet state as the user types
          className="w-full pl-16 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      {isSearching && (
        <div className="ml-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium">Buscando...</span>
        </div>
      )}
    </div>
  )
}

export default SearchProfessor
