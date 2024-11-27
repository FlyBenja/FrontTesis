import axios from 'axios';

interface CargaMasivaParams {
  archivo: File; // Archivo Excel
  sede_id: number; // ID de la sede
  rol_id: number; // ID del rol
  course_id?: number; // ID del curso (opcional)
}

export const cargaMasiva = async ({
  archivo,
  sede_id,
  rol_id,
  course_id,
}: CargaMasivaParams): Promise<{ message: string }> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('sede_id', sede_id.toString());
    formData.append('rol_id', rol_id.toString());
    if (course_id !== undefined) {
      formData.append('course_id', course_id.toString());
    }

    // Hacer la solicitud POST a la URL especificada
    const response = await axios.post(
      'http://localhost:3000/api/usuarios/cargaMasiva',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Verificamos si la respuesta contiene el mensaje esperado
    if (response.data && response.data.message) {
      return response.data; // Retornar el mensaje de éxito
    }

    throw new Error('Error al procesar la carga masiva.');
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      console.error('Error de Axios:', errorMessage);
      throw new Error(errorMessage);
    }

    // Manejo de errores generales
    console.error('Error desconocido:', error);
    throw new Error('Hubo un problema al realizar la carga masiva.');
  }
};
