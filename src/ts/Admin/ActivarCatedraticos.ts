import axios from 'axios';

interface ActivarCatedraticoResponse {
  message: string;
  // Puedes añadir más campos dependiendo de la respuesta de la API
}

export const activaCatedratico = async (
  userId: number,
  active: boolean
): Promise<ActivarCatedraticoResponse> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud PATCH a la URL especificada
    const response = await axios.patch(
      `http://localhost:3000/api/professors/${userId}/active`,
      {
        active, // Enviar el valor de "active" como parámetro
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
