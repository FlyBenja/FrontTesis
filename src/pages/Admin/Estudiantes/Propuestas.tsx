import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Propuesta {
  id: number;
  titulo: string;
}

const Propuestas: React.FC = () => {
  const navigate = useNavigate();
  const [propuestas] = useState<Propuesta[]>([
    { id: 1, titulo: 'Propuesta 1' },
    { id: 2, titulo: 'Propuesta 2' },
    { id: 3, titulo: 'Propuesta 3' },
  ]);
  const [selectedPropuesta, setSelectedPropuesta] = useState<number | null>(null);
  const [aprobadaPropuesta, setAprobadaPropuesta] = useState<number | null>(null);

  const handleSelectPropuesta = (id: number) => {
    if (aprobadaPropuesta === null) {
      setSelectedPropuesta(id);
    }
  };

  const handleAprobarPropuesta = () => {
    if (selectedPropuesta !== null) {
      setAprobadaPropuesta(selectedPropuesta);
      setSelectedPropuesta(null);
    }
  };

  const pdfFile = '/Formato_Propuesta_Tesis.pdf';

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
        <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Seleccione una Propuesta
          </h3>
          <div className="space-y-3">
            {propuestas.map((propuesta) => (
              <div
                key={propuesta.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                  aprobadaPropuesta === propuesta.id
                    ? 'bg-green-500 text-white'
                    : selectedPropuesta === propuesta.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleSelectPropuesta(propuesta.id)}
              >
                <input
                  type="radio"
                  checked={selectedPropuesta === propuesta.id}
                  onChange={() => handleSelectPropuesta(propuesta.id)}
                  className="mr-2 cursor-pointer"
                  disabled={aprobadaPropuesta !== null}
                />
                <label className="cursor-pointer">{propuesta.titulo}</label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              className={`w-full px-4 py-3 rounded-md text-white transition ${
                selectedPropuesta === null
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleAprobarPropuesta}
              disabled={selectedPropuesta === null}
            >
              Aprobar Propuesta
            </button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Visualización de Documento PDF
          </h3>
          <iframe
            src={pdfFile}
            title="Vista PDF"
            className="w-full h-[600px] rounded-md shadow-sm"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Propuestas;
