import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil'; 
import { getCursos } from '../../ts/Generales/GetCursos'; 

const Cursos: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function to redirect users

  // States to hold course data, loading state, and error message
  const [courses, setCourses] = useState<any[]>([]); // Array to store the courses
  const [loading, setLoading] = useState(true); // Boolean to track the loading state
  const [error, setError] = useState<string | null>(null); // Store error message in case of failure

  // Function to handle navigation when a user clicks on a course title
  const handleNavigate = (courseTitle: string, courseId: number) => {
    navigate('/estudiantes/info-curso', { state: { courseTitle, courseId } }); // Navigate to course details page with course title and ID
  };

  useEffect(() => {
    // Fetch course data once the component is mounted
    const fetchData = async () => {
      try {
        // Fetch profile data (including sedeId)
        const perfilData = await getDatosPerfil();
        const sedeId = perfilData.sede; // Get the sedeId from the profile data

        // Get courses based on the current year and sedeId
        const currentYear = new Date().getFullYear();
        const cursos = await getCursos(sedeId, currentYear); // Fetch courses for the given sede and current year

        // Update the courses with descriptions based on the course_id
        const updatedCourses = cursos.map((course) => {
          let description = '';
          // Adding descriptions based on course ID
          if (course.course_id === 1) {
            description = "Este curso cubre la primera fase del proyecto de graduación, enfocándose en la planificación y diseño.";
          } else if (course.course_id === 2) {
            description = "En este curso, completarás el desarrollo y presentación final de tu proyecto de graduación.";
          }

          return {
            ...course,
            description: description, // Add the description to the course
          };
        });

        setCourses(updatedCourses); // Set the courses in the state
        setLoading(false); // Set loading to false when data is fetched
      } catch (err: any) {
        setError('Hubo un error al recuperar los datos.'); // Handle error and set error message
        setLoading(false); // Set loading to false even if there is an error
        console.error(err); // Log the error to the console
      }
    };

    fetchData(); // Execute the fetch data function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there was a problem fetching the data
  }

  return (
    <>
      {/* Breadcrumb to show the current location in the app */}
      <Breadcrumb pageName="Cursos" />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-8">
          Listado de Cursos
        </h1>

        {/* Container for the courses cards, center aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 transform transition-transform hover:scale-105"
            >
              {/* Display course name */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {course.courseName}
              </h2>
              {/* Display course description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {course.description}
              </p>
              {/* Button to navigate to more details of the course */}
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
