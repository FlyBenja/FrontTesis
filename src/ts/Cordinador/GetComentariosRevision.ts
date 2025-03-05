import axios from 'axios';

// Define the interface for the "CommentRevision" structure
interface CommentRevision {
  title: string; // Title of the revision comment
  comment: string; // The actual comment made by the reviewer
  date_comment: string; // The date when the comment was made
}

// Define the structure for the Review with Assigned Reviews and Approval
interface AssignedReview {
  assigned_review_id: number;
  user: {
    user_id: number;
    name: string;
    email: string;
  };
  commentsRevisions: CommentRevision[]; // List of comments associated with the review
}

// Define the structure for the Thesis Revision Info
interface ThesisRevisionInfo {
  revision_thesis_id: number;
  active_process: boolean;
  thesis_dir: string;
  AssignedReviews: AssignedReview[];
  approvaltheses: {
    status: string;
    date_approved: string;
    approved: boolean;
  }[];
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
}

// Function to fetch thesis revision comments for a specific user
export const getComentariosRevision = async (user_id: number): Promise<ThesisRevisionInfo[]> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Build the URL with the user_id parameter
    const url = `http://localhost:3000/api/revision-thesis/info/${user_id}`;

    // Make the GET request to fetch the thesis revision info
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the response contains the necessary data
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((revision: any) => ({
        revision_thesis_id: revision.revision_thesis_id,
        active_process: revision.active_process,
        thesis_dir: revision.thesis_dir,
        AssignedReviews: revision.AssignedReviews.map((assignedReview: any) => ({
          assigned_review_id: assignedReview.assigned_review_id,
          user: {
            user_id: assignedReview.User.user_id,
            name: assignedReview.User.name,
            email: assignedReview.User.email,
          },
          commentsRevisions: assignedReview.commentsRevisions.map((comment: any) => ({
            title: comment.title,
            comment: comment.comment,
            date_comment: comment.date_comment,
          })),
        })),
        approvaltheses: revision.approvaltheses.map((approval: any) => ({
          status: approval.status,
          date_approved: approval.date_approved,
          approved: approval.approved,
        })),
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
      }));
    }

    throw new Error('La respuesta no contiene datos de revisión de tesis válidos.');
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
