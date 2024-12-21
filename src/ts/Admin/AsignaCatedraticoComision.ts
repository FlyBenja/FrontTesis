import axios from 'axios';

// Definimos la función para asignar un catedrático a la comisión
export const asignarCatedraticoComision = async (
  comisionId: number,
  catedraticoData: { user_id: number; rol_comision_id: number }
) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    const response = await axios.post(
      `http://localhost:3000/api/comisiones/${comisionId}/usuario`,
      catedraticoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data; // Retornamos la respuesta de la API si es exitosa
  } catch (error: any) {
    let errorMessage = 'Error desconocido al asignar catedrático a la comisión';
    
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la respuesta
      errorMessage = error.response?.data?.message || errorMessage;
    } else {
      // Captura otros tipos de errores
      errorMessage = error.message || errorMessage;
    }

    throw new Error(errorMessage);
  }
};
