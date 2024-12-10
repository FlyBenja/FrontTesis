import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticosActivos } from '../../../ts/Admin/GetCatedraticoActive';
import { createComision } from '../../../ts/Admin/CreateComision';

interface Catedratico {
  user_id: number;
  userName: string;
  profilePhoto: string | null;
  active: boolean;
}

const CrearComision: React.FC = () => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [terna, setTerna] = useState<Catedratico[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear().toString();

        if (perfil.sede) {
          const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, parseInt(year));
          setCatedraticos(catedraticosRecuperados);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false); // Terminar carga
      }
    };

    fetchData();
  }, []);

  const handleDrag = (catedratico: Catedratico) => {
    if (terna.length < 5 && !terna.includes(catedratico)) {
      setTerna([...terna, catedratico]);
    }
  };

  const handleRemoveLast = () => {
    setTerna(terna.slice(0, -1));
  };

  const handleCreateComision = async () => {
    try {
      const perfil = await getDatosPerfil();
      const year = new Date().getFullYear();

      if (!perfil.sede) {
        showAlert('error', '¡Error!', 'No se pudo recuperar la sede.');
        return;
      }

      const groupData = terna.map((catedratico, index) => ({
        user_id: catedratico.user_id,
        rol_comision_id: index + 1,
      }));

      const comisionData = {
        year,
        sede_id: perfil.sede,
        groupData,
      };

      // Intentar crear la comisión
      await createComision(comisionData);

      showAlert('success', '¡Éxito!', 'La comisión fue creada exitosamente.');

      // Recargar catedráticos activos
      const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, year);
      setCatedraticos(catedraticosRecuperados);
      setTerna([]);
    } catch (error: any) {
      console.error('Error al crear la comisión:', error.message);
      showAlert('error', '¡Error!', error.message);
    }
  };

  const showAlert = (type: 'success' | 'error', title: string, text: string) => {
    const confirmButtonColor = type === 'success' ? '#28a745' : '#dc3545';
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor,
      confirmButtonText: 'OK',
    });
  };

  const getRoleForIndex = (index: number) => {
    switch (index) {
      case 0: return 'Presidente';
      case 1: return 'Secretario';
      case 2: return 'Vocal 1';
      case 3: return 'Vocal 2';
      case 4: return 'Vocal 3';
      default: return '';
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
            No Hay Catedráticos Activos En Esta Sede.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Crear Comisión" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Catedráticos:</h2>

        <div className="flex overflow-x-auto space-x-4 mb-8">
          {catedraticos.map((catedratico) => (
            <div
              key={catedratico.user_id}
              draggable
              onDragEnd={() => handleDrag(catedratico)}
              className={`cursor-pointer flex flex-col items-center w-32 p-4 border border-gray-200 rounded-lg shadow-md ${terna.includes(catedratico)
                ? 'bg-blue-400 text-white dark:bg-white dark:text-black'
                : 'bg-white dark:bg-boxdark dark:text-white'
                }`}
            >
              {catedratico.profilePhoto ? (
                <img
                  src={catedratico.profilePhoto}
                  alt={catedratico.userName}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-blue-500 text-white rounded-full">
                  {catedratico.userName.charAt(0)}
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold">{catedratico.userName}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Comisión:</h2>
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-boxdark dark:text-white">
            {terna.length === 0 && <p className="text-gray-400 text-left">Presidente</p>}
            {terna.map((catedratico, index) => (
              <div key={catedratico.user_id} className="mb-2 flex">
                <span className="font-bold text-left">{getRoleForIndex(index)}:</span>
                <span className="text-left ml-2">{catedratico.userName}</span>
              </div>
            ))}
            {terna.length === 1 && <p className="text-gray-400 text-left">Secretario</p>}
            {terna.length === 2 && <p className="text-gray-400 text-left">Vocal 1</p>}
            {terna.length === 3 && <p className="text-gray-400 text-left">Vocal 2</p>}
            {terna.length === 4 && <p className="text-gray-400 text-left">Vocal 3</p>}
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleRemoveLast}
            className={`px-4 py-2 bg-red-500 text-white rounded-lg ${terna.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
            disabled={terna.length === 0}
          >
            Quitar Último
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleCreateComision}
            className={`px-4 py-2 bg-primary text-white rounded-lg ${terna.length < 3 || terna.length > 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            disabled={terna.length < 3 || terna.length > 5}
          >
            Crear Comisión
          </button>
        </div>
      </div>
    </>
  );
};

export default CrearComision;
