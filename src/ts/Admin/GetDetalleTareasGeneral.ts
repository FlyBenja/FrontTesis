import axios from 'axios';

// Definir las interfaces para representar la estructura del JSON
export interface Submission {
  title: string;
  submission_complete: boolean;
  date: string;
}

export interface Student {
  name: string;
  email: string;
  carnet: string;
}

export interface StudentDetails {
  student: Student;
  submissions: Submission[];
}

export interface CourseDetails {
  course: string;
  sede: string;
  students: StudentDetails[];
}

// Función para obtener los detalles generales de las tareas
export const getDetalleTareasGeneral = async (
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
    const response = await axios.get(
      `http://localhost:3000/api/courses/${course_id}/${sede_id}/${year}/details`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Verificar si la respuesta contiene los datos
    if (response.data) {
      const { course, sede, students } = response.data;

      // Validar estructura del JSON antes de devolverlo
      if (!course || !sede || !Array.isArray(students)) {
        console.error('Estructura del JSON inesperada');
        return null;
      }

      return {
        course,
        sede,
        students: students.map((studentDetail: any) => ({
          student: {
            name: studentDetail.student.name,
            email: studentDetail.student.email,
            carnet: studentDetail.student.carnet,
          },
          submissions: studentDetail.submissions.map((submission: any) => ({
            title: submission.title,
            submission_complete: submission.submission_complete,
            date: submission.date,
          })),
        })),
      };
    } else {
      console.error('No se encontraron detalles de tareas');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los detalles generales de las tareas:', error);
    return null;
  }
};
