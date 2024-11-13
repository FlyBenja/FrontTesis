import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface LocationState {
  chapterNumber: number;
}

const InfoCapitulo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterNumber } = location.state as LocationState;

  // Lista de versiones ordenada de la más reciente a la más antigua
  const versions = [
    `Versión 4 - Capítulo ${chapterNumber}`,
    `Versión 3 - Capítulo ${chapterNumber}`,
    `Versión 2 - Capítulo ${chapterNumber}`,
    `Versión 1 - Capítulo ${chapterNumber}`,
  ];

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  // Función para abrir el detalle de la versión seleccionada
  const handleOpenDetail = (version: string) => {
    setSelectedVersion(version);
  };

  // Función para cerrar el detalle
  const handleCloseDetail = () => {
    setSelectedVersion(null);
  };

  return (
    <>
      <Breadcrumb pageName={`Capítulo ${chapterNumber}`} />

      {/* Botón de retroceder */}
      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-all"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Listado de versiones */}
        <ul className="space-y-4">
          {versions.map((version, index) => (
            <li
              key={index}
              onClick={() => handleOpenDetail(version)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 transition-transform transform hover:scale-105 cursor-pointer flex justify-between items-center"
            >
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {version}
              </span>
              <span className="text-blue-600 dark:text-blue-400">Ver detalle</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para mostrar detalles de la versión seleccionada */}
      {selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Detalles de {selectedVersion}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Aquí puedes incluir los detalles específicos sobre {selectedVersion}. Puede incluir una descripción más extensa, información adicional, u otros datos relevantes.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoCapitulo;
