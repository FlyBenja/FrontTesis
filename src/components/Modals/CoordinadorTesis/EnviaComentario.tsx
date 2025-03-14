import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import { enviaComentario } from '../../../ts/CoordinadorTesis/EnviaComentarios';

interface EnviaComentariosProps {
  onClose: () => void;
  revision_thesis_id: number;
}

const EnviaComentarios: React.FC<EnviaComentariosProps> = ({ onClose, revision_thesis_id }) => {
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();  // Usar el hook para la navegación

  const handleSave = async () => {
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
      await enviaComentario({
        revision_thesis_id: revision_thesis_id,
        title: titulo,
        comment: comentario,
        status: Number(status),
      });

      Swal.fire({
        title: 'Éxito',
        text: 'Comentario enviado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
      }).then(() => {
        onClose();
        navigate('/coordinadortesis/mis-asignaciones');  // Redirigir a la página deseada
      });
    } catch (error) {
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
              onChange={(e) => setTitulo(e.target.value)}
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
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escriba su comentario aquí"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 dark:text-white">Estado:</label>
            <select
              id="status"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg w-full ${!(titulo && comentario && status) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            onClick={handleSave}
            disabled={!(titulo && comentario && status)}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnviaComentarios;
