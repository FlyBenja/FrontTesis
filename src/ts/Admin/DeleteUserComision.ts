import axios from 'axios';

export interface ResponseMessage {
  message: string;
}

export const deleteUserComision = async (groupId: number, userId: number): Promise<ResponseMessage> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.delete(`http://localhost:3000/api/comisiones/${groupId}/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || 'Error desconocido al eliminar el usuario';
      throw new Error(errorMessage);
    }

    throw new Error('Error al eliminar el usuario');
  }
};
