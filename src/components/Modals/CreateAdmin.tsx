import React, { useState } from 'react';
import { createAdmin } from '../../ts/HeadquartersCoordinator/CreateAdmin';
import Swal from 'sweetalert2';

/**
 * Props for the CreateAdmin modal component.
 */
interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminCreated: () => Promise<void>;
}

/**
 * Modal component to create a new admin.
 *
 * Displays a form where users can input the admin's name, email, and "carnet".
 * On successful submission, it calls the `createAdmin` service and shows an alert.
 *
 */
const CreateAdmin: React.FC<CreateAdminModalProps> = ({ isOpen, onClose, onAdminCreated }) => {
  // States for managing form inputs
  const [adminUserName, setAdminUserName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminCarnet, setAdminCarnet] = useState('');

  /**
   * Handles the admin creation form submission.
   *
   * Sends the input data to the createAdmin service and handles
   * UI feedback such as alerts and form reset.
   *
   */
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the createAdmin API
      await createAdmin({
        email: adminEmail,
        name: adminUserName,
        carnet: adminCarnet,
      });

      // Display success alert
      Swal.fire({
        icon: 'success',
        title: 'Administrador creado',
        text: `El administrador ${adminUserName} ha sido creado exitosamente.`,
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Aceptar',
      });

      // Refresh the list of admins
      await onAdminCreated();

      // Reset form and close modal
      setAdminUserName('');
      setAdminEmail('');
      setAdminCarnet('');
      onClose();
    } catch (error: any) {
      // Display error alert if creation fails
      Swal.fire({
        icon: 'error',
        title: 'Error al crear administrador',
        text: error.message,
        confirmButtonColor: '#FF5A5F',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  // If modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Crear Administrador</h3>
        <form onSubmit={handleCreateAdmin}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white" htmlFor="adminUserName">
              Nombre
            </label>
            <input
              id="input-nombre"
              type="text"
              className="w-full p-2 border rounded"
              value={adminUserName}
              onChange={(e) => setAdminUserName(e.target.value)}
              placeholder="Ingresa el nombre completo"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white" htmlFor="adminEmail">
              Correo Electrónico
            </label>
            <input
              id="input-email"
              type="email"
              className="w-full p-2 border rounded"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Ingresa el correo electrónico"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white" htmlFor="adminCarnet">
              Código
            </label>
            <input
              id="input-carnet"
              type="text"
              className="w-full p-2 border rounded"
              value={adminCarnet}
              onChange={(e) => setAdminCarnet(e.target.value)}
              placeholder="Ingresa el Código"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              type="button"
            >
              Cancelar
            </button>
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

export default CreateAdmin;
