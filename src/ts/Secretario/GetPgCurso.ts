import axios from 'axios';

export const getCursosPorSede = async (sede_id: number): Promise<{ course_id: number; courseName: string }[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    const response = await axios.get(`http://localhost:3000/api/cursosPorSede/${sede_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.data) {
      return response.data.data;
    } else {
      throw new Error('No se encontraron cursos para esta sede');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener los cursos';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
