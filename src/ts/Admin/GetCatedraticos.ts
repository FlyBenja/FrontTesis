import axios from 'axios';

interface Catedratico {
  user_id: number;
  email: string;
  userName: string;
  profilePhoto: string | null;
  active: boolean;
}

export const getCatedraticos = async (sede_id: number, year: number): Promise<Catedratico[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `http://localhost:3000/api/professors?sede_id=${sede_id}&year=${year}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((professor: any) => ({
        user_id: professor.user_id,
        email: professor.email,
        userName: professor.userName,
        profilePhoto: professor.profilePhoto,
        active: professor.active,
      }));
    }

    throw new Error('La respuesta no contiene datos válidos de catedráticos');
  } catch (error) {
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
