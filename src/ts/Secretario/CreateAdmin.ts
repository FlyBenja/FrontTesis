import axios from 'axios';

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  carnet: string,
  sede_id: number,
  rol_id: number,
  year: number
): Promise<void> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud POST a la URL de registro
    await axios.post(
      'http://localhost:3000/auth/register',
      {
        email,
        password,
        name,
        carnet,
        sede_id,
        rol_id,
        year
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
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
