import React, { useState } from 'react';

// Componente para el Modal de Crear Sede
interface ModalCrearSedeProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSede: (nombre: string, direccion: string) => void;
}

const CrearSedes: React.FC<ModalCrearSedeProps> = ({ isOpen, onClose, onCreateSede }) => {
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedeDireccion, setSedeDireccion] = useState('');

  const handleCreateSede = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSede(sedeNombre, sedeDireccion);
    setSedeNombre('');
    setSedeDireccion('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Crear Nueva Sede
        </h3>
        <form onSubmit={handleCreateSede}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">
              Nombre de la Sede
            </label>
            <input
              type="text"
              value={sedeNombre}
              onChange={(e) => setSedeNombre(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">
              Dirección de la Sede
            </label>
            <input
              type="text"
              value={sedeDireccion}
              onChange={(e) => setSedeDireccion(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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

export default CrearSedes;
