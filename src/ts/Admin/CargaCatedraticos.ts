import axios from 'axios';

interface CargarCatedraticosParams {
  archivo: File; // Archivo Excel
  sede_id: number; // ID de la sede
}

export const cargarCatedraticos = async ({
  archivo,
  sede_id,
}: CargarCatedraticosParams): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('sede_id', sede_id.toString());

    const response = await axios.post(
      'http://localhost:3000/api/catedraticos/cargaMasiva',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data && response.data.message) {
      return response.data;
    }

    throw new Error('Error al procesar la carga masiva.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage);
    }

    console.error('Error desconocido:', error);
    throw new Error('Hubo un problema al realizar la carga masiva.');
  }
};
