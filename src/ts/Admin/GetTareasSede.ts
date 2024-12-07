import axios from 'axios';

export interface Tarea {
  task_id: number;
  asigCourse_id: number;
  typeTask_id: number;
  title: string;
  description: string;
  taskStart: string;
  endTask: string;
  startTime: string;
  endTime: string;
  year_id: number;
}

export const getTareasSede = async (
  sedeId: number, 
  year: number
): Promise<Tarea[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL con los parámetros sede y año
    const response = await axios.get(
      `http://localhost:3000/api/tareas/${sedeId}/${year}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Retornar las tareas obtenidas
    return response.data;
  } catch (error) {
    return [];
  }
};
