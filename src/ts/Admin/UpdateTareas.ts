import axios from 'axios';

export const updateTarea = async (
  task_id: number,
  tareaDataUpdate: {
    title: string;
    description: string;
    taskStart: string;
    endTask: string;
    startTime: string;
    endTime: string;
  }
): Promise<string | null> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud PUT a la URL especificada
    await axios.put(`http://localhost:3000/api/tareas/${task_id}`, tareaDataUpdate, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return null;  // Retorna null si no hay errores
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la API
      return error.response?.data?.message || 'Error desconocido';
    } else {
      throw error;
    }
  }
};
