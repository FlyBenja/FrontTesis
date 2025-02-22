import axios from 'axios';

// Define la interfaz para la estructura de los comentarios de revisión
interface ComentarioRevision {
  revision_thesis_id: number;
  active_process: boolean;
  AssignedReviews: {
    assigned_review_id: number;
    User: {
      user_id: number;
      name: string;
      email: string;
    };
    commentsRevisions: string[]; // Lista de comentarios
  }[];
  Approvals: {
    status: string;
    date_approved: string | null;
    approved: boolean;
  }[];
}

// Función para obtener los comentarios de revisión
export const getComentariosRevision = async (userId: number): Promise<ComentarioRevision[]> => {
  try {
    // Obtener el token de autenticación desde localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // URL de la API con el user_id
    const url = `http://localhost:3000/api/revision-thesis/info/${userId}`;

    // Realizar la solicitud GET
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verificar si la respuesta contiene los datos esperados
    if (response.data && response.data.data) {
      return response.data.data.map((revision: any) => ({
        revision_thesis_id: revision.revision_thesis_id,
        active_process: revision.active_process,
        AssignedReviews: revision.AssignedReviews.map((review: any) => ({
          assigned_review_id: review.assigned_review_id,
          User: {
            user_id: review.User.user_id,
            name: review.User.name,
            email: review.User.email,
          },
          commentsRevisions: review.commentsRevisions,
        })),
        Approvals: revision.Approvals.map((approval: any) => ({
          status: approval.status,
          date_approved: approval.date_approved,
          approved: approval.approved,
        })),
      }));
    }

    throw new Error('La respuesta no contiene datos válidos de revisión.');
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
