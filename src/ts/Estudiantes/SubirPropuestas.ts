import axios from 'axios';

export const subirPropuesta = async (propuestaData: { file: File; user_id: number; task_id: number }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    const formData = new FormData();
    formData.append('proposal', propuestaData.file); // Cambié el nombre del campo a 'proposal'
    formData.append('user_id', propuestaData.user_id.toString());
    formData.append('task_id', propuestaData.task_id.toString());

    await axios.post('http://localhost:3000/api/thesis/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al subir la propuesta';
      console.error('Error de la API:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Error inesperado:', error.message);
      throw error;
    }
  }
};
