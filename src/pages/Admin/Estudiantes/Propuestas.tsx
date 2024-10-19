import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Propuesta {
  id: number;
  titulo: string;
  descripcion: string;
  aprobada: boolean;
}

const Propuestas: React.FC = () => {
  const navigate = useNavigate();
  const [propuestas, setPropuestas] = useState<Propuesta[]>([
    {
      id: 1,
      titulo: 'Propuesta 1',
      descripcion: 'Descripción detallada de la propuesta 1.',
      aprobada: false,
    },
    {
      id: 2,
      titulo: 'Propuesta 2',
      descripcion: 'Descripción detallada de la propuesta 2.',
      aprobada: false,
    },
    {
      id: 3,
      titulo: 'Propuesta 3',
      descripcion: 'Descripción detallada de la propuesta 3.',
      aprobada: false,
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const toggleAprobarPropuesta = (id: number) => {
    setPropuestas((prevPropuestas) =>
      prevPropuestas.map((propuesta) =>
        propuesta.id === id
          ? { ...propuesta, aprobada: !propuesta.aprobada }
          : propuesta
      )
    );
  };

  return (
    <>
      <Breadcrumb pageName="Propuestas del Estudiante" />

      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="space-y-4">
          {propuestas.map((propuesta) => (
            <div
              key={propuesta.id}
              className={`cursor-pointer rounded-lg shadow-md p-4 ${
                propuesta.aprobada ? 'bg-green-500' : 'bg-white dark:bg-boxdark'
              }`}
              onClick={() => toggleDropdown(propuesta.id)}
            >
              <div className="flex justify-between items-center">
                <h4
                  className={`text-lg font-semibold ${
                    propuesta.aprobada ? 'text-white' : 'text-black dark:text-white'
                  }`}
                >
                  {propuesta.titulo}
                </h4>

                <span
                  className={`text-sm ${
                    propuesta.aprobada ? 'text-white' : 'text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {activeDropdown === propuesta.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                </span>
              </div>

              {activeDropdown === propuesta.id && (
                <div
                  className={`mt-2 p-2 rounded-lg ${
                    propuesta.aprobada ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      propuesta.aprobada ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {propuesta.descripcion}
                  </p>
                  <button
                    className={`mt-2 px-4 py-2 rounded-md text-white ${
                      propuesta.aprobada ? 'bg-green-700' : 'bg-blue-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAprobarPropuesta(propuesta.id);
                    }}
                  >
                    {propuesta.aprobada ? 'Desaprobar' : 'Aprobar'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Propuestas;
