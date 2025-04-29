import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createUserSinLogin } from '../../ts/Administrator/CreateUserWithoutLogin';

/**
 * Props for the ModalCreateUserSinLogin component.
 */
interface CrearUsuarioProps {
  /** Callback function to close the modal */
  onClose: () => void;
  /** Optional user object for editing an existing user */
  usuario?: any | null;
}

/**
 * Modal component for creating or editing a user without login.
 * 
 */
const ModalCreateUserSinLogin: React.FC<CrearUsuarioProps> = ({ onClose, usuario }) => {
  // States for email, name, and carnet
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [carnet, setCarnet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Effect hook to populate fields if editing an existing user
  useEffect(() => {
    if (usuario) {
      setEmail(usuario.email || '');
      setName(usuario.name || '');
      setCarnet(usuario.carnet || '');
    } else {
      setEmail('');
      setName('');
      setCarnet('');
    }
  }, [usuario]);

  /**
   * Handles saving the user. Creates or updates the user depending on whether `usuario` exists.
   * Shows a success or error alert after the operation.
   */
  const handleSave = async () => {
    // Validation to ensure all fields are filled
    if (!email || !name || !carnet) return;
    setIsLoading(true);

    try {
      // Attempt to create or update user
      await createUserSinLogin({ email, name, carnet });
      
      // Success alert
      Swal.fire({
        title: 'Éxito', // Success
        text: 'Usuario creado correctamente', // User created successfully
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
      }).then(() => onClose());
    } catch (error) {
      // Error alert
      Swal.fire({
        title: 'Error', // Error
        text: error instanceof Error ? error.message : 'Error desconocido', // Unknown error
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-8 bg-white dark:bg-boxdark rounded-xl shadow-lg w-full max-w-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-6 text-black dark:text-white">
          {usuario ? 'Editar Usuario' : 'Crear Usuario'} {/* Create or Edit User */}
        </h2>

        <div className="space-y-4">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-white">Correo:</label> {/* Email */}
            <input
              type="email"
              id="email"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@miumg.edu.gt"
            />
          </div>

          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-white">Nombre:</label> {/* Name */}
            <input
              type="text"
              id="name"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del usuario" /* User's name */
            />
          </div>

          {/* Carnet input */}
          <div>
            <label htmlFor="carnet" className="block text-gray-700 dark:text-white">Carnet:</label> {/* Carnet */}
            <input
              type="text"
              id="carnet"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              placeholder="Carnet del usuario" /* User's carnet */
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          {/* Cancel button */}
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}
          >
            Cancelar {/* Cancel */}
          </button>

          {/* Save button */}
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!(email && name && carnet) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}
            disabled={!(email && name && carnet) || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mx-auto"></div>
            ) : (
              usuario ? 'Actualizar' : 'Crear Usuario' /* Update or Create User */
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateUserSinLogin;
