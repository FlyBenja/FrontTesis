import axios from 'axios';

// Definición de la estructura de datos para el comentario
export interface ComentarioData {
  taskId: number;
  userId: number;
  comments: {
    comment_id: number;
    comment: string;
    role: string;
    datecomment: string;
  }[];
}

// Función para obtener los comentarios de una tarea por task_id y user_id
export const getComentarios = async (task_id: number, user_id: number): Promise<ComentarioData> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud GET a la URL especificada, usando task_id y user_id como parámetros
    const response = await axios.get(`http://localhost:3000/api/comments/${task_id}/user/${user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Ajustamos la respuesta para que coincida con el formato esperado
    const comentarioData: ComentarioData = {
      taskId: task_id, // Se mantiene el task_id que fue enviado en la solicitud
      userId: user_id, // Se mantiene el user_id que fue enviado en la solicitud
      comments: response.data.map((entry: any, index: number) => 
        entry.versions.map((version: any, versionIndex: number) => ({
          comment_id: index * 10 + versionIndex, // Usamos un ID único basado en el índice
          comment: version.comment,
          role: version.role,
          datecomment: version.datecomment,
        }))
      ).flat(), // Aplanamos el array para que sea una lista única de comentarios
    };

    return comentarioData; // Retornamos los comentarios ajustados
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response?.data)
        : 'Error desconocido';
      throw new Error(errorMessage);
    }

    throw new Error('Error desconocido');
  }
};
