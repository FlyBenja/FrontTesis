import React, { useState, useEffect } from 'react';
import { getCatedraticosActivos } from '../../../ts/Admin/GetCatedraticoActive';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { asignarCatedraticoComision } from '../../../ts/Admin/AsignaCatedraticoComision';
import Swal from 'sweetalert2';

interface Catedratico {
  user_id: number;
  userName: string;
  profilePhoto: string | null;
  active: boolean;
}

interface ListarCatedraticosModalProps {
  onClose: () => void;
  selectedRow: number | null;
  groupId: number | null;
}

const ROLES_CODIGOS: { [key: string]: number } = {
  Presidente: 1,
  Secretario: 2,
  'Vocal 1': 3,
  'Vocal 2': 4,
  'Vocal 3': 5,
};

const ListarCatedraticosModal: React.FC<ListarCatedraticosModalProps> = ({ onClose, selectedRow, groupId }) => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [selectedCatedratico, setSelectedCatedratico] = useState<Catedratico | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCatedraticos = async () => {
      try {
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear();
        if (perfil.sede) {
          const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, year);
          setCatedraticos(catedraticosRecuperados);
        }
      } catch (error) {
        console.error('Error al recuperar los catedráticos activos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatedraticos();
  }, []);

  const handleSelect = (catedratico: Catedratico) => {
    setSelectedCatedratico(catedratico);
  };

  const handleAssign = async () => {
    if (selectedCatedratico && selectedRow && groupId) {
      try {
        await asignarCatedraticoComision(groupId, {
          user_id: selectedCatedratico.user_id,
          rol_comision_id: selectedRow,
        });

        Swal.fire({
          icon: 'success',
          title: 'Catedrático asignado',
          text: `El catedrático ${selectedCatedratico.userName} ha sido asignado correctamente.`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745',
          customClass: { confirmButton: 'text-white' },
        });

        onClose();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al asignar catedrático',
          text: error.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
          customClass: { confirmButton: 'text-white' },
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (catedraticos.length === 0) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-40 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            No hay catedráticos activos.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const roleText = selectedRow ? Object.keys(ROLES_CODIGOS).find(key => ROLES_CODIGOS[key] === selectedRow) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white dark:bg-boxdark rounded shadow-lg w-full max-w-lg" style={{ height: '540px', top: '40px' }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
          aria-label="close"
        >
          &#10005;
        </button>
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Catedráticos Activos</h2>
        {roleText && (
          <p className="text-center text-black dark:text-white mb-4">Por favor seleccione {roleText}</p>
        )}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto" style={{ maxHeight: '300px' }}>
          {catedraticos.map((catedratico) => (
            <li
              key={catedratico.user_id}
              className={`p-4 flex items-center justify-between ${
                selectedCatedratico?.user_id === catedratico.user_id
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleSelect(catedratico)}
            >
              <div className="flex items-center">
                {catedratico.profilePhoto ? (
                  <img
                    src={catedratico.profilePhoto}
                    alt={catedratico.userName}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full mr-4">
                    {catedratico.userName.charAt(0)}
                  </div>
                )}
                <span className="text-black dark:text-white font-semibold">{catedratico.userName}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <button
            onClick={handleAssign}
            className={`px-4 py-2 bg-primary text-white rounded-lg w-full ${
              !selectedCatedratico ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
            }`}
            disabled={!selectedCatedratico}
          >
            Asignar
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListarCatedraticosModal;
