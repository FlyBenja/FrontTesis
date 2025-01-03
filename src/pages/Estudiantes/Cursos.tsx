import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil'; // Asegúrate de que el path sea correcto
import { getCursos } from '../../ts/Generales/GetCursos'; // Asegúrate de que el path sea correcto

const Cursos: React.FC = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar la redirección con el título del curso
  const handleNavigate = (courseTitle: string, courseId: number) => {
    navigate('/estudiantes/info-curso', { state: { courseTitle, courseId } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del perfil
        const perfilData = await getDatosPerfil();
        const sedeId = perfilData.sede;

        // Obtener cursos para la sede obtenida
        const currentYear = new Date().getFullYear();
        const cursos = await getCursos(sedeId, currentYear);

        // Mapeamos los cursos y los dejamos con las descripciones originales
        const updatedCourses = cursos.map((course) => {
          let description = '';
          if (course.course_id === 1) {
            description = "Este curso cubre la primera fase del proyecto de graduación, enfocándose en la planificación y diseño.";
          } else if (course.course_id === 2) {
            description = "En este curso, completarás el desarrollo y presentación final de tu proyecto de graduación.";
          }

          return {
            ...course,
            description: description,
          };
        });

        setCourses(updatedCourses);
        setLoading(false);
      } catch (err: any) {
        setError('Hubo un error al recuperar los datos.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {/* Breadcrumb para indicar la ubicación actual en la aplicación */}
      <Breadcrumb pageName="Cursos" />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-8">
          Listado de Cursos
        </h1>

        {/* Contenedor de cards centradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 transform transition-transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {course.courseName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {course.description}
              </p>
              <button
                onClick={() => handleNavigate(course.courseName, course.course_id)}
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
