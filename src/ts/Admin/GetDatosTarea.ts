  import axios from 'axios';

  // Definir la interfaz de la tarea según la estructura del JSON
  export interface TaskData {
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
    CourseSedeAssignment: {
      sede_id: number;
    };
  }

  // Función para obtener los datos de la tarea por task_id
  export const getDatosTarea = async (taskId: number): Promise<TaskData | null> => {
    try {
      // Recuperar el token desde localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Hacer la solicitud GET a la URL especificada con el task_id
      const response = await axios.get(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Verificar si la respuesta contiene los datos
      if (response.data && response.data.data) {
        return response.data.data; // Retornar los datos de la tarea
      } else {
        console.error('No se encontraron datos de tarea');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos de la tarea:', error);
      return null;
    }
  };
