import axios from 'axios';

export interface PerfilData {
  user_id: number;
  email: string;
  userName: string;
  profilePhoto: string | null;
  carnet: string;
  sede: number;
  roleName: string;
}

export const getDatosPerfil = async (): Promise<PerfilData> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada
    const response = await axios.get('http://localhost:3000/api/usuarios/perfil', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Aquí se ajusta la respuesta para que coincida con el formato esperado
    const perfilData: PerfilData = {
      user_id: response.data.user_id,
      email: response.data.email,
      userName: response.data.userName,
      profilePhoto: response.data.profilePhoto,
      carnet: response.data.carnet,
      sede: response.data.sede,
      roleName: response.data.roleName,
    };

    return perfilData; // Retornar los datos del perfil ajustados
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
