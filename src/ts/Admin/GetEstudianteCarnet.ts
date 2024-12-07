import axios from 'axios';

interface Estudiante {
  id: number;
  userName: string;
  carnet: string;
  curso: string;
  año: number;
  fotoPerfil: string;
}

export const getEstudiantePorCarnet = async (
  carnet: string
): Promise<Estudiante | null> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL para obtener el estudiante por su carnet
    const response = await axios.get(
      `http://localhost:3000/api/users/search?carnet=${carnet}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Verificar si la respuesta contiene la propiedad "formattedUsers" y si es un array
    if (response.data && Array.isArray(response.data.formattedUsers)) {
      // Devolver el primer usuario encontrado, ya que esperamos un único estudiante por carnet
      const user = response.data.formattedUsers[0];
      return {
        id: user.user_id,
        userName: user.userName,
        carnet: user.carnet,
        curso: '',  // Aquí asumimos que no hay un campo explícito de 'curso' en la respuesta, por lo que lo dejamos vacío
        año: 0,    // Asignamos un valor por defecto si no existe el campo 'año'
        fotoPerfil: user.profilePhoto || '', // Si no tiene foto de perfil, asignamos una cadena vacía
      };
    }

    // Si no se encuentra el usuario, devolvemos null
    return null;
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      throw new Error(`Error de la API: ${errorMessage}`);
    }
    throw new Error('Error desconocido');
  }
};
