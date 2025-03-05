import axios from 'axios';

// Define the interface for the "Review" structure
interface Review {
  date_assigned: string; // Date when the review was assigned
  date_revision: string; // Date of the revision
  active_process: boolean; // Indicates if the process is active
  approval_status: string; // Status of the thesis approval
  user: {
    name: string;
    email: string;
    carnet: string;
  };
}

// Function to fetch assigned reviews for a specific user
export const getRevisionesCordinador = async (
  user_id: number,
  order: string = 'desc',
  carnet?: string
): Promise<Review[]> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Build the URL with the query parameters
    let url = `http://localhost:3000/api/assigned-review/user/${user_id}?order=${order}`;
    if (carnet) {
      url += `&carnet=${encodeURIComponent(carnet)}`;
    }

    // Make the GET request to fetch assigned reviews
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the response contains the necessary data
    if (response.data && Array.isArray(response.data.reviews)) {
      return response.data.reviews.map((review: any) => ({
        date_assigned: review.date_assigned,
        date_revision: review.RevisionThesis?.date_revision || 'No especificado',
        active_process: review.RevisionThesis?.active_process ?? false,
        approval_status: review.RevisionThesis?.approvaltheses?.[0]?.status || 'Desconocido',
        user: {
          name: review.RevisionThesis?.User?.name || 'No disponible',
          email: review.RevisionThesis?.User?.email || 'No disponible',
          carnet: review.RevisionThesis?.User?.carnet || 'No disponible',
        },
      }));
    }

    throw new Error('La respuesta no contiene datos de revisiones asignadas válidos.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido en la API';
      throw new Error(`Error de la API: ${errorMessage}`);
    }
    throw new Error(`Error desconocido: ${error}`);
  }
};
