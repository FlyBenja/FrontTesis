import axios from 'axios';

interface Catedratico {
  user_id: number;
  email: string;
  userName: string;
  professorCode: string;
  profilePhoto: string | null;
  active: boolean;
}

export const getCatedraticoPorCarnet = async (
  carnet: string
): Promise<Catedratico | null> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL para obtener el catedrático por su carnet
    const response = await axios.get(
      `http://localhost:3000/api/professors/search?carnet=${carnet}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Verificar si la respuesta contiene la propiedad "formattedProfessors" y si es un array
    if (response.data && Array.isArray(response.data.formattedProfessors)) {
      // Devolver el primer catedrático encontrado, ya que esperamos un único catedrático por carnet
      const professor = response.data.formattedProfessors[0];
      return {
        user_id: professor.user_id,
        email: professor.email,
        userName: professor.userName,
        professorCode: professor.carnet, // Se usa el 'carnet' como 'professorCode'
        profilePhoto: professor.profilePhoto || '', // Si no tiene foto de perfil, asignamos una cadena vacía
        active: true, // Puedes ajustar esto si hay un campo que indique si está activo
      };
    }

    // Si no se encuentra el catedrático, devolvemos null
    return null;
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      console.error('Error de la API:', errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error('Error desconocido');
  }
};
