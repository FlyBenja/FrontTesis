import axios from 'axios';
import Swal from 'sweetalert2';

export const createCatedratico = async (catedraticoData: { 
  email: string; 
  name: string; 
  carnet: string; 
  sede_id: number; 
  year: number;
}): Promise<void> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud POST a la URL especificada
    await axios.post('http://localhost:3000/api/create/professor', catedraticoData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Catedrático creado exitosamente');
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la API
      const errorMessage = error.response?.data?.message || 'Error desconocido';

      // Usar SweetAlert2 para mostrar el error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } else {
      // Si no es un error de Axios, lo lanzamos de nuevo
      throw error;
    }
  }
};
