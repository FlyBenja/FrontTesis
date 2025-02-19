import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { asignaRevisor } from '../../../ts/Cordinador/AsignaRevisor';

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
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token de autenticación no encontrado');
        }

        const url = 'http://localhost:3000/api/reviewers';
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setRevisores(response.data.map(({ user_id, name }) => ({ user_id, name })));
        } else {
          throw new Error('La respuesta no contiene datos de revisores válidos.');
        }
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
        navigate('/cordinador/solicitud-revisiones'); // Redirige
      });
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data
          ? JSON.stringify(error.response?.data)
          : 'Error desconocido';
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
