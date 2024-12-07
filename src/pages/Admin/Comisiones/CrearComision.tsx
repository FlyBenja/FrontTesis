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
  const [apiLoading, setApiLoading] = useState(false);

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
        showAlert('error', '¡Error!', 'No se pudieron cargar los catedráticos.');
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
    // Elimina el último catedrático de la terna
    setTerna(terna.slice(0, -1));
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

  const handleCrearComision = async () => {
    if (terna.length < 3 || terna.length > 5) {
      showAlert('error', '¡Error!', 'El número de integrantes debe estar entre 3 y 5.');
      return;
    }
  
    const year = new Date().getFullYear();
    const perfil = await getDatosPerfil();
  
    if (!perfil?.sede) {
      showAlert('error', '¡Error!', 'No se pudo determinar la sede.');
      return;
    }
  
    setApiLoading(true);
  
    try {
      const groupData = terna.map((catedratico, index) => ({
        user_id: catedratico.user_id,
        rol_comision_id: index + 1,
      }));
  
      // Llamar a la API para crear la comisión
      await createComision({
        year,
        sede_id: perfil.sede,
        groupData,
      });

      // Si la creación es exitosa, mostrar la alerta de éxito
      showAlert('success', '¡Éxito!', 'La comisión se ha creado exitosamente.');
      setTerna([]); // Reinicia la terna seleccionada
  
      // Vuelve a cargar los catedráticos activos
      const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, year);
      setCatedraticos(catedraticosRecuperados); // Actualiza el listado de catedráticos activos
    } catch (error) {
      // Si hay error, mostrar el mensaje de error correspondiente
      if (error instanceof Error) {
        showAlert('error', '¡Error!', error.message);  // Utiliza el mensaje de error proporcionado por la API
      } else {
        showAlert('error', '¡Error!', 'Ocurrió un error inesperado.');
      }
    } finally {
      setApiLoading(false);
    }
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
            onClick={handleCrearComision}
            className={`px-4 py-2 bg-primary text-white rounded-lg ${terna.length < 3 || terna.length > 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            disabled={terna.length < 3 || terna.length > 5}
          >
            Crear Comisión
          </button>
        </div>
      </div>

      {apiLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Creando la comisión, espere un momento...</div>
        </div>
      )}
    </>
  );
};

export default CrearComision;
