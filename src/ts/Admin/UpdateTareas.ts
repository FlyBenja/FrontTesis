import axios from 'axios';
import Swal from 'sweetalert2';

export const updateTarea = async (
  task_id: number,
  tareaDataUpdate: {
    title: string;
    description: string;
    taskStart: string;
    endTask: string;
    startTime: string;
    endTime: string;
  }
): Promise<void> => {
  try {
    // Recuperar el token desde localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Hacer la solicitud PUT a la URL especificada
    await axios.put(`http://localhost:3000/api/tareas/${task_id}`, tareaDataUpdate, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    Swal.fire({
      icon: 'success',
      title: 'Tarea actualizada exitosamente',
      text: 'La tarea fue actualizada correctamente.',
      customClass: { confirmButton: 'bg-green-500 text-white' },
    });
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      // Extraer el mensaje de error de la API
      const errorMessage = error.response?.data?.message || 'Error desconocido';

      // Usar SweetAlert2 para mostrar el error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        customClass: { confirmButton: 'bg-red-500 text-white' },
      });
    } else {
      throw error;
    }
  }
};
