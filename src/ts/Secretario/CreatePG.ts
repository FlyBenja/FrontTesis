import axios from 'axios';

interface CrearAsignacionPayload {
  course_id: number;
  sede_id: number;
  year_id: number;
  courseActive: boolean;
}

export const crearAsignacionSedeCurso = async (
  payload: CrearAsignacionPayload
): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado.');

    await axios.post('http://localhost:3000/api/crearAsignacionSedeCurso', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || 'Error desconocido');
    }
    throw new Error('Error desconocido');
  }
};
