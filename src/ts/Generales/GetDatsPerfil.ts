import axios from 'axios';

export interface PerfilData {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  [key: string]: any; // Ajusta según los datos que recibas en la respuesta
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

    return response.data; // Retornar los datos del perfil
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
