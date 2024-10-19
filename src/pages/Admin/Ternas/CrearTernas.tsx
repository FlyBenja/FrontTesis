import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Catedratico {
  id: number;
  nombre: string;
  fotoPerfil: string;
}

const CrearTernas: React.FC = () => {
  // Listado simulado de 30 catedráticos
  const [catedraticos] = useState<Catedratico[]>([
    { id: 1, nombre: 'Dr. Juan Pérez', fotoPerfil: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, nombre: 'Lic. María López', fotoPerfil: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 3, nombre: 'Ing. Carlos Martínez', fotoPerfil: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 4, nombre: 'Lic. Ana Gómez', fotoPerfil: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 5, nombre: 'Dr. José Ramírez', fotoPerfil: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 6, nombre: 'Ing. Pedro Sánchez', fotoPerfil: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 7, nombre: 'Lic. Luisa Castro', fotoPerfil: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 8, nombre: 'Dr. Manuel Ruiz', fotoPerfil: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: 9, nombre: 'Lic. Sonia Torres', fotoPerfil: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: 10, nombre: 'Ing. Andrés Herrera', fotoPerfil: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { id: 11, nombre: 'Dr. José Morales', fotoPerfil: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: 12, nombre: 'Lic. Laura Ortega', fotoPerfil: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { id: 13, nombre: 'Ing. Fernando Díaz', fotoPerfil: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { id: 14, nombre: 'Lic. Rosa Melgar', fotoPerfil: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { id: 15, nombre: 'Dr. Ernesto Gutiérrez', fotoPerfil: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { id: 16, nombre: 'Ing. Sara Navarro', fotoPerfil: 'https://randomuser.me/api/portraits/women/7.jpg' },
    { id: 17, nombre: 'Dr. Gabriel Flores', fotoPerfil: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { id: 18, nombre: 'Lic. Carmen Pérez', fotoPerfil: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { id: 19, nombre: 'Ing. Luis Hernández', fotoPerfil: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { id: 20, nombre: 'Lic. Isabel Vargas', fotoPerfil: 'https://randomuser.me/api/portraits/women/9.jpg' },
    { id: 21, nombre: 'Dr. Oscar Velázquez', fotoPerfil: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { id: 22, nombre: 'Lic. Estela Ortiz', fotoPerfil: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { id: 23, nombre: 'Ing. Enrique Castro', fotoPerfil: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { id: 24, nombre: 'Lic. Gloria Jiménez', fotoPerfil: 'https://randomuser.me/api/portraits/women/11.jpg' },
    { id: 25, nombre: 'Dr. Julio Ríos', fotoPerfil: 'https://randomuser.me/api/portraits/men/14.jpg' },
    { id: 26, nombre: 'Lic. Claudia Aguilar', fotoPerfil: 'https://randomuser.me/api/portraits/women/12.jpg' },
    { id: 27, nombre: 'Ing. David Cruz', fotoPerfil: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { id: 28, nombre: 'Lic. Paola Figueroa', fotoPerfil: 'https://randomuser.me/api/portraits/women/13.jpg' },
    { id: 29, nombre: 'Dr. Sergio Villanueva', fotoPerfil: 'https://randomuser.me/api/portraits/men/16.jpg' },
    { id: 30, nombre: 'Lic. Alicia Peña', fotoPerfil: 'https://randomuser.me/api/portraits/women/14.jpg' },
  ]);

  // Catedráticos arrastrados a la card
  const [terna, setTerna] = useState<Catedratico[]>([]);

  // Función para manejar el arrastre de catedráticos
  const handleDrag = (catedratico: Catedratico) => {
    if (terna.length < 3 && !terna.includes(catedratico)) {
      setTerna([...terna, catedratico]);
    }
  };

  // Función para crear la terna (simulado)
  const handleCrearTerna = () => {
    if (terna.length === 3) {
      console.log('Terna creada:', terna);
      // Aquí puedes hacer la llamada a la API o realizar la acción deseada
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
      <Breadcrumb pageName="Crear Ternas" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Catedráticos:</h2>

        {/* Listado de Catedráticos en dos columnas con scroll horizontal */}
        <div className="flex overflow-x-auto space-x-4 mb-8">
          <div className="flex space-x-4">
            {catedraticos.map((catedratico) => (
              <div
                key={catedratico.id}
                draggable
                onDragEnd={() => handleDrag(catedratico)}
                className={`cursor-pointer flex flex-col items-center w-32 p-4 border border-gray-200 rounded-lg shadow-md ${
                  terna.includes(catedratico)
                    ? 'bg-blue-400 text-white dark:bg-white dark:text-black' // Color en modo claro y oscuro
                    : 'bg-white dark:bg-boxdark dark:text-white'
                }`}
              >
                <img src={catedratico.fotoPerfil} alt={catedratico.nombre} className="w-20 h-20 rounded-full" />
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold">{catedratico.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Ternas */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Terna:</h2>
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-boxdark dark:text-white">
            {terna.length === 0 && <p className="text-gray-400">Presidente</p>}
            {terna.map((catedratico, index) => (
              <div key={catedratico.id} className="mb-2">
                <span className="font-bold">{getRoleForIndex(index)}:</span> {catedratico.nombre}
              </div>
            ))}
            {terna.length === 1 && <p className="text-gray-400">Secretario</p>}
            {terna.length === 2 && <p className="text-gray-400">Vocal</p>}
          </div>

          {/* Botón para crear la terna */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCrearTerna}
              className={`px-4 py-2 bg-primary text-white rounded-lg ${terna.length !== 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
              disabled={terna.length !== 3}
            >
              Crear Terna
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrearTernas;
  