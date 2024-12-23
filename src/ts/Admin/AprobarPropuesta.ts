import axios from 'axios';

export const aprobarPropuesta = async (thesisSubmissionId: number, userId: number, approvedProposal: number) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticación no encontrado');

    const requestBody = {
      approved_proposal: approvedProposal,
    };

    await axios.put(
      `http://localhost:3000/api/thesis-submission/${thesisSubmissionId}/${userId}/update-approved-proposal`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la respuesta
      const errorMessage = error.response?.data?.message || 'Error desconocido al aprobar la propuesta';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
