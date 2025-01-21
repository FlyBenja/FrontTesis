import axios from 'axios';

export interface ResponseMessage {
  message: string;
}

export const deleteAdmin = async (userId: number, sedeId: number): Promise<ResponseMessage> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.put(
      'http://localhost:3000/api/admin/remove', 
      {
        user_id: userId,
        sede_id: sedeId,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message;
      throw new Error(errorMessage);
    }

    throw new Error('Error al eliminar el administrador');
  }
};
