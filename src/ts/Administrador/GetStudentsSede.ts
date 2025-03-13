import axios from 'axios';

// Function to retrieve the total number of students for a specific sede (location)
export const getStudentsSede = async (sedeId: number): Promise<{ totalStudents: number; totalStudentsSede: number }> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If no token is found, throw an error indicating authentication failure
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Define the URL for the GET request, using the provided sedeId
    const url = `http://localhost:3000/api/graphics/data/${sedeId}`;
    
    // Make the GET request to the API with the appropriate headers
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors that may occur during the request
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Error desconocido');
    } else {
      throw new Error('Error inesperado');
    }
  }
};
