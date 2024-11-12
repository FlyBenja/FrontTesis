import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Version {
  id: number;
  comentario: string;
  punteo: number | null;
  fecha: string;
}

const Capitulos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tarea = location.state?.tarea;

  const [comentario, setComentario] = useState<string>('');
  const [punteo, setPunteo] = useState<number | null>(null);
  const [historial, setHistorial] = useState<Version[]>([
    { id: 1, comentario: '', punteo: null, fecha: new Date().toLocaleDateString() },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const versionsPerPage = 3;
  const [maxPageButtons] = useState(10);

  const totalPages = Math.ceil(historial.length / versionsPerPage);

  // Ordenar las versiones de más reciente a más antigua
  const sortedHistorial = [...historial].sort((a, b) => b.id - a.id);

  // Obtener las versiones para la página actual
  const currentVersions = sortedHistorial.slice(
    (currentPage - 1) * versionsPerPage,
    currentPage * versionsPerPage
  );

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

  const handlePunteoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPunteo(Number(e.target.value));
  };

  const handleEnviarComentario = (versionId: number) => {
    setHistorial((prevHistorial) =>
      prevHistorial.map((version) =>
        version.id === versionId ? { ...version, comentario, punteo } : version
      )
    );
    setComentario('');
    setPunteo(null);
  };

  const handleCrearNuevaVersion = () => {
    const nuevaVersion: Version = {
      id: historial.length + 1,
      comentario: '',
      punteo: null,
      fecha: new Date().toLocaleDateString(),
    };
    setHistorial((prevHistorial) => [...prevHistorial, nuevaVersion]);
    setComentario('');
    setPunteo(null);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Breadcrumb pageName="Capítulo Detalles" />

      <div className="mb-4 flex justify-between">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handleCrearNuevaVersion}
        >
          Crear Nueva Versión
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">{tarea?.titulo}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tarea?.descripcion}</p>

          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Historial de Versiones</h4>

          <div className="space-y-6">
            {currentVersions.map((version) => (
              <div key={version.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold text-black dark:text-white">
                    Versión {version.id} - {version.fecha}
                  </h5>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Punteo</label>
                  <input
                    type="number"
                    value={version.id === sortedHistorial[0].id ? punteo || '' : version.punteo || ''}
                    onChange={handlePunteoChange}
                    disabled={version.id !== sortedHistorial[0].id}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comentario</label>
                  <textarea
                    value={version.id === sortedHistorial[0].id ? comentario : version.comentario}
                    onChange={handleComentarioChange}
                    disabled={version.id !== sortedHistorial[0].id}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {version.id === sortedHistorial[0].id && (
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => handleEnviarComentario(version.id)}
                  >
                    Enviar Comentario
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePreviousPage}
              className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
              disabled={currentPage === 1}
            >
              &#8592;
            </button>

            {renderPaginationButtons()}

            <button
              onClick={handleNextPage}
              className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
              disabled={currentPage === totalPages}
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Capitulos;
