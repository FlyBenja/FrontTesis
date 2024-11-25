import axios from 'axios';

interface Sede {
  sede_id: number;
  nombre: string;
}

interface Admin {
  user_id: number;
  email: string;
  name: string;
  carnet: string;
  sede: Sede;
  profilePhoto: string | null;
}

interface AdminsResponse {
  message: string;
  admins: Admin[];
}

export const getAdmins = async (): Promise<Admin[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada
    const response = await axios.get<AdminsResponse>('http://localhost:3000/api/admins', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.admins; // Retornar la lista de administradores
  } catch (error) {
    // Manejo de errores
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
