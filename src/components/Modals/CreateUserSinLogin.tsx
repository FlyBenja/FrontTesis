import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createUserSinLogin } from '../../ts/Administrador/CreateUserSinLogin';

interface CrearUsuarioProps {
  onClose: () => void;
  usuario?: any | null;
}

const ModalCreateUserSinLogin: React.FC<CrearUsuarioProps> = ({ onClose, usuario }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [carnet, setCarnet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!email || !name || !carnet) return;
    setIsLoading(true);

    try {
      await createUserSinLogin({ email, name, carnet });
      
      Swal.fire({
        title: 'Éxito',
        text: 'Usuario creado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
      }).then(() => onClose());
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error desconocido',
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
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        <h2 className="text-xl font-bold mb-6 text-black dark:text-white">
          {usuario ? 'Editar Usuario' : 'Crear Usuario'}
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
              placeholder="ejemplo@miumg.edu.gt"
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
              placeholder="Nombre del usuario"
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
              placeholder="Carnet del usuario"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!(email && name && carnet) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}
            disabled={!(email && name && carnet) || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mx-auto"></div>
            ) : (
              usuario ? 'Actualizar' : 'Crear Usuario'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateUserSinLogin;
