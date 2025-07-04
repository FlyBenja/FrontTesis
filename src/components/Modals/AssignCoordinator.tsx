import React, { useState, useEffect } from 'react';
import { assignsHeadquartersCoordinator } from '../../ts/GeneralCoordinator/AssignsHeadquartersCoordinator';
import { getSedes } from '../../ts/GeneralCoordinator/GetHeadquarters';
import { getHeadquartersCoordinator } from '../../ts/GeneralCoordinator/GetHeadquartersCoordinator';
import Swal from 'sweetalert2';

interface Sede {
  sede_id: number;
  nameSede: string;
  address: string;
}

interface Coordinator {
  user_id: number;
  name: string;
  email: string;
  carnet: string;
  sede_id: number | null;
  location: { nameSede: string } | null;
}

interface AssignCoordinatorProps {
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;  // Callback when assignment is successful
}

const AssignCoordinatorModal: React.FC<AssignCoordinatorProps> = ({ isOpen, onClose, onAssigned }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [sedeId, setSedeId] = useState<number | null>(null);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both sedes and coordinators
        const sedesData = await getSedes();
        const coordinatorsData = await getHeadquartersCoordinator();

        // Transform coordinators data, **including sede_id and location**
        const transformedCoordinators = coordinatorsData.map(coord => ({
          user_id: coord.user_id,
          name: coord.name,
          email: coord.email,
          carnet: coord.carnet,
          sede_id: coord.sede_id,       // <-- agregado
          location: coord.location      // <-- agregado
        }));

        setSedes(sedesData);
        setCoordinators(transformedCoordinators);

        // Reset selections
        setUserId(null);
        setSedeId(null);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: error.message || 'No se pudieron cargar los datos necesarios',
          confirmButtonColor: '#FF5A5F',
          confirmButtonText: 'Aceptar',
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (userId && sedeId) {
      try {
        await assignsHeadquartersCoordinator(userId, sedeId);

        Swal.fire({
          icon: 'success',
          title: 'Coordinador asignado',
          text: 'El coordinador ha sido asignado exitosamente a la sede.',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Aceptar',
        });

        // Notify parent component
        onAssigned();

        // Close modal
        onClose();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al asignar coordinador',
          text: error.message || 'No se pudo asignar el coordinador a la sede',
          confirmButtonColor: '#FF5A5F',
          confirmButtonText: 'Aceptar',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor selecciona un coordinador y una sede antes de continuar.',
        confirmButtonColor: '#FFA500',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Asignar Coordinador a Sede</h3>

        {/* Coordinador */}
        <div className="mb-4">
          <label htmlFor="coordinator" className="block text-sm font-semibold text-black dark:text-white">
            Coordinador
          </label>
          <select
            id="coordinator"
            value={userId ?? ''}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Seleccione un coordinador
            </option>
            {coordinators
              .filter(coord => coord.sede_id === null && coord.location === null)
              .map(coord => (
                <option key={coord.user_id} value={coord.user_id}>
                  {coord.name}
                </option>
              ))}
          </select>
        </div>

        {/* Sede */}
        <div className="mb-4">
          <label htmlFor="sede" className="block text-sm font-semibold text-black dark:text-white">
            Sede
          </label>
          <select
            id="sede"
            value={sedeId ?? ''}
            onChange={(e) => setSedeId(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Seleccione una sede
            </option>
            {sedes.map((sede) => (
              <option key={sede.sede_id} value={sede.sede_id}>
                {sede.nameSede}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black dark:bg-boxdark dark:text-white rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Asignar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignCoordinatorModal;
