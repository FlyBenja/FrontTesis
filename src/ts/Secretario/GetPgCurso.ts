import axios from 'axios';

export const getCursosPorSede = async (sede_id: number): Promise<{ course_id: number; courseName: string }[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada
    const response = await axios.get(`http://localhost:3000/api/cursosPorSede/${sede_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificar si la respuesta contiene los datos esperados
    if (response.data?.data) {
      return response.data.data; // Retornar los cursos recuperados
    } else {
      throw new Error('No se encontraron cursos para esta sede');
    }
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage);
    }

    throw new Error('Error desconocido');
  }
};
