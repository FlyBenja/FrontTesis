import axios from 'axios';

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud de actualización de la contraseña
    const response = await axios.put(
      'http://localhost:3000/auth/updatePassword',
      JSON.stringify({ currentPassword: oldPassword, newPassword }), // Asegúrate de usar 'currentPassword' en lugar de 'oldPassword'
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data; // Devuelve el mensaje de éxito
  } catch (error: any) {
    // Si es un error de Axios, obtener el mensaje de error
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al actualizar la contraseña';
      throw new Error(errorMessage);
    } else {
      throw error; // Para otros tipos de error
    }
  }
};
