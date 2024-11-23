import axios from 'axios';

interface CrearAsignacionPayload {
  course_id: number;
  sede_id: number;
  year_id: number;
  courseActive: boolean;
}

export const crearAsignacionSedeCurso = async (
  payload: CrearAsignacionPayload
): Promise<void> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud POST a la URL especificada
    const response = await axios.post('http://localhost:3000/api/crearAsignacionSedeCurso', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Asignación creada exitosamente:', response.data);
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
