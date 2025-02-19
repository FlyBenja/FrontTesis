import React, { useState } from 'react';

interface AsignaRevisorProps {
  onClose: () => void;
}

const AsignaRevisor: React.FC<AsignaRevisorProps> = ({ onClose }) => {
  const [selectedRevisor, setSelectedRevisor] = useState<string>('');

  const handleSave = () => {
    // Lógica para guardar el revisor seleccionado
    console.log(`Revisor asignado: ${selectedRevisor}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white dark:bg-boxdark rounded shadow-lg w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Asignar Revisor</h2>
        <div className="mt-4">
          <label htmlFor="revisor" className="block text-gray-700 dark:text-white">Selecciona un revisor:</label>
          <select
            id="revisor"
            className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded w-full bg-white dark:bg-gray-800 text-black dark:text-white"
            value={selectedRevisor}
            onChange={(e) => setSelectedRevisor(e.target.value)}
          >
            <option value="">Seleccione un revisor</option>
            <option value="revisor1">Revisor 1</option>
            <option value="revisor2">Revisor 2</option>
            <option value="revisor3">Revisor 3</option>
            <option value="revisor4">Revisor 4</option>
            <option value="revisor5">Revisor 5</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!selectedRevisor ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}
            disabled={!selectedRevisor}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignaRevisor;
