import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getCatedraticosActivos } from '../../../ts/Admin/GetCatedraticoActive'; 

interface Catedratico {
  user_id: number;
  userName: string;
  profilePhoto: string | null;
  active: boolean;
}

const CrearComision: React.FC = () => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [terna, setTerna] = useState<Catedratico[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Recuperar la sede y el año actual
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear().toString();

        // Llamar a la API para obtener los catedráticos activos
        if (perfil.sede) {
          const catedraticosRecuperados = await getCatedraticosActivos(perfil.sede, parseInt(year));
          setCatedraticos(catedraticosRecuperados); // Guardar los catedráticos activos
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []); // Llamar solo una vez al montar el componente

  // Función para manejar el arrastre de catedráticos
  const handleDrag = (catedratico: Catedratico) => {
    if (terna.length < 3 && !terna.includes(catedratico)) {
      setTerna([...terna, catedratico]);
    }
  };

  // Función para quitar la última persona seleccionada
  const handleRemoveLast = () => {
    setTerna(terna.slice(0, -1)); // Elimina el último catedrático de la terna
  };

  // Función para crear la comision (simulado)
  const handleCrearComision = () => {
    if (terna.length === 3) {
      console.log('Terna creada:', terna);
      setTerna([]); // Reiniciar la terna después de crearla
    }
  };

  // Mostrar el rol correspondiente en función del índice
  const getRoleForIndex = (index: number) => {
    switch (index) {
      case 0:
        return 'Presidente';
      case 1:
        return 'Secretario';
      case 2:
        return 'Vocal';
      default:
        return '';
    }
  };

  return (
    <>
      <Breadcrumb pageName="Crear Comision" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Catedráticos:</h2>

        {/* Listado de Catedráticos en dos columnas con scroll horizontal */}
        <div className="flex overflow-x-auto space-x-4 mb-8">
          <div className="flex space-x-4">
            {catedraticos.map((catedratico) => (
              <div
                key={catedratico.user_id}
                draggable
                onDragEnd={() => handleDrag(catedratico)}
                className={`cursor-pointer flex flex-col items-center w-32 p-4 border border-gray-200 rounded-lg shadow-md ${
                  terna.includes(catedratico)
                    ? 'bg-blue-400 text-white dark:bg-white dark:text-black' // Color en modo claro y oscuro
                    : 'bg-white dark:bg-boxdark dark:text-white'
                }`}
              >
                {/* Foto de perfil o inicial */}
                {catedratico.profilePhoto ? (
                  <img
                    src={catedratico.profilePhoto}
                    alt={catedratico.userName}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 bg-blue-500 text-white rounded-full">
                    {catedratico.userName.charAt(0)} {/* Primera letra del nombre */}
                  </div>
                )}
                
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold">{catedratico.userName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Ternas */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Comision:</h2>
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-boxdark dark:text-white">
            {terna.length === 0 && <p className="text-gray-400">Presidente</p>}
            {terna.map((catedratico, index) => (
              <div key={catedratico.user_id} className="mb-2">
                <span className="font-bold">{getRoleForIndex(index)}:</span> {catedratico.userName}
              </div>
            ))}
            {terna.length === 1 && <p className="text-gray-400">Secretario</p>}
            {terna.length === 2 && <p className="text-gray-400">Vocal</p>}
          </div>

          {/* Botón para quitar la última persona seleccionada */}
          <div className="mt-4 text-center">
            <button
              onClick={handleRemoveLast}
              className={`px-4 py-2 bg-red-500 text-white rounded-lg ${terna.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
              disabled={terna.length === 0}
            >
              Quitar Última Persona Seleccionada
            </button>
          </div>

          {/* Botón para crear la Comision */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCrearComision}
              className={`px-4 py-2 bg-primary text-white rounded-lg ${terna.length !== 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
              disabled={terna.length !== 3}
            >
              Crear Comision
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrearComision;
