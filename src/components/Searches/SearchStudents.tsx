import type React from "react"
import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getEstudiantePorCarnet } from "../../ts/Administrator/GetStudentCard"
import { getEstudiantes } from "../../ts/Administrator/GetStudents"

interface BuscadorEstudiantesProps {
  selectedAño: string
  selectedCurso: string
  onSearchResults: (estudiantes: any[]) => void
}

const BuscadorEstudiantes: React.FC<BuscadorEstudiantesProps> = ({ selectedAño, selectedCurso, onSearchResults }) => {
  const [searchCarnet, setSearchCarnet] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)

  // Ejecutar búsqueda cuando cambia el input
  useEffect(() => {
    // Crear un temporizador para evitar múltiples búsquedas durante la escritura rápida
    const timer = setTimeout(() => {
      if (searchCarnet.length >= 12 || searchCarnet.length === 11) {
        handleSearch()
      } else if (searchCarnet.length === 0) {
        // Si el campo está vacío, mostrar todos los estudiantes
        handleSearch()
      }
    }, 300) // Pequeño retraso para mejorar rendimiento

    return () => clearTimeout(timer)
  }, [searchCarnet, selectedAño, selectedCurso])

  // Función de búsqueda
  const handleSearch = async () => {
    if (isSearching) return // Evitar búsquedas simultáneas
    
    try {
      setIsSearching(true)
      const perfil = await getDatosPerfil() // Fetch profile data

      if (!searchCarnet || searchCarnet.length < 12) {
        // Si el campo está vacío o tiene menos de 12 caracteres, mostrar todos los estudiantes
        if (perfil.sede && selectedCurso && selectedAño) {
          const estudiantes = await getEstudiantes(
            perfil.sede,
            Number.parseInt(selectedCurso),
            Number.parseInt(selectedAño),
          )
          onSearchResults(Array.isArray(estudiantes) ? estudiantes : [])
        }
      } else {
        // Buscar estudiante específico por carnet
        const estudianteEncontrado = await getEstudiantePorCarnet(perfil.sede, Number.parseInt(selectedAño), searchCarnet)
        onSearchResults(estudianteEncontrado ? [estudianteEncontrado] : [])
      }
    } catch (error) {
      console.error("Error al buscar el estudiante:", error)
      onSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="mb-0 flex items-center">
      <input
        id="search-input"
        type="text"
        placeholder="Buscar por Carnet de Estudiante"
        value={searchCarnet}
        onChange={(e) => setSearchCarnet(e.target.value)}
        className="w-80 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
      />
      {isSearching && (
        <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Buscando...</div>
      )}
    </div>
  )
}

export default BuscadorEstudiantes
