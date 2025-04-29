import React, { useState } from 'react';

/**
 * - `isOpen`: Boolean flag that determines if the modal is visible.
 * - `onClose`: Callback function to close the modal.
 * - `onCreateSede`: Callback function to handle the creation of a new sede (campus).
 */
interface ModalCrearSedeProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSede: (nombre: string, direccion: string) => void;
}

/**
 * It includes two input fields: one for the name and one for the address.
 * The modal can be closed using the `onClose` callback and can trigger the creation of a new sede 
 * through the `onCreateSede` callback when the user submits the form.
 */
const CrearSedes: React.FC<ModalCrearSedeProps> = ({ isOpen, onClose, onCreateSede }) => {
  // State hooks to manage the form input values
  const [sedeNombre, setSedeNombre] = useState(''); // State for the 'nombre' of the sede
  const [sedeDireccion, setSedeDireccion] = useState(''); // State for the 'direccion' of the sede

  /**
   * It calls the `onCreateSede` function passed as a prop, resets the form fields, and prevents 
   * the default form submission behavior.
   */
  const handleCreateSede = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    onCreateSede(sedeNombre, sedeDireccion); // Calls the onCreateSede prop with the entered values
    setSedeNombre(''); // Resets the name input field
    setSedeDireccion(''); // Resets the address input field
  };

  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  return (
    // Modal container with fixed position to center it in the screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      {/* Modal content container */}
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-sm w-full">
        {/* Modal title */}
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Crear Nueva Sede
        </h3>

        {/* Form to create the new sede */}
        <form onSubmit={handleCreateSede}>
          {/* Sede name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">
              Nombre de la Sede
            </label>
            <input
              type="text"
              value={sedeNombre}
              onChange={(e) => setSedeNombre(e.target.value)} // Updates the 'sedeNombre' state when input changes
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Sede address input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">
              Dirección de la Sede
            </label>
            <input
              type="text"
              value={sedeDireccion}
              onChange={(e) => setSedeDireccion(e.target.value)} // Updates the 'sedeDireccion' state when input changes
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Modal footer with Cancel and Create buttons */}
          <div className="flex justify-end">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose} // Calls onClose to close the modal
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>

            {/* Submit button to create the new sede */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearSedes;
