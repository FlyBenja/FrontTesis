import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticosActivos } from '../../../ts/CoordinadorSede/GetCatedraticoActive';
import { createComision } from '../../../ts/CoordinadorSede/CreateComision';
import { getComisiones } from '../../../ts/CoordinadorSede/GetComisiones';

// Interface to define the structure of a Catedratico (Instructor)
interface Catedratico {
  user_id: number; // Unique identifier for the user
  userName: string; // User's name
  profilePhoto: string | null; // Profile photo URL (can be null)
  active: boolean; // Status of the Catedratico (active or inactive)
}

const CrearComision: React.FC = () => {
  // State hooks to manage the component's state
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]); // List of active instructors
  const [terna, setTerna] = useState<Catedratico[]>([]); // Group of selected instructors for the commission
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching data
  const [comisionExistente, setComisionExistente] = useState<boolean>(false); // Check if a commission already exists

  // useEffect hook to fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data (includes the 'sede' the user is related to)
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear(); // Get the current year
        
        if (perfil.sede) {
          // Fetch active instructors based on the 'sede' and year
          const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, year);
          setCatedraticos(catedraticosRecuperados);

          // Fetch commissions for the current year and 'sede'
          const comisionesRecuperadas = await getComisiones(perfil.sede, year);

          // If there are existing commissions, set the flag to true
          if (comisionesRecuperadas.length > 0) {
            setComisionExistente(true);
          }
        }
      } catch (error) {
        // Log any errors that occur during data fetching
        console.error('Error al cargar los datos:', error);
      } finally {
        // Set loading state to false once data fetching is done
        setLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handler to add an instructor to the 'terna' (group) when dragging
  const handleDrag = (catedratico: Catedratico) => {
    if (terna.length < 5 && !terna.includes(catedratico)) {
      // Add the instructor if there is space and they are not already in the 'terna'
      setTerna([...terna, catedratico]);
    }
  };

  // Handler to remove the last instructor from the 'terna'
  const handleRemoveLast = () => {
    setTerna(terna.slice(0, -1)); // Remove the last instructor from the array
  };

  // Handler to create the commission with the selected instructors
  const handleCreateComision = async () => {
    try {
      const perfil = await getDatosPerfil(); // Get the user profile data
      const year = new Date().getFullYear(); // Get the current year
  
      if (!perfil.sede) {
        // If 'sede' is not found, show an error alert
        showAlert('error', '¡Error!', 'No se pudo recuperar la sede.');
        return;
      }
  
      // Prepare the group data for the commission
      const groupData = terna.map((catedratico, index) => ({
        user_id: catedratico.user_id, // Instructor's user ID
        rol_comision_id: index + 1, // Role ID based on position in the 'terna'
      }));
  
      const comisionData = {
        year, // Current year
        sede_id: perfil.sede, // 'Sede' ID from the profile
        groupData, // The group of instructors
      };
  
      // Create the commission using the prepared data
      await createComision(comisionData);
  
      // Fetch updated commissions to check if a commission exists
      const comisionesRecuperadas = await getComisiones(perfil.sede, year);
      setComisionExistente(comisionesRecuperadas.length > 0);
  
      // Show a success alert
      showAlert('success', '¡Éxito!', 'La comisión fue creada exitosamente.');
  
      // Fetch updated list of instructors
      const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, year);
      setCatedraticos(catedraticosRecuperados);
      setTerna([]); // Reset the 'terna' after commission creation
    } catch (error: any) {
      // Handle any errors that occur during commission creation
    }
  };

  // Function to display an alert (success or error) using SweetAlert
  const showAlert = (type: 'success' | 'error', title: string, text: string) => {
    const confirmButtonColor = type === 'success' ? '#28a745' : '#dc3545'; // Set button color based on alert type
    Swal.fire({
      icon: type, // Alert type (success or error)
      title, // Alert title
      text, // Alert message
      confirmButtonColor, // Set the button color
      confirmButtonText: 'OK', // Button text
    });
  };

  // Function to return the role name based on the index in the 'terna'
  const getRoleForIndex = (index: number) => {
    switch (index) {
      case 0: return 'Presidente'; // First member is President
      case 1: return 'Secretario'; // Second member is Secretary
      case 2: return 'Vocal 1'; // Third member is Vocal 1
      case 3: return 'Vocal 2'; // Fourth member is Vocal 2
      case 4: return 'Vocal 3'; // Fifth member is Vocal 3
      default: return ''; // No role for other indices
    }
  };

  // Loading state while fetching data
  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  // If no instructors are available
  if (catedraticos.length === 0) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            No Hay Catedráticos Activos.
          </p>
        </div>
      </div>
    );
  }

  // If a commission already exists
  if (comisionExistente) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            Ya existe una comisión para esta sede y año.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Crear Comisión" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Catedráticos:</h2>

        {/* Display list of active instructors */}
        <div className="flex overflow-x-auto space-x-4 mb-8">
          {catedraticos.map((catedratico) => (
            <div
              key={catedratico.user_id}
              draggable
              onDragEnd={() => handleDrag(catedratico)} // Handle drag event
              className={`cursor-pointer flex flex-col items-center w-32 p-4 border border-gray-200 rounded-lg shadow-md ${terna.includes(catedratico)
                ? 'bg-blue-400 text-white dark:bg-white dark:text-black' // Highlight selected instructors
                : 'bg-white dark:bg-boxdark dark:text-white'
                }`}
            >
              {/* Display profile photo or initial */}
              {catedratico.profilePhoto ? (
                <img
                  src={catedratico.profilePhoto}
                  alt={catedratico.userName}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-blue-500 text-white rounded-full">
                  {catedratico.userName.charAt(0)}
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold">{catedratico.userName}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Comisión:</h2>
          {/* Display the selected instructors in the 'terna' */}
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-boxdark dark:text-white">
            {terna.length === 0 && <p className="text-gray-400 text-left">Presidente</p>}
            {terna.map((catedratico, index) => (
              <div key={catedratico.user_id} className="mb-2 flex">
                <span className="font-bold text-left">{getRoleForIndex(index)}:</span>
                <span className="text-left ml-2">{catedratico.userName}</span>
              </div>
            ))}
            {terna.length === 1 && <p className="text-gray-400 text-left">Secretario</p>}
            {terna.length === 2 && <p className="text-gray-400 text-left">Vocal 1</p>}
            {terna.length === 3 && <p className="text-gray-400 text-left">Vocal 2</p>}
            {terna.length === 4 && <p className="text-gray-400 text-left">Vocal 3</p>}
          </div>
        </div>

        {/* Button to remove the last member from the 'terna' */}
        <div className="mt-6 text-center">
          <button
            onClick={handleRemoveLast}
            className={`px-4 py-2 bg-red-500 text-white rounded-lg ${terna.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
            disabled={terna.length === 0}
          >
            Quitar Último
          </button>
        </div>

        {/* Button to create the commission */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCreateComision}
            className={`px-4 py-2 bg-primary text-white rounded-lg ${terna.length < 3 || terna.length > 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            disabled={terna.length < 3 || terna.length > 5}
          >
            Crear Comisión
          </button>
        </div>
      </div>
    </>
  );
};

export default CrearComision;
