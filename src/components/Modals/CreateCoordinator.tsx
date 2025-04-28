import React, { useState } from 'react';

interface CrearCoordinadorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCoordinador: (codigo: string, nombre: string, correo: string, sedeId: number) => void;
}

const CrearCoordinador: React.FC<CrearCoordinadorProps> = ({ isOpen, onClose, onCreateCoordinador }) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [sedeId, setSedeId] = useState<number>(1);

  const handleSubmit = () => {
    if (codigo && nombre && correo) {
      onCreateCoordinador(codigo, nombre, correo, sedeId);
      setCodigo('');
      setNombre('');
      setCorreo('');
      setSedeId(1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Crear Coordinador</h3>

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
            <option value={1}>Departamento 1</option>
            <option value={2}>Departamento 2</option>
            <option value={3}>Departamento 3</option>
            <option value={4}>Departamento 4</option>
            <option value={5}>Departamento 5</option>
            <option value={6}>Departamento 6</option>
            <option value={7}>Departamento 7</option>
            <option value={8}>Departamento 8</option>
            <option value={9}>Departamento 9</option>
            <option value={10}>Departamento 10</option>
          </select>
        </div>

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

export default CrearCoordinador;
