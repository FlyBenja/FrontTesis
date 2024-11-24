import axios from 'axios';

export const createSede = async (nameSede: string): Promise<void> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud POST a la URL especificada
    await axios.post(
      'http://localhost:3000/api/sedes',
      { nameSede },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage); // Propaga el mensaje de error específico
    }

    throw new Error('Error desconocido');
  }
};
