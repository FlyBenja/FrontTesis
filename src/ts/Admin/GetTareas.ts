import axios from 'axios';

export interface Tarea {
  task_id: number;
  title: string;
  description: string;
  taskStart: string;
  endTask: string;
  note: string;
  year_id: number;
  course_id: number | null;
}

export const getTareas = async (sedeId: number, courseId: number, yearId: number): Promise<Tarea[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada con los parámetros correctos
    const response = await axios.get(`http://localhost:3000/api/tareas/curso/${sedeId}/${courseId}/${yearId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificar que la respuesta contiene el array 'tareas' y devolverlo
    return Array.isArray(response.data.tareas) ? response.data.tareas : [];
  } catch (error) {
    // Manejo de errores más detallado
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data ? JSON.stringify(error.response?.data) : 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage);
    }
    console.error('Error en getTareas:', error);
    throw new Error(`Error desconocido: ${error}`);
  }
};
