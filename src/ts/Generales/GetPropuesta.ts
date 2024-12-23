import axios from 'axios';

export interface Propuesta {
  thesisSubmissions_id: number;
  user_id: number;
  task_id: number;
  file_path: string;
  date: string;
  approved_proposal: number;
}

export const getPropuesta = async (userId: number, taskId: number): Promise<Propuesta | null> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada con los parámetros correctos
    const response = await axios.get(`http://localhost:3000/api/thesis-submission/${userId}/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Retornar los datos de la API
  } catch (error) {
    console.error('Error al obtener la propuesta:', error);
    return null; // Retornar null si ocurre un error
  }
};
