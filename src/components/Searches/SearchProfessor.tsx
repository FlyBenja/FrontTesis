import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../ts/General/GetProfileData';
import { getCatedraticos } from '../../ts/HeadquartersCoordinator/GetProfessor';
import { getCatedraticoPorCarnet } from '../../ts/HeadquartersCoordinator/GetProfessorCard';

/**
 * Props for the BusquedaCatedratico component.
 */
interface BusquedaCatedraticoProps {
  onSearchResults: (catedraticos: any[]) => void;
}

/**
 * BusquedaCatedratico component allows searching for professors by their ID (carnet) or by name.
 * 
 * This component performs an asynchronous search operation to fetch professor data from an API based on the input provided.
 * It utilizes a debounced search to minimize the number of requests when typing.
 * 
 * <BusquedaCatedratico onSearchResults={handleSearchResults} />
 */
const BusquedaCatedratico: React.FC<BusquedaCatedraticoProps> = ({
  onSearchResults,
}) => {
  const [searchCarnet, setSearchCarnet] = useState<string>(''); // State for search input value
  const [isSearching, setIsSearching] = useState<boolean>(false); // State to track if a search is in progress

  // Execute search when input changes
  useEffect(() => {
    // Create a timer to avoid multiple searches during rapid typing
    const timer = setTimeout(() => {
      if (searchCarnet.length >= 12 || searchCarnet.length === 11) {
        handleSearch(); // If the input length is 11 or 12, trigger search
      } else if (searchCarnet.length === 0) {
        // If input is empty, show all professors
        handleSearch();
      }
    }, 300); // Small delay to improve performance

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [searchCarnet]);

  /**
   * Function to perform the search operation.
   * This function checks if the input is empty or has less than 12 characters.
   * If true, it fetches all professors from the current profile's sede (location).
   * If the input length is greater than or equal to 12, it searches for a specific professor by carnet.
   */
  const handleSearch = async () => {
    if (isSearching) return; // Prevent multiple searches simultaneously

    try {
      setIsSearching(true);
      
      if (!searchCarnet || searchCarnet.length < 12) {
        // If the input is empty or has fewer than 12 characters, show all professors
        const perfil = await getDatosPerfil(); // Fetch the current profile data
        if (perfil.sede) {
          const catedraticosRecuperados = await getCatedraticos(perfil.sede); // Fetch professors from the current sede
          onSearchResults(Array.isArray(catedraticosRecuperados) ? catedraticosRecuperados : []); // Return the result
        }
      } else {
        // If the input length is 12 or more, search for a specific professor by carnet
        const catedraticoEncontrado = await getCatedraticoPorCarnet(searchCarnet); // Fetch professor by carnet
        onSearchResults(catedraticoEncontrado ? [catedraticoEncontrado] : []); // Return the found professor or an empty array
      }
    } catch (error) {
      console.error('Error al buscar el catedrático:', error); // Log any error during the search
      onSearchResults([]); // Return an empty array in case of error
    } finally {
      setIsSearching(false); // Set the searching state to false after the operation is completed
    }
  };

  return (
    <div className="mb-4 flex items-center">
      <input
        id="search-input"
        type="text"
        placeholder="Buscar por Código / Nombre Catedrático" // "Search by Code / Professor Name"
        value={searchCarnet}
        onChange={(e) => setSearchCarnet(e.target.value)} // Update the searchCarnet state as the user types
        className="w-80 px-2 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
      />
      {isSearching && <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Buscando...</div>} 
    </div>
  );
};

export default BusquedaCatedratico;
