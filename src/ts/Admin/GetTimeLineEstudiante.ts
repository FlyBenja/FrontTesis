import axios from 'axios';

interface Log {
  user_id: number;
  typeEvent: string;
  description: string;
  task_id: number;
  date: string;
}

export const getTimeLineEstudiante = async (user_id: number): Promise<Log[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `http://localhost:3000/api/timeline/user/${user_id}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((log: any) => ({
        user_id: log.user_id,
        typeEvent: log.typeEvent,
        description: log.descripcion,
        task_id: log.task_id,
        date: log.date,
      }));
    }

    throw new Error('La respuesta no contiene datos válidos del timeline');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error('Error desconocido');
  }
};
