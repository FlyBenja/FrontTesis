import axios from 'axios';

export const createComision = async (comisionData: { year: number; sede_id: number; groupData: any[] }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    await axios.post('http://localhost:3000/api/comisiones/grupo', comisionData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la respuesta
      const errorMessage = error.response?.data?.message || 'Error desconocido al crear la comisión';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
