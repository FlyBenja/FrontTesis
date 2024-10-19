import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Wheel } from 'react-custom-roulette';

interface Estudiante {
  id: number;
  nombre: string;
  fotoPerfil: string;
}

const AsignarTernas: React.FC = () => {
  // Datos simulados de los estudiantes
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);

  // Datos simulados de las ternas
  const ternas = Array.from({ length: 5 }, (_, i) => `Terna ${i + 1}`);

  const [selectedTernaIndex, setSelectedTernaIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinTime, setSpinTime] = useState(0);

  // Datos para la rueda (las ternas)
  const data = ternas.map((terna, index) => ({
    option: terna,
    style: {
      backgroundColor: `hsl(${(index / ternas.length) * 360}, 100%, 50%)`, // Colores arcoíris
      textColor: 'white',
    },
  }));

  // Cargar estudiantes simulados
  useEffect(() => {
    const datosEstudiantes = [
      { id: 1, nombre: 'Luis Alvarado', fotoPerfil: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: 2, nombre: 'María García', fotoPerfil: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { id: 3, nombre: 'Carlos Sánchez', fotoPerfil: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { id: 4, nombre: 'Ana López', fotoPerfil: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 5, nombre: 'Pedro Gómez', fotoPerfil: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 6, nombre: 'Claudia Hernández', fotoPerfil: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { id: 7, nombre: 'Jorge Martínez', fotoPerfil: 'https://randomuser.me/api/portraits/men/4.jpg' },
      { id: 8, nombre: 'Lucía Fernández', fotoPerfil: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { id: 9, nombre: 'Daniel Pérez', fotoPerfil: 'https://randomuser.me/api/portraits/men/5.jpg' },
      { id: 10, nombre: 'Sofía Ramírez', fotoPerfil: 'https://randomuser.me/api/portraits/women/5.jpg' },
      { id: 11, nombre: 'Fernando Rodríguez', fotoPerfil: 'https://randomuser.me/api/portraits/men/6.jpg' },
      { id: 12, nombre: 'Gabriela Torres', fotoPerfil: 'https://randomuser.me/api/portraits/women/6.jpg' },
      { id: 13, nombre: 'Ricardo Ruiz', fotoPerfil: 'https://randomuser.me/api/portraits/men/7.jpg' },
      { id: 14, nombre: 'Patricia Ortiz', fotoPerfil: 'https://randomuser.me/api/portraits/women/7.jpg' },
      { id: 15, nombre: 'David Moreno', fotoPerfil: 'https://randomuser.me/api/portraits/men/8.jpg' },
      { id: 16, nombre: 'Elena Castro', fotoPerfil: 'https://randomuser.me/api/portraits/women/8.jpg' },
      { id: 17, nombre: 'Héctor Gutiérrez', fotoPerfil: 'https://randomuser.me/api/portraits/men/9.jpg' },
      { id: 18, nombre: 'Verónica Jiménez', fotoPerfil: 'https://randomuser.me/api/portraits/women/9.jpg' },
      { id: 19, nombre: 'Manuel Silva', fotoPerfil: 'https://randomuser.me/api/portraits/men/10.jpg' },
      { id: 20, nombre: 'Isabel Molina', fotoPerfil: 'https://randomuser.me/api/portraits/women/10.jpg' },
    ];
    setEstudiantes(datosEstudiantes);
  }, []);

  // Función para iniciar el giro
  const spinRoulette = () => {
    if (!selectedEstudiante || isSpinning) return; // Evitar que gire sin seleccionar estudiante y si ya está girando
    setIsSpinning(true);

    // Configurar la duración total del giro para dar exactamente 15 vueltas rápidas a 0.25 segundos por vuelta
    const totalSpinTime = 50 * 0.01; // 15 vueltas a 0.25 segundos por vuelta

    // Selecciona una terna aleatoria para detenerse
    const randomIndex = Math.floor(Math.random() * ternas.length);

    setSpinTime(totalSpinTime);
    setSelectedTernaIndex(randomIndex);
  };

  // Al detener el giro, mostrar la terna final y reiniciar valores
  const handleStopSpinning = () => {
    setIsSpinning(false);
    if (selectedTernaIndex !== null) {
      console.log(`Terna seleccionada: ${ternas[selectedTernaIndex]}`);
    }

    // Reiniciar la selección después de que se detenga la ruleta
    setSelectedEstudiante(null);
    setSelectedTernaIndex(null);
  };

  return (
    <>
      <Breadcrumb pageName="Asignar Ternas" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Listado de Estudiantes:</h2>

        {/* Listado de Estudiantes en el mismo formato que los Catedráticos */}
        <div className="flex overflow-x-auto space-x-4 mb-8">
          <div className="flex space-x-4">
            {estudiantes.map((estudiante) => (
              <div
                key={estudiante.id}
                onClick={() => setSelectedEstudiante(estudiante)}
                className={`cursor-pointer flex flex-col items-center w-32 p-4 border border-gray-200 rounded-lg shadow-md ${
                  selectedEstudiante?.id === estudiante.id
                    ? 'bg-blue-400 text-white dark:bg-white dark:text-black' // Color en modo claro y oscuro
                    : 'bg-white dark:bg-boxdark dark:text-white'
                }`}
              >
                <img src={estudiante.fotoPerfil} alt={estudiante.nombre} className="w-20 h-20 rounded-full" />
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold">{estudiante.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ruleta de Ternas */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Ternas:</h2>
          <div className="flex justify-center items-center">
            <Wheel
              mustStartSpinning={isSpinning}
              prizeNumber={selectedTernaIndex ?? 0}
              data={data}
              onStopSpinning={handleStopSpinning}
              backgroundColors={['#A7C7E7', '#B0E0E6']} // Colores arcoíris dinámicos
              textColors={['#ffffff']}
              outerBorderWidth={5}
              radiusLineWidth={0}
              spinDuration={spinTime} // Controla la duración del giro (más vueltas rápidas)
              innerBorderColor="lightblue" // Ligeros ajustes estéticos
            />
          </div>
        </div>

        {/* Botón para girar la ruleta */}
        <div className="mt-6 text-center">
          <button
            onClick={spinRoulette}
            className={`px-4 py-2 bg-primary text-white rounded-lg ${
              isSpinning || !selectedEstudiante ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
            }`}
            disabled={isSpinning || !selectedEstudiante}
          >
            {isSpinning ? 'Girando...' : 'Girar Ruleta'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AsignarTernas;
