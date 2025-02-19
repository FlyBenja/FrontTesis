import axios from 'axios';

// Define la interfaz para la asignación de revisor
interface AsignacionRevisor {
  revision_thesis_id: number;
  user_id: number;
}

// Función para asignar un revisor a una tesis
export const asignaRevisor = async (data: AsignacionRevisor): Promise<void> => {
  try {
    // Obtener el token de autenticación desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // URL de la API
    const url = 'http://localhost:3000/api/assigned-review';

    // Realizar la solicitud POST
    await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      throw new Error(`Error de la API: ${errorMessage}`);
    }
    throw new Error('Error desconocido');
  }
};
