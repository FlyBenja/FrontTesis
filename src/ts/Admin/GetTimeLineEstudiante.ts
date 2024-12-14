import axios from 'axios';

interface Log {
  username: string;
  action: string;
  description: string;
  date: string;
}

export const getTimeLineEstudiante = async (user_id: number): Promise<Log[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `http://localhost:3000/api/bitacoraxuser/${user_id}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && Array.isArray(response.data.logs)) {
      return response.data.logs.map((log: any) => ({
        username: log.username,
        action: log.action,
        description: log.description,
        date: log.date,
      }));
    }

    throw new Error('La respuesta no contiene datos válidos de la bitácora');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error('Error desconocido');
  }
};
