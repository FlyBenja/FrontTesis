import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface LocationState {
  courseTitle: string;
}

const InfoCurso: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { courseTitle } = location.state as LocationState;

  // Determinar los capítulos según el curso
  const chapters = courseTitle === "Proyecto de Graduación I"
    ? [1, 2, 3, 4]
    : [5, 6, 7, 8];

  // Función para manejar la navegación a info-capitulo
  const handleNavigateToCapitulo = (chapterNumber: number) => {
    navigate('/estudiantes/info-capitulo', {
      state: { chapterNumber },
    });
  };

  return (
    <>
      <Breadcrumb pageName={courseTitle} />

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
        {/* Listado de capítulos */}
        <ul className="space-y-4">
          {chapters.map((chapter) => (
            <li
              key={chapter}
              onClick={() => handleNavigateToCapitulo(chapter)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 transition-transform transform hover:scale-105 cursor-pointer"
            >
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Capítulo {chapter}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default InfoCurso;
