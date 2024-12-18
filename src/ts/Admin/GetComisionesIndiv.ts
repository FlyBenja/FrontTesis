import axios from 'axios';

interface Usuario {
  userId: number;
  email: string;
  nombre: string;
  carnet: string;
  rol: string;
  profilePhoto: string | null;
}

interface Grupo {
  groupId: number;
  yearId: number;
  sedeId: number;
  users: Usuario[];
}

export const getComisionesIndiv = async (
  groupId: number,
  year: number
): Promise<Grupo[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.get(
      `http://localhost:3000/api/comisiones/grupos/${groupId}/${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Respuesta de la API:', response.data);

    if (response.data && Array.isArray(response.data.groups)) {
      return response.data.groups.map((group: any) => ({
        groupId: group.group_id,
        yearId: group.year_id,
        sedeId: group.sede_id,
        users: group.users.map((user: any) => ({
          userId: user.user_id,
          email: user.email,
          nombre: user.nombre,
          carnet: user.carnet,
          rol: user.rol,
          profilePhoto: user.profilePhoto,
        })),
      }));
    }

    throw new Error('La respuesta no contiene datos válidos de grupos.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data)
        : 'Error desconocido';
      throw new Error(`Error de la API: ${errorMessage}`);
    }

    throw new Error('Error desconocido');
  }
};
