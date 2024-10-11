import React, { useState } from 'react';
import CreaTarea from '../components/Modals/CreaTarea';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  tipo: 'Capítulo' | 'Propuesta de Tesis';
}

const CrearTareas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tareas: Tarea[] = [
    {
      id: 1,
      titulo: 'Propuesta de Tesis',
      descripcion: 'Propuesta inicial para el proyecto de tesis.',
      fechaEntrega: '2024-01-10',
      tipo: 'Propuesta de Tesis',
    },
    {
      id: 2,
      titulo: 'Capítulo 1: Introducción',
      descripcion: 'Redactar la introducción del proyecto de tesis.',
      fechaEntrega: '2024-02-15',
      tipo: 'Capítulo',
    },
    {
      id: 3,
      titulo: 'Capítulo 2: Marco Teórico',
      descripcion: 'Desarrollar el marco teórico del proyecto.',
      fechaEntrega: '2024-03-01',
      tipo: 'Capítulo',
    },
    {
      id: 4,
      titulo: 'Capítulo 3: Metodología',
      descripcion: 'Escribir la metodología utilizada en el proyecto.',
      fechaEntrega: '2024-04-10',
      tipo: 'Capítulo',
    },
    {
      id: 5,
      titulo: 'Capítulo 4: Resultados',
      descripcion: 'Presentar los resultados obtenidos del proyecto.',
      fechaEntrega: '2024-05-05',
      tipo: 'Capítulo',
    },
    {
      id: 6,
      titulo: 'Capítulo 5: Conclusiones',
      descripcion: 'Redactar las conclusiones y recomendaciones.',
      fechaEntrega: '2024-06-15',
      tipo: 'Capítulo',
    },
  ];

  const [selectedCurso, setSelectedCurso] = useState('');

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      {/* Seleccionador de Cursos y Botón de Crear Tarea en la misma línea */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedCurso}
          onChange={handleCourseChange}
          className="w-3/5 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
        >
          <option value="">Seleccionar curso</option>
          <option value="Matemáticas">Matemáticas</option>
          <option value="Ciencias">Ciencias</option>
          <option value="Historia">Historia</option>
        </select>
        <button
          className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Crear Tarea
        </button>
      </div>

      {/* Listado de Tareas */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">Capítulos y Propuestas</h3>
        <ul className="space-y-4">
          {tareas.map((tarea) => (
            <li key={tarea.id} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-black dark:text-white">{tarea.titulo}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tarea.descripcion}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                Fecha de entrega: {tarea.fechaEntrega}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para crear nueva tarea */}
      {isModalOpen && <CreaTarea onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CrearTareas;
