import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SwitcherFour from '../../components/Switchers/SwitcherFour';

const Revisores: React.FC = () => {
  const [revisores, setRevisores] = useState([
    { id: 1, nombre: 'Cleopatra Rivera Enríquez', correo: 'clea@gmail.com', activo: true },
    { id: 2, nombre: 'Gavina Blanco Pichardo', correo: 'gblanco@gmail.com', activo: false },
    { id: 3, nombre: 'Merlina Sedillo Rentería', correo: 'msedillo@miumg.edu.gt', activo: true },
  ]);

  const toggleRevisor = (id: number) => {
    setRevisores((prevRevisores) =>
      prevRevisores.map((revisor) =>
        revisor.id === id ? { ...revisor, activo: !revisor.activo } : revisor
      )
    );
  };

  return (
    <>
      <Breadcrumb pageName="Revisores o auxiliares" />
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
            Nuevo revisor
            <span className="ml-2">👤</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border px-2 py-1 text-gray-900 dark:text-white">No.</th>
                <th className="border px-2 py-1 text-gray-900 dark:text-white">Nombre del revisor</th>
                <th className="border px-2 py-1 text-gray-900 dark:text-white">Correo</th>
                <th className="border px-2 py-1 text-gray-900 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {revisores.map((revisor) => (
                <tr key={revisor.id} className="border">
                  <td className="border px-2 py-1 text-center text-gray-900 dark:text-white">{revisor.id}</td>
                  <td className="border px-2 py-1 text-gray-900 dark:text-white">{revisor.nombre}</td>
                  <td className="border px-2 py-1 text-gray-900 dark:text-white underline text-blue-600">{revisor.correo}</td>
                  <td className="border px-2 py-1 text-center flex items-center justify-center space-x-2">
                    <button className="px-2 py-1 bg-yellow-300 text-black rounded-md">Editar</button>
                    <SwitcherFour 
                      enabled={revisor.activo} 
                      onChange={() => toggleRevisor(revisor.id)} 
                      uniqueId={`revisor-${revisor.id}`} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Revisores;
