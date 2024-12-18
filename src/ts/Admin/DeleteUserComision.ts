import axios from 'axios';

export interface ResponseMessage {
  message: string;
}

export const deleteUserComision = async (groupId: number, userId: number): Promise<ResponseMessage> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud DELETE a la URL especificada con los parámetros correctos
    const response = await axios.delete(`http://localhost:3000/api/comisiones/${groupId}/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Imprimir la respuesta completa para depurar
    console.log('Respuesta de la API:', response.data);

    return response.data; // Retornar el mensaje de la respuesta
  } catch (error: any) {
    console.error('Error al eliminar el usuario de la comisión:', error);

    // Verificar si el error tiene una respuesta de Axios
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || 'Error desconocido al eliminar el usuario';
      throw new Error(errorMessage);
    }

    // Si no es un error de Axios, manejar como un error genérico
    throw new Error('Error al eliminar el usuario');
  }
};
