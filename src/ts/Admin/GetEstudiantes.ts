import axios from 'axios';

interface Estudiante {
    id: number;
    userName: string; // Cambiado de 'nombre' a 'userName'
    carnet: string;
    curso: string;
    año: number;
    fotoPerfil: string;
  }
  
  export const getEstudiantes = async (
    sedeId: number,
    courseId: number,
    nameYear: number
  ): Promise<Estudiante[]> => {
    try {
      // Recuperar el token desde localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }
  
      // Hacer la solicitud GET a la URL para obtener los estudiantes
      const response = await axios.get(
        `http://localhost:3000/api/sedes/${sedeId}/cursos/${courseId}/estudiantes/${nameYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Verificar si la respuesta contiene la propiedad "users" y si "users" es un array
      if (response.data && Array.isArray(response.data.users)) {
        return response.data.users.map((user: any) => ({
          id: user.user_id,
          userName: user.userName, // Cambiado de 'nombre' a 'userName'
          carnet: user.carnet,
          curso: user.curso,
          año: user.año,
          fotoPerfil: user.profilePhoto || '', // Si no existe, asigna un valor vacío
        }));
      }
  
      // Si no se encuentra un array válido de estudiantes, lanzamos un error
      throw new Error('La respuesta no contiene datos de estudiantes válidos.');
    } catch (error) {
      // Manejo de errores mejorado
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response?.data)
          : 'Error desconocido';
        throw new Error(`Error de la API: ${errorMessage}`);
      }
  
      // En caso de otro tipo de error
      throw new Error('Error desconocido');
    }
  };
  