import axios from 'axios';

// Define la interfaz para la estructura de la revisión
interface RevisionDetalle {
  revision_thesis_id: number;
  thesis_dir: string;
  date_revision: string;
  active_process: boolean;
  user: {
    name: string;
    carnet: string;
    email: string;
    profilePhoto: string | null;
    location: {
      nameSede: string;
    };
    year: {
      year: number;
    };
  };
  assignedReviews: any[];
  assigned_reviewer: any | null;
}

// Función para obtener detalles de revisiones pendientes por usuario
export const getRevisionDetallePendi = async (user_id: number): Promise<RevisionDetalle[]> => {
  try {
    // Obtener el token de autenticación desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Construir la URL con el parámetro user_id
    const url = `https://api.onlineproject.online/api/revision-thesis/user/${user_id}`;

    // Realizar la solicitud GET
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificar si la respuesta contiene los datos esperados
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((revision: any) => ({
        revision_thesis_id: revision.revision_thesis_id,
        thesis_dir: revision.thesis_dir,
        date_revision: revision.date_revision,
        active_process: revision.active_process,
        user: {
          name: revision.User.name,
          carnet: revision.User.carnet,
          email: revision.User.email,
          profilePhoto: revision.User.profilePhoto,
          location: {
            nameSede: revision.User.location.nameSede,
          },
          year: {
            year: revision.User.year.year,
          },
        },
        assignedReviews: revision.AssignedReviews,
        assigned_reviewer: revision.assigned_reviewer,
      }));
    }

    throw new Error('La respuesta no contiene datos de revisiones válidos.');
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
