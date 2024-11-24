import axios from 'axios';

export const createAdmin = async (adminData: { 
  email: string; 
  name: string; 
  carnet: string; 
  sede_id: number; 
}): Promise<void> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud POST a la URL especificada
    await axios.post('http://localhost:3000/api/admin/create', adminData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Administrador creado exitosamente');
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      // Extraer únicamente el mensaje de error de la API
      const errorMessage = error.response?.data?.message;

      if (errorMessage) {
        throw new Error(errorMessage); // Lanzar el mensaje específico
      }
    }

    throw error; // Si no es un error de Axios, relanzarlo
  }
};
