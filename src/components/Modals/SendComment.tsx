import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { enviaComentario } from '../../ts/ThesisCoordinatorandReviewer/SendComments';

/**
 * Props for the SendComment component
 */
interface SendCommentProps {
  onClose: () => void;
  revision_thesis_id: number;
}

/**
 * SendComment component for sending a comment on a thesis revision.
 */
const SendComment: React.FC<SendCommentProps> = ({ onClose, revision_thesis_id }) => {
  const [titulo, setTitulo] = useState('');  // Title of the comment
  const [comentario, setComentario] = useState('');  // The content of the comment
  const [status, setStatus] = useState<string>('');  // Status of the comment (approved or rejected)
  const navigate = useNavigate();  // Hook for navigation

  /**
   * Handles saving the comment.
   * Validates the input and sends the comment to the server using the enviaComentario function.
   * Displays success or error alerts based on the result.
   */
  const handleSave = async () => {
    // Validate if the fields are filled
    if (!titulo || !comentario || status === '') {
      Swal.fire({
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
      });
      return;
    }

    try {
      // Call the function to send the comment
      await enviaComentario({
        revision_thesis_id: revision_thesis_id,
        title: titulo,
        comment: comentario,
        status: Number(status),  // Convert the status to number
      });

      // Show success alert and redirect
      Swal.fire({
        title: 'Éxito',
        text: 'Comentario enviado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
      }).then(() => {
        onClose();  // Close the modal
        navigate('/coordinadortesis/mis-asignaciones');  // Redirect to the desired page
      });
    } catch (error) {
      // Show error alert if something goes wrong
      Swal.fire({
        title: 'Error',
        text: 'No se pudo enviar el comentario.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-8 bg-white dark:bg-boxdark rounded-xl shadow-lg w-full max-w-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        <h2 className="text-xl font-bold mb-6 text-black dark:text-white">Enviar Comentario</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-gray-700 dark:text-white">Título:</label>
            <input
              type="text"
              id="titulo"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}  // Update the title
              placeholder="Título del comentario"
            />
          </div>
          <div>
            <label htmlFor="comentario" className="block text-gray-700 dark:text-white">Comentario:</label>
            <textarea
              id="comentario"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}  // Update the comment content
              placeholder="Escriba su comentario aquí"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 dark:text-white">Estado:</label>
            <select
              id="status"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}  // Update the status
            >
              <option value="">Seleccione una opción</option>
              <option value="1">Aprobado</option>
              <option value="0">Rechazado</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg w-full"
            onClick={onClose}  // Close the modal without saving
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!(titulo && comentario && status) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}  // Trigger the save function
            disabled={!(titulo && comentario && status)}  // Disable the button if fields are empty
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendComment;
