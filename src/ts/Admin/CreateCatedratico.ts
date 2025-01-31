import axios from 'axios';
import Swal from 'sweetalert2';

// Function to create a professor by sending a POST request
export const createCatedratico = async (catedraticoData: { 
  email: string;  // Email of the professor
  name: string;   // Name of the professor
  carnet: string; // Carnet (ID) of the professor
  sede_id: number; // Campus ID where the professor belongs
  year: number;   // Year of the professor's appointment or registration
}): Promise<void> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If the token is not found, throw an error
    if (!token) {
      throw new Error('Token de autenticación no encontrado');  // Error message for missing authentication token
    }

    // Send a POST request to the specified URL to create the professor
    await axios.post('http://localhost:3000/api/create/professor', catedraticoData, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the authorization token in the request header
        'Content-Type': 'application/json',   // Specify the content type as JSON
      },
    });

    // If the request is successful, no console statement will be shown
    // (removed console.log for cleaner code)

  } catch (error) {
    // Error handling for any issues that occur during the request
    if (axios.isAxiosError(error)) {
      // Extract the error message from the API response if available
      const errorMessage = error.response?.data?.message || 'Error desconocido';  // Use the response message or a default message

      // Use SweetAlert2 to display an error popup to the user
      Swal.fire({
        icon: 'error',    // Icon to display in the alert
        title: 'Error',   // Title of the alert
        text: errorMessage,  // The message to display
      });
    } else {
      // If the error is not an Axios error, throw it again
      throw error;  // Rethrow non-Axios errors
    }
  }
};
