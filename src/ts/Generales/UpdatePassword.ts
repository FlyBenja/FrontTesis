import axios from 'axios';

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    // Mostrar el token en la consola para asegurarnos de que se recupera correctamente
    console.log('Token recuperado:', token);

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud de actualización de la contraseña
    const response = await axios.put(
      'http://localhost:3000/api/updatePassword',
      { oldPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || 'Error desconocido';
      throw new Error(errorMessage);
    }
    throw new Error('Error desconocido');
  }
};
