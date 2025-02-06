import axios from 'axios';

// Asynchronous function to get notifications data from the API
export const getNotificationsAdmin = async (sede_id: number): Promise<{ notification_id: number; message: string }[]> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');  // If token is not found, throw an error
    }

    // Make the GET request to the specified URL to get the notifications data
    const response = await axios.get(`http://localhost:3000/api/admin/notifications/${sede_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the token in the authorization header
        'Content-Type': 'application/json',  // Set the content type as JSON
      },
    });

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle errors
    if (axios.isAxiosError(error)) {
      // If it's an Axios error, extract and throw the error message
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)  // If response contains data, stringify it
        : 'Error desconocido';  // Otherwise, use a default error message
      throw new Error(errorMessage);
    }

    // If it's a general error, throw a generic error message
    throw new Error('Error desconocido');
  }
};
