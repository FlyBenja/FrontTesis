import axios from 'axios';

// Define the interface for the "Estudiante" (student) structure
interface Estudiante {
  id: number;           // Unique identifier for the student
  userName: string;     // The username of the student (changed from 'nombre' to 'userName')
  carnet: string;       // Student's carnet (ID)
  curso: string;        // Course the student is enrolled in
  año: number;          // Year of enrollment
  fotoPerfil: string;   // Profile photo URL or empty string if no photo is available
}

// Function to fetch students based on their campus (sede), course, and year
export const getEstudiantes = async (
  sedeId: number,       // ID of the campus (sede) where the students are located
  courseId: number,     // ID of the course the students are enrolled in
  nameYear: number      // Year to filter the students by
): Promise<Estudiante[]> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');  // If the token is not found, throw an error
    }

    // Make the GET request to the specified URL to fetch the students
    const response = await axios.get(
      `http://localhost:3000/api/sedes/${sedeId}/cursos/${courseId}/estudiantes/${nameYear}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the authorization token in the request headers
          'Content-Type': 'application/json',  // Specify that the content type is JSON
        },
      }
    );

    // Check if the response contains the "users" property and if "users" is an array
    if (response.data && Array.isArray(response.data.users)) {
      // Map through the users and return the student data in the Estudiante structure
      return response.data.users.map((user: any) => ({
        id: user.user_id,                  // Assign the user's unique ID
        userName: user.userName,           // Assign the username (changed from 'nombre' to 'userName')
        carnet: user.carnet,               // Assign the student's carnet (ID)
        curso: user.curso,                 // Assign the student's course
        año: user.año,                     // Assign the year of enrollment
        fotoPerfil: user.profilePhoto || '',  // If no profile photo, assign an empty string
      }));
    }

    // If the response does not contain a valid "users" array, throw an error
    throw new Error('La respuesta no contiene datos de estudiantes válidos.');
  } catch (error) {
    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)  // If the error has a response, stringify it
        : 'Error desconocido';                   // Otherwise, return a generic unknown error message
      throw new Error(`Error de la API: ${errorMessage}`);
    }

    // If the error is not an Axios error, throw a generic unknown error
    throw new Error('Error desconocido');
  }
};
