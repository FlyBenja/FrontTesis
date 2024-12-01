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

    // Imprimir la respuesta completa para depurar
    console.log('Datos recuperados de la API:', response.data);

    return response.data; // Retornar los datos de la API
  } catch (error) {
    console.error('Error al recuperar las tareas:', error);
    return [];
  }
};
