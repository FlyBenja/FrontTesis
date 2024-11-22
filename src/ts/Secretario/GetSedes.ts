import axios from 'axios';

export const getSedes = async (): Promise<{ sede_id: number; nameSede: string }[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada
    const response = await axios.get('http://localhost:3000/api/sedes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Retornar los datos de la respuesta
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
