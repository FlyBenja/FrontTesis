import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const Capitulos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [comentario, setComentario] = useState<string>('');
  const tarea = location.state?.tarea;

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

  const handleEnviarComentario = () => {
    console.log('Comentario enviado:', comentario);
    setComentario('');
  };

  return (
    <>
      <Breadcrumb pageName="Capítulo Detalles" />

      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">{tarea?.titulo}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tarea?.descripcion}</p>

          <div className="flex justify-between items-center mb-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Colocar Punteo
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-auto">
              Descargar Documento
            </button>
          </div>

          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enviar Comentario</h4>
          <div className="relative">
            <textarea
              value={comentario}
              onChange={handleComentarioChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
              placeholder="Escribe tu comentario aquí..."
            />
            <button
              className="absolute bottom-4 right-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleEnviarComentario}
            >
              Enviar Comentario
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Capitulos;
