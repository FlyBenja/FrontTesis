import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { asignaRevisor } from '../../../ts/CoordinadorYRevisorTesis/AsignaRevisor';
import { getRevisores } from '../../../ts/CoordinadorYRevisorTesis/GetRevisores'; // Importar la función para obtener los revisores

interface AsignaRevisorProps {
  onClose: () => void;
  revisionThesisId: number;
}

interface Revisor {
  user_id: number;
  name: string;
}

const AsignaRevisor: React.FC<AsignaRevisorProps> = ({ onClose, revisionThesisId }) => {
  const [selectedRevisor, setSelectedRevisor] = useState<string>('');
  const [revisores, setRevisores] = useState<Revisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRevisores = async () => {
      try {
        const revisoresList = await getRevisores(); // Llamar a la función que obtiene los revisores
        setRevisores(revisoresList); // Guardar la lista de revisores en el estado
      } catch (err) {
        setError('Error al cargar los revisores.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevisores();
  }, []);

  const handleSave = async () => {
    if (!selectedRevisor) return;

    try {
      // Llamar a la API para asignar el revisor
      await asignaRevisor({
        revision_thesis_id: revisionThesisId,
        user_id: Number(selectedRevisor),
      });

      Swal.fire({
        title: 'Éxito',
        text: `Revisor asignado correctamente`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745', // Verde
        customClass: {
          confirmButton: 'text-white bg-green-600',
        },
      }).then(() => {
        onClose();  // Cierra el modal
        navigate('/coordinadortesis/solicitud-revisiones'); // Redirige
      });
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545', // Rojo
        customClass: {
          confirmButton: 'text-white bg-red-600',
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white dark:bg-boxdark rounded shadow-lg w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Asignar Revisor</h2>
        <div className="mt-4">
          <label htmlFor="revisor" className="block text-gray-700 dark:text-white">Selecciona un revisor:</label>
          {loading ? (
            <p className="text-gray-500">Cargando revisores...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <select
              id="revisor"
              className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded w-full bg-white dark:bg-gray-800 text-black dark:text-white"
              value={selectedRevisor}
              onChange={(e) => setSelectedRevisor(e.target.value)}
            >
              <option value="">Seleccione un revisor</option>
              {revisores.map((revisor) => (
                <option key={revisor.user_id} value={revisor.user_id}>{revisor.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!selectedRevisor ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}
            disabled={!selectedRevisor}
          >
            Asignar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignaRevisor;
