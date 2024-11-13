import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const Propuesta: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file)); // Crear una URL para visualizar el archivo PDF
      setError(null); // Limpiar errores anteriores
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); // Simulación de carga de PDF
    } else {
      setError('Por favor, selecciona un archivo en formato PDF.');
    }
  };

  return (
    <>
      {/* Breadcrumb para indicar la ubicación actual en la aplicación */}
      <Breadcrumb pageName="Propuesta" />

      <div className="max-w-7xl mx-auto p-0 space-y-8">
        
        {/* Contenedor para el área de subida */}
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Subir PDF de Propuesta</h2>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
              {error}
            </div>
          )}

          {/* Botón para subir archivo */}
          <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-500 dark:text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v4h10v-4m-3-8h-4v4H7m6 0v6h3l4-4m-7 4h3M7 4h10v4H7z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-300 text-sm">Haz clic para subir un archivo PDF</p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Nombre del archivo cargado y opción de descarga */}
          {pdfFile && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Archivo seleccionado:</span> {pdfFile.name}
              </p>
              <a
                href={pdfUrl ?? '#'}
                download={pdfFile.name}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Descargar PDF
              </a>
            </div>
          )}
        </div>

        {/* Contenedor para la vista previa del PDF */}
        {pdfUrl && (
          <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Vista previa del PDF:</h3>
            {loading ? (
              <div className="flex items-center justify-center w-full h-[36rem] bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg className="animate-spin h-8 w-8 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : (
              <iframe
                src={pdfUrl}
                title="Vista previa del PDF"
                className="w-full h-[40rem] border border-gray-300 rounded-lg dark:border-gray-600"
              ></iframe>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Propuesta;
