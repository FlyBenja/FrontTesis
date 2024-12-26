import axios from 'axios';

export interface TareaEstudiante {
  task_id: number;
  title: string;
  description: string;
  taskStart: string;
  endTask: string;
  startTime: string;
  endTime: string;
  submission_complete: boolean;
  submission_date: string;
}

export const getTareasEstudiante = async (
  userId: number,
  year: number,
  sedeId: number
): Promise<TareaEstudiante[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada con los parámetros correctos
    const response = await axios.get(
      `http://localhost:3000/api/submissions/student/${userId}/${year}/${sedeId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.tasks; // Retornar los datos de la API
  } catch (error) {
    console.error('Error al obtener las tareas del estudiante:', error);
    return [];
  }
};
