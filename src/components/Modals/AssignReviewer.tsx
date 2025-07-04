import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { asignaRevisor } from '../../ts/ThesisCoordinatorandReviewer/AssignReviewer';
import { getRevisores } from '../../ts/ThesisCoordinatorandReviewer/GetReviewers'; 

/**
 * Interface to define the props passed to the AssignReviewer component.
 */
interface AssignReviewerProps {
  onClose: () => void;
  revisionThesisId: number;
}

/**
 * Interface to define the structure of a reviewer object.
 */
interface Revisor {
  user_id: number;
  name: string;
}

/**
 * It uses the `getRevisores` function to fetch the list of reviewers and the `AssignReviewer` function to assign the selected reviewer to a thesis.
 * After assigning the reviewer, it shows a success message and navigates to another page. In case of an error, it displays an error message.
 */
const AssignReviewer: React.FC<AssignReviewerProps> = ({ onClose, revisionThesisId }) => {
  const [selectedRevisor, setSelectedRevisor] = useState<string>(''); // State to store the selected reviewer
  const [revisores, setRevisores] = useState<Revisor[]>([]); // State to store the list of reviewers
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track error message
  const navigate = useNavigate();

  /**
   * Fetches the list of reviewers when the component mounts.
   * Sets the reviewers data or error message based on the response.
   */
  useEffect(() => {
    const fetchRevisores = async () => {
      try {
        const revisoresList = await getRevisores(); // Fetch reviewers from API
        setRevisores(revisoresList); // Save the reviewers in the state
      } catch (err) {
        setError('Error al cargar los revisores.'); // Set error message if the fetch fails
      } finally {
        setLoading(false); // Set loading to false after the fetch
      }
    };

    fetchRevisores(); // Call the function to fetch reviewers
  }, []);

  /**
   * Handles the save action when the "Asignar" button is clicked.
   * Assigns the selected reviewer to the thesis and shows a success or error message.
   */
  const handleSave = async () => {
    if (!selectedRevisor) return; // Ensure a reviewer is selected

    try {
      // Call the API to assign the reviewer to the thesis
      await asignaRevisor({
        revision_thesis_id: revisionThesisId,
        user_id: Number(selectedRevisor),
      });

      // Show success message using SweetAlert
      Swal.fire({
        title: 'Éxito',
        text: `Revisor asignado correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#28a745', // Green color
        customClass: {
          confirmButton: 'text-white bg-green-600',
        },
      }).then(() => {
        onClose();  // Close the modal
        navigate('/coordinadortesis/solicitud-revisiones'); // Navigate to the 'solicitudes' page
      });
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message; // Set error message if the error is of type Error
      }
      // Show error message using SweetAlert
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545', // Red color
        customClass: {
          confirmButton: 'text-white bg-red-600',
        },
      });
    }
  };

  return (
    // Modal container for assigning a reviewer
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white dark:bg-boxdark rounded shadow-lg w-full max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        {/* Modal title */}
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Asignar Revisor</h2>
        <div className="mt-4">
          <label htmlFor="revisor" className="block text-gray-700 dark:text-white">Selecciona un revisor:</label>
          {/* Show loading or error message */}
          {loading ? (
            <p className="text-gray-500">Cargando revisores...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            // Dropdown to select a reviewer
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
          {/* Cancel button */}
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}
          >
            Cancelar
          </button>
          {/* Save button (disabled if no reviewer is selected) */}
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

export default AssignReviewer;
