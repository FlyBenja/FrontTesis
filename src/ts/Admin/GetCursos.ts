import axios from 'axios';

interface Curso {
  course_id: number;
  courseName: string;
}

export const getCursos = async (sedeId: number): Promise<Curso[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL para obtener los cursos de la sede
    const response = await axios.get(
      `http://localhost:3000/api/cursosPorSede/${sedeId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Verificamos si la respuesta contiene la propiedad "data" y si dentro de "data" hay un array
    if (response.data && Array.isArray(response.data.data)) {
      // Mapeamos los cursos y retornamos en el formato adecuado
      return response.data.data.map((curso: any) => ({
        course_id: curso.course_id, // Usamos 'course_id' como en el JSON
        courseName: curso.courseName, // Usamos 'courseName' como en el JSON
      }));
    }

    throw new Error('La respuesta no contiene datos de cursos válidos.');
  } catch (error) {
    // Manejo de errores mejorado
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      throw new Error(`Error de la API: ${errorMessage}`);
    }

    throw new Error('Error desconocido');
  }
};
