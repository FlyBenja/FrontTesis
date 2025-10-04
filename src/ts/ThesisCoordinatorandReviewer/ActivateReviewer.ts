import axios from 'axios';

// Define the structure of the response from the API when activating a thesis coordinator
interface ActivateReviewerResponse {
  message: string;
}

// Function to activate or deactivate a Thesis Coordinator by user ID
export const activateReviewer = async (
  userId: number // The ID of the thesis coordinator to toggle activation status
): Promise<ActivateReviewerResponse> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Make a POST request to toggle the active status of the Thesis Coordinator
    const response = await axios.post(
      'http://3.211.255.190/api-docs/api/reviewers/toggle',
      { user_id: userId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the message from the response
    return { message: response.data.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      throw new Error(errorMessage);
    }
    throw new Error('Error desconocido');
  }
};
