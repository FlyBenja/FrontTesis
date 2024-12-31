import axios from 'axios';

// Definir la interfaz de los datos según la estructura del JSON proporcionado
export interface Submission {
  task_id: number;
  submission_complete: boolean;
  date: string;
}

export interface Course {
  course_id: number;
  sede_id: number;
  year_id: number;
  courseActive: boolean;
}

export interface Student {
  user_id: number;
  name: string;
  email: string;
  carnet: string;
}

export interface CourseDetails {
  student: Student;
  course: Course;
  submissions: Submission[];
}

// Función para obtener los detalles de tareas para un estudiante en un curso específico
export const getDetalleTareas = async (
  user_id: number,
  course_id: number,
  sede_id: number,
  year: number
): Promise<CourseDetails | null> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada con los parámetros
    const response = await axios.get(`http://localhost:3000/api/students/${user_id}/courses/${course_id}/sede/${sede_id}/year/${year}/details`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificar si la respuesta contiene los datos
    if (response.data) {
      return response.data; // Retornar los detalles del estudiante y las tareas
    } else {
      console.error('No se encontraron detalles de tareas');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los detalles de las tareas:', error);
    return null;
  }
};
