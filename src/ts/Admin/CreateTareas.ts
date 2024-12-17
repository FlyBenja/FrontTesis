import axios from 'axios';

export const createTarea = async (tareaData: {
  course_id: number;
  sede_id: number;
  typeTask_id: number;
  title: string;
  description: string;
  taskStart: string;
  endTask: string;
  startTime: string;
  endTime: string;
}): Promise<string | null> => {  // Devuelve un mensaje de error o null
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud POST a la URL especificada
    await axios.post('http://localhost:3000/api/tareas', tareaData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return null; // Si no hubo errores, retorna null
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la API
      return error.response?.data?.message || 'Error desconocido';
    } else {
      return 'Hubo un problema con la solicitud';
    }
  }
};
