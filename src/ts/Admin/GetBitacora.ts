import axios from 'axios';

export const getBitacora = async (sedeId: number): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `http://localhost:3000/api/bitacora/${sedeId}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Retornar los datos de la bitácora
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejo de errores con detalles
      throw new Error(error.response?.data?.message || error.message || 'Error desconocido');
    } else {
      throw new Error('Error inesperado');
    }
  }
};
