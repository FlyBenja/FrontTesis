import axios from 'axios';

export const updateSede = async (sede_id: number, nameSede: string): Promise<string> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud de actualización de la sede
    const response = await axios.put(
      `http://localhost:3000/api/sedes/${sede_id}`,
      JSON.stringify({ nameSede }), // El nombre de la sede que se desea actualizar
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data; // Devuelve el mensaje de éxito
  } catch (error: any) {
    // Si es un error de Axios, obtener el mensaje de error
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al actualizar la sede';
      throw new Error(errorMessage);
    } else {
      throw error; // Para otros tipos de error
    }
  }
};
