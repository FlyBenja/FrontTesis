import axios from 'axios';

// Asynchronous function to create a Thesis Coordinator
export const createThesisCoordinator = async (name: string, email: string, carnet: string): Promise<void> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Make the POST request to create the Thesis Coordinator
    await axios.post(
      'http://3.211.255.190/api-docs/api/createCorThesis',
      { name, email, carnet },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      throw new Error(errorMessage);
    }
    throw new Error('Error desconocido');
  }
};
