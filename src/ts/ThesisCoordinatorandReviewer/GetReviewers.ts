import axios from 'axios';

// Define la interfaz para la estructura de los revisores
interface Revisor {
  user_id: number;
  email: string;
  name: string;
  carnet: string;
  rol_nombre: string;
  rol_id: number;
  active: boolean;
  fotoPerfil: string;
}

// Función para obtener la lista de revisores
export const getRevisores = async (): Promise<Revisor[]> => {
  try {
    // Obtener el token de autenticación desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // URL de la API
    const url = 'http://localhost:3000/api/reviewers';

    // Realizar la solicitud GET
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificar si la respuesta contiene los datos esperados
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((revisor: any) => ({
        user_id: revisor.user_id,
        email: revisor.email,
        name: revisor.name,
        carnet: revisor.carnet,
        rol_nombre: revisor.rol_nombre,
        rol_id: revisor.rol_id,
        active: revisor.active,
        fotoPerfil: revisor.profilePhoto || '',
      }));
    }

    throw new Error('La respuesta no contiene datos de revisores válidos.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      throw new Error(`Error de la API: ${errorMessage}`);
    }
    throw new Error('Error desconocido');
  }
};
