import axios from 'axios';

// Function to submit a task
export const entregarTarea = async (taskData: { user_id: number; task_id: number }) => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');

    // If no token is found, throw an error
    if (!token) throw new Error('Token de autenticación no encontrado'); // Authentication token not found

    // Make a POST request to submit the task
    await axios.post('https://api.onlineproject.online/api/task-submissions', taskData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the authentication token in the request headers
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
    });

  } catch (error: any) {
    // Error handling
    if (axios.isAxiosError(error)) {
      // If the error is an Axios error, extract and throw the error message from the API response
      const errorMessage = error.response?.data?.message || 'Error desconocido al enviar la tarea'; // Unknown error if no specific message is found
      throw new Error(errorMessage);
    } else {
      // If it's not an Axios error, rethrow the error
      throw error;
    }
  }
};
