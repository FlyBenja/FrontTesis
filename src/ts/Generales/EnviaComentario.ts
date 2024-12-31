import axios from 'axios';

export const enviaComentario = async (taskId: number, commentData: { comment: string; role: string; user_id: number }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    const url = `http://localhost:3000/api/comments/${taskId}`;

    await axios.post(url, commentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al enviar el comentario';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
