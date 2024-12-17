import axios from 'axios';

interface Comision {
  id: number;
  nombre: string;
  descripcion: string;
  year: number;
  sedeId: number;
}

export const getComisiones = async (
    sedeId: number,
    year: number
  ): Promise<Comision[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }
  
      const response = await axios.get(
        `http://localhost:3000/api/group-comision?sede_id=${sedeId}&year=${year}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Respuesta de la API:', response.data);  // Agrega esta línea para ver la respuesta completa
  
      // Cambiar la verificación para acceder a 'groups' en lugar de 'comisiones'
      if (response.data && Array.isArray(response.data.groups)) {
        return response.data.groups.map((group: any) => ({
          id: group.group_id,
          nombre: `Comisión ${group.group_id}`, // Ajusta según los datos que tengas
          descripcion: group.activeGroup ? 'Comisión activa' : 'Comisión inactiva', // Ajusta según los datos
          year: group.year_id,
          sedeId: group.sede_id,
        }));
      }
  
      throw new Error('La respuesta no contiene datos de comisiones válidos.');
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
  
