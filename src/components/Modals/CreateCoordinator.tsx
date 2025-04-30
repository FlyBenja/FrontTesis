import React, { useState } from 'react';

/**
 * Interface defining the properties required by the CrearCoordinador component.
 */
interface CreateCoordinatorProps {
  isOpen: boolean; // Indicates if the modal is visible.
  onClose: () => void; // Function to close the modal.
  CreateCoordinator: (codigo: string, nombre: string, correo: string, sedeId: number) => void; // Function to create the coordinator.
}

/**
 * It uses local state to manage form values and invokes a callback function when the form is submitted.
 */
const CreateCoordinator: React.FC<CreateCoordinatorProps> = ({ isOpen, onClose, CreateCoordinator }) => {
  // Local state to store form values for code, name, email, and department ID
  const [codigo, setCodigo] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [sedeId, setSedeId] = useState<number>(1);

  /**
   * Handles the form submission. It checks if all fields are filled, 
   * and if so, it invokes the CreateCoordinator callback with the form values.
   * After submission, it resets the form and closes the modal.
   */
  const handleSubmit = () => {
    if (codigo && nombre && correo) {
      CreateCoordinator(codigo, nombre, correo, sedeId);
      setCodigo('');
      setNombre('');
      setCorreo('');
      setSedeId(1);
      onClose();
    }
  };

  // If the modal is not open, return null to prevent rendering
  if (!isOpen) return null;

  return (
    // Modal container with darkened background to focus attention on the form
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Crear Coordinador</h3>

        {/* Form for creating a coordinator */}
        <div className="mb-4">
          <label htmlFor="codigo" className="block text-sm font-semibold text-black dark:text-white">Código</label>
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-semibold text-black dark:text-white">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="correo" className="block text-sm font-semibold text-black dark:text-white">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sede" className="block text-sm font-semibold text-black dark:text-white">Sede</label>
          <select
            id="sede"
            value={sedeId}
            onChange={(e) => setSedeId(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Dropdown options for selecting a department */}
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {`Departamento ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons for canceling or submitting the form */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black dark:bg-boxdark dark:text-white rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Crear Coordinador
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoordinator;
