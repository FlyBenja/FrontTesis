import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const Cursos: React.FC = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Proyecto de Graduación I",
      description: "Este curso cubre la primera fase del proyecto de graduación, enfocándose en la planificación y diseño.",
    },
    {
      id: 2,
      title: "Proyecto de Graduación II",
      description: "En este curso, completarás el desarrollo y presentación final de tu proyecto de graduación.",
    },
  ];

  // Función para manejar la redirección
  const handleNavigate = () => {
    navigate('/estudiantes/info-curso');
  };

  return (
    <>
      {/* Breadcrumb para indicar la ubicación actual en la aplicación */}
      <Breadcrumb pageName="Cursos" />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-8">
          Listado
        </h1>

        {/* Contenedor de cards centradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          {courses.map((course) => (
            <div
              key={course.id}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 transform transition-transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {course.description}
              </p>
              <button
                onClick={handleNavigate}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Ver más detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Cursos;
