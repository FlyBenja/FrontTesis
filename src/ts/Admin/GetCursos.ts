import axios from 'axios';

export const getCursos = async (sedeId: number): Promise<{ curso_id: number; nombre: string }[]> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL para obtener los cursos de la sede
    const response = await axios.get(`http://localhost:3000/api/cursosPorSede/${sedeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificamos si la respuesta contiene la propiedad "data" y si dentro de "data" hay un array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;  // Extraemos el array de cursos dentro de "data"
    }

    throw new Error('La respuesta no contiene datos de cursos válidos.');
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      throw new Error(errorMessage);
    }

    throw new Error('Error desconocido');
  }
};
