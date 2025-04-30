import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/General/GetProfileData';
import { getCatedraticosActivos } from '../../../ts/HeadquartersCoordinator/GetProfessorActive';
import { createComision } from '../../../ts/HeadquartersCoordinator/CreateCommission';
import { getComisiones } from '../../../ts/HeadquartersCoordinator/GetCommissions';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

// Interface to define the structure of a Professor
interface Professor {
  user_id: number // Unique identifier for the user
  userName: string // User's name
  profilePhoto: string | null // Profile photo URL (can be null)
  active: boolean // Status of the Professor (active or inactive)
}

const CreateCommission: React.FC = () => {
  // State hooks to manage the component's state
  const [professors, setProfessors] = useState<Professor[]>([]) // List of active professors
  const [selectedGroup, setSelectedGroup] = useState<Professor[]>([]) // Group of selected professors for the commission
  const [loading, setLoading] = useState<boolean>(true) // Loading state for fetching data
  const [commissionExists, setCommissionExists] = useState<boolean>(false) // Check if a commission already exists

  /**
   * useEffect hook to fetch the data when the component mounts
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data (includes the 'headquarters' the user is related to)
        const profile = await getDatosPerfil()
        const year = new Date().getFullYear() // Get the current year

        if (profile.sede) {
          // Fetch active professors based on the 'headquarters' and year
          const retrievedProfessors = await getCatedraticosActivos(profile.sede, year)
          setProfessors(retrievedProfessors)

          // Fetch commissions for the current year and 'headquarters'
          const retrievedCommissions = await getComisiones(profile.sede, year)

          // If there are existing commissions, set the flag to true
          if (retrievedCommissions.length > 0) {
            setCommissionExists(true)
          }
        }
      } catch (error) {
        // Log any errors that occur during data fetching
        console.error("Error al cargar los datos:", error)
      } finally {
        // Set loading state to false once data fetching is done
        setLoading(false)
      }
    }

    fetchData() // Call the function to fetch data
  }, []) // Empty dependency array ensures this runs only once on mount

  /**
   * Handler to add a professor to the 'selectedGroup' when dragging
   */
  const handleDrag = (professor: Professor) => {
    if (selectedGroup.length < 5 && !selectedGroup.includes(professor)) {
      // Add the professor if there is space and they are not already in the 'selectedGroup'
      setSelectedGroup([...selectedGroup, professor])
    }
  }

  /**
   * Handler to remove the last professor from the 'selectedGroup'
   */
  const handleRemoveLast = () => {
    setSelectedGroup(selectedGroup.slice(0, -1)) // Remove the last professor from the array
  }

  /**
   * Handler to create the commission with the selected professors
   */
  const handleCreateCommission = async () => {
    try {
      const profile = await getDatosPerfil() // Get the user profile data
      const year = new Date().getFullYear() // Get the current year

      if (!profile.sede) {
        // If 'headquarters' is not found, show an error alert
        showAlert("error", "¡Error!", "No se pudo recuperar la sede.")
        return
      }

      // Prepare the group data for the commission
      const groupData = selectedGroup.map((professor, index) => ({
        user_id: professor.user_id, // Professor's user ID
        rol_comision_id: index + 1, // Role ID based on position in the 'selectedGroup'
      }))

      const commissionData = {
        year, // Current year
        sede_id: profile.sede, // 'Headquarters' ID from the profile
        groupData, // The group of professors
      }

      // Create the commission using the prepared data
      await createComision(commissionData)

      // Fetch updated commissions to check if a commission exists
      const retrievedCommissions = await getComisiones(profile.sede, year)
      setCommissionExists(retrievedCommissions.length > 0)

      // Show a success alert
      showAlert("success", "¡Éxito!", "La comisión fue creada exitosamente.")

      // Fetch updated list of professors
      const retrievedProfessors = await getCatedraticosActivos(profile.sede, year)
      setProfessors(retrievedProfessors)
      setSelectedGroup([]) // Reset the 'selectedGroup' after commission creation
    } catch (error: any) {
      // Handle any errors that occur during commission creation
    }
  }

  /**
   * Function to display an alert (success or error) using SweetAlert
   */
  const showAlert = (type: "success" | "error", title: string, text: string) => {
    const confirmButtonColor = type === "success" ? "#28a745" : "#dc3545" // Set button color based on alert type
    Swal.fire({
      icon: type, // Alert type (success or error)
      title, // Alert title
      text, // Alert message
      confirmButtonColor, // Set the button color
      confirmButtonText: "OK", // Button text
    })
  }

  /**
   * Function to return the role name based on the index in the 'selectedGroup'
   */
  const getRoleForIndex = (index: number) => {
    switch (index) {
      case 0:
        return "Presidente" // First member is President
      case 1:
        return "Secretario" // Second member is Secretary
      case 2:
        return "Vocal 1" // Third member is Vocal 1
      case 3:
        return "Vocal 2" // Fourth member is Vocal 2
      case 4:
        return "Vocal 3" // Fifth member is Vocal 3
      default:
        return "" // No role for other indices
    }
  }

  // Loading state while fetching data
  if (loading) {
    return <div className="text-center">Cargando...</div>
  }

  // If no professors are available
  if (professors.length === 0) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">No Hay Catedráticos Activos.</p>
        </div>
      </div>
    )
  }

  // If a commission already exists
  if (commissionExists) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            Ya existe una comisión para esta sede y año.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb pageName="Crear Comisión" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Catedráticos:</h2>

        {/* Display list of active professors */}
        <div className="flex overflow-x-auto space-x-4 mb-8">
          {professors.map((professor) => (
            <div
              key={professor.user_id}
              draggable
              onDragEnd={() => handleDrag(professor)} // Handle drag event
              className={`cursor-pointer flex flex-col items-center w-32 p-4 border border-gray-200 rounded-lg shadow-md ${
                selectedGroup.includes(professor)
                  ? "bg-blue-400 text-white dark:bg-white dark:text-black" // Highlight selected professors
                  : "bg-white dark:bg-boxdark dark:text-white"
              }`}
            >
              {/* Display profile photo or initial */}
              {professor.profilePhoto ? (
                <img
                  src={professor.profilePhoto || "/placeholder.svg"}
                  alt={professor.userName}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-blue-500 text-white rounded-full">
                  {professor.userName.charAt(0)}
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold">{professor.userName}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Comisión:</h2>
          {/* Display the selected professors in the 'selectedGroup' */}
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-boxdark dark:text-white">
            {selectedGroup.length === 0 && <p className="text-gray-400 text-left">Presidente</p>}
            {selectedGroup.map((professor, index) => (
              <div key={professor.user_id} className="mb-2 flex">
                <span className="font-bold text-left">{getRoleForIndex(index)}:</span>
                <span className="text-left ml-2">{professor.userName}</span>
              </div>
            ))}
            {selectedGroup.length === 1 && <p className="text-gray-400 text-left">Secretario</p>}
            {selectedGroup.length === 2 && <p className="text-gray-400 text-left">Vocal 1</p>}
            {selectedGroup.length === 3 && <p className="text-gray-400 text-left">Vocal 2</p>}
            {selectedGroup.length === 4 && <p className="text-gray-400 text-left">Vocal 3</p>}
          </div>
        </div>

        {/* Button to remove the last member from the 'selectedGroup' */}
        <div className="mt-6 text-center">
          <button
            onClick={handleRemoveLast}
            className={`px-4 py-2 bg-red-500 text-white rounded-lg ${selectedGroup.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
            disabled={selectedGroup.length === 0}
          >
            Quitar Último
          </button>
        </div>

        {/* Button to create the commission */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCreateCommission}
            className={`px-4 py-2 bg-primary text-white rounded-lg ${selectedGroup.length < 3 || selectedGroup.length > 5 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"}`}
            disabled={selectedGroup.length < 3 || selectedGroup.length > 5}
          >
            Crear Comisión
          </button>
        </div>
      </div>
    </>
  )
}

export default CreateCommission
