import axios from 'axios';

// Definir la interfaz actualizada de los datos según la nueva estructura del JSON
export interface Submission {
  title: string;
  submission_complete: boolean;
  date: string;
}

export interface Student {
  name: string;
  email: string;
  carnet: string;
  sede: string;
  course: string;
}

export interface CourseDetails {
  student: Student;
  formattedSubmissions: Submission[];
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
      const { student, formattedSubmissions } = response.data;

      // Validar estructura del JSON antes de devolverlo
      if (!student || !formattedSubmissions) {
        console.error('Estructura del JSON inesperada');
        return null;
      }

      return {
        student: {
          name: student.name,
          email: student.email,
          carnet: student.carnet,
          sede: student.sede,
          course: student.course,
        },
        formattedSubmissions: formattedSubmissions.map((submission: any) => ({
          title: submission.title,
          submission_complete: submission.submission_complete,
          date: submission.date,
        })),
      };
    } else {
      console.error('No se encontraron detalles de tareas');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los detalles de las tareas:', error);
    return null;
  }
};
