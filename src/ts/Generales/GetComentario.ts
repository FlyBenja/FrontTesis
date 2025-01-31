import axios from 'axios';

// Definition of the data structure for the comment
export interface ComentarioData {
  taskId: number; // Task ID
  userId: number; // User ID
  comments: {
    comment_id: number; // Unique comment ID
    comment: string; // Comment text
    role: string; // Role of the user who made the comment
    datecomment: string; // Date when the comment was made
  }[];
}

// Function to get the comments of a task by task_id and user_id
export const getComentarios = async (task_id: number, user_id: number): Promise<ComentarioData> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If the token is not found, throw an error
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Make the GET request to the specified URL, using task_id and user_id as parameters
    const response = await axios.get(`http://localhost:3000/api/comments/${task_id}/user/${user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Set authorization header with the token
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
    });

    // Adjust the response to match the expected format
    const comentarioData: ComentarioData = {
      taskId: task_id, // Maintain the task_id that was sent in the request
      userId: user_id, // Maintain the user_id that was sent in the request
      comments: response.data.map((entry: any, index: number) => 
        entry.versions.map((version: any, versionIndex: number) => ({
          comment_id: index * 10 + versionIndex, // Generate a unique ID based on the index
          comment: version.comment, // Extract the comment text
          role: version.role, // Extract the role of the commenter
          datecomment: version.datecomment, // Extract the date of the comment
        }))
      ).flat(), // Flatten the array to obtain a single list of comments
    };

    return comentarioData; // Return the adjusted comments
  } catch (error) {
    // Error handling
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data) // Convert error response data to a string if available
        : 'Error desconocido'; // Unknown error message
      throw new Error(errorMessage);
    }

    throw new Error('Error desconocido'); // Throw a generic unknown error
  }
};
