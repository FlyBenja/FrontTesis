import axios from 'axios';

export const entregarTarea = async (taskData: { user_id: number; task_id: number }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    await axios.post('http://localhost:3000/api/task-submissions', taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al enviar la tarea';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
