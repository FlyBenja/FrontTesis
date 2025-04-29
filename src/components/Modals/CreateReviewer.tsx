import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { creaRevisor } from '../../ts/ThesisCoordinatorandReviewer/CreateReviewers';
import { updateRevisor } from '../../ts/ThesisCoordinatorandReviewer/UpdateReviewers';

/**
 * Interface for the `CrearRevisor` component props
 */
interface CrearRevisorProps {
  onClose: () => void;
  revisor?: any | null;
}

/**
 * Component to create or edit a reviewer.
 * 
 * If a reviewer (`revisor`) is passed as a prop, the component will be used to edit that reviewer.
 * Otherwise, it will be used to create a new reviewer.
 * 
 */
const CrearRevisor: React.FC<CrearRevisorProps> = ({ onClose, revisor }) => {
  const [email, setEmail] = useState(''); // State to hold the email input
  const [name, setName] = useState(''); // State to hold the name input
  const [carnet, setCarnet] = useState(''); // State to hold the carnet (ID) input
  const [isLoading, setIsLoading] = useState(false); // State to manage the loading state

  // Effect hook to populate fields if editing an existing reviewer
  useEffect(() => {
    if (revisor) {
      setEmail(revisor.email || ''); // Set email if editing
      setName(revisor.name || ''); // Set name if editing
      setCarnet(revisor.carnet || ''); // Set carnet if editing
    } else {
      setEmail(''); // Clear email if creating new reviewer
      setName(''); // Clear name if creating new reviewer
      setCarnet(''); // Clear carnet if creating new reviewer
    }
  }, [revisor]);

  /**
   * Function to handle saving the reviewer, either creating or updating
   */
  const handleSave = async () => {
    if (!email || !name || !carnet) return; // Validation to ensure all fields are filled
    setIsLoading(true); // Set loading state to true while saving

    try {
      if (revisor) {
        // Update the existing reviewer if `revisor` is passed
        await updateRevisor(revisor.user_id, { email, name, codigo: carnet });
      } else {
        // Create a new reviewer if no `revisor` is passed
        await creaRevisor({ email, name, codigo: carnet });
      }

      // Success message with SweetAlert2
      Swal.fire({
        title: 'Éxito', // Success title
        text: `Revisor ${revisor ? 'actualizado' : 'creado'} correctamente`, // Success message
        icon: 'success',
        confirmButtonText: 'OK', // Confirmation button text
        confirmButtonColor: '#28a745', // Green success button color
      }).then(() => onClose()); // Close modal after successful operation
    } catch (error) {
      // Error handling with SweetAlert2
      Swal.fire({
        title: 'Error', // Error title
        text: error instanceof Error ? error.message : 'Error desconocido', // Error message
        icon: 'error',
        confirmButtonText: 'OK', // Confirmation button text
        confirmButtonColor: '#dc3545', // Red error button color
      });
    } finally {
      setIsLoading(false); // Reset loading state after operation
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-8 bg-white dark:bg-boxdark rounded-xl shadow-lg w-full max-w-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        <h2 className="text-xl font-bold mb-6 text-black dark:text-white">
          {revisor ? 'Editar Revisor' : 'Crear Revisor'} {/* Title of the form */}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-white">Correo:</label>
            <input
              type="email"
              id="email"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@miumg.edu.gt" // Placeholder text
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-white">Nombre:</label>
            <input
              type="text"
              id="name"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del revisor" // Placeholder text
            />
          </div>
          <div>
            <label htmlFor="carnet" className="block text-gray-700 dark:text-white">Carnet:</label>
            <input
              type="text"
              id="carnet"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              placeholder="Carnet del revisor" // Placeholder text
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}
          >
            Cancelar {/* Cancel button text */}
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!(email && name && carnet) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}
            disabled={!(email && name && carnet) || isLoading} // Disable button if fields are empty or loading
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mx-auto"></div> // Spinner when loading
            ) : (
              revisor ? 'Actualizar' : 'Crear Revisor' // Button text changes based on operation
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearRevisor;
