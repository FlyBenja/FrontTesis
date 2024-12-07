import axios from 'axios';
import Swal from 'sweetalert2';

interface GroupMember {
    user_id: number;
    rol_comision_id: number;
}

export const createComision = async (comisionData: {
    year: number;
    sede_id: number;
    groupData: GroupMember[];
}): Promise<void> => {
    try {
        // Validar que el número de miembros del grupo esté dentro del rango permitido
        const groupSize = comisionData.groupData.length;
        if (groupSize < 3 || groupSize > 5) {
            throw new Error('El número de miembros debe estar entre 3 y 5.');
        }

        // Recuperar el token desde localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        // Realizar la solicitud POST
        const response = await axios.post('http://localhost:3000/api/comisiones/grupo', comisionData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Si la solicitud es exitosa
        Swal.fire({
            icon: 'success',
            title: 'Comisión creada exitosamente',
            text: response.data.message || 'La comisión fue creada correctamente.',
            customClass: { confirmButton: 'bg-green-500 text-white' },
        });
    } catch (error) {
        // Manejo de errores
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Error desconocido';

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                customClass: { confirmButton: 'bg-red-500 text-white' },
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error)?.message || 'Error inesperado',
                customClass: { confirmButton: 'bg-red-500 text-white' },
            });
        }
    }
};
