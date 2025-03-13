import axios from 'axios';

// Interface for the response message from the API
export interface ResponseMessage {
  message: string;  // The message returned by the API
}

// Asynchronous function to delete an admin by user ID and sede ID
export const deleteAdmin = async (userId: number, sedeId: number): Promise<ResponseMessage> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');  // If token is not found, throw an error
    }

    // Make the PUT request to the API endpoint to remove the admin
    const response = await axios.put(
      'http://localhost:3000/api/admin/remove',  // API endpoint for removing the admin
      {
        user_id: userId,  // The ID of the user to be removed
        sede_id: sedeId,   // The ID of the 'sede' (location or department) where the admin is located
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token in the authorization header
          'Content-Type': 'application/json',   // Set content type to JSON
        }
      }
    );

    // Return the response data, which contains the message
    return response.data;
  } catch (error: any) {
    // Error handling
    if (axios.isAxiosError(error) && error.response) {
      // If it's an Axios error and the response contains a message, throw the message as an error
      const errorMessage = error.response.data?.message;
      throw new Error(errorMessage);
    }

    // If it's not an Axios error, throw a generic error message
    throw new Error('Error al eliminar el administrador');
  }
};
