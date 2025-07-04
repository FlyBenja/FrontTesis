import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createSede } from '../../ts/GeneralCoordinator/CreateHeadquarters';
import { updateSede } from '../../ts/GeneralCoordinator/UpdateHeadquarters';

interface CreateHeadquartersProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'crear' | 'editar';
  initialData?: {
    sede_id: number;
    nameSede: string;
    address: string;
  };
  onSuccess: () => void;
}

const CreateHeadquartersModal: React.FC<CreateHeadquartersProps> = ({
  isOpen,
  onClose,
  type,
  initialData,
  onSuccess,
}) => {
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedeDireccion, setSedeDireccion] = useState('');

  useEffect(() => {
    // Limpiar los campos primero
    setSedeNombre('');
    setSedeDireccion('');

    // Luego, si estamos editando y hay datos iniciales, aplicarlos
    if (type === 'editar' && initialData) {
      setTimeout(() => {
        setSedeNombre(initialData.nameSede || '');
        setSedeDireccion(initialData.address || '');
      }, 0); // pequeño delay para que el reseteo surta efecto primero
    }
  }, [type, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Limpiar campos antes de enviar (se limpian de la vista, no de los valores que se envían)
      const nombreActual = sedeNombre.trim();
      const direccionActual = sedeDireccion.trim();

      if (type === 'crear') {
        await createSede(nombreActual, direccionActual);

        Swal.fire({
          icon: 'success',
          title: 'Sede creada',
          text: `La sede "${nombreActual}" ha sido creada exitosamente.`,
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Aceptar',
        });
      } else if (type === 'editar' && initialData) {
        const noCambios =
          nombreActual === initialData.nameSede.trim() &&
          direccionActual === initialData.address.trim();

        if (noCambios) {
          onClose(); // No hay cambios → solo cerrar el modal
          return;
        }

        await updateSede(initialData.sede_id, nombreActual, direccionActual);

        Swal.fire({
          icon: 'success',
          title: 'Sede actualizada',
          text: `La sede "${nombreActual}" ha sido actualizada exitosamente.`,
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Aceptar',
        });
      }

      // Notificar éxito y cerrar modal
      onSuccess();
      setSedeNombre('');
      setSedeDireccion('');
      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: type === 'crear' ? 'Error al crear sede' : 'Error al actualizar sede',
        text: error.message,
        confirmButtonColor: '#FF5A5F',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          {type === 'crear' ? 'Crear Nueva Sede' : 'Editar Sede'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">
              Nombre de la Sede
            </label>
            <input
              type="text"
              value={sedeNombre}
              onChange={(e) => setSedeNombre(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">
              Dirección de la Sede
            </label>
            <input
              type="text"
              value={sedeDireccion}
              onChange={(e) => setSedeDireccion(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {type === 'crear' ? 'Crear' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHeadquartersModal;
