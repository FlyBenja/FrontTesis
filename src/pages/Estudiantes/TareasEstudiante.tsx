import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  tipo: 'Capítulo' | 'Propuesta de Tesis';
}

const TareasEstudiante: React.FC = () => {
  // Datos simulados de tareas
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

  return (
    <>
      <Breadcrumb pageName="Tareas del Estudiante" />
      <div className="mx-auto max-w-5xl px-4 py-4">

        {/* Propuesta de Tesis */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-boxdark rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-primary">Propuesta de Tesis</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tareas[0].descripcion}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Fecha de entrega: {tareas[0].fechaEntrega}
          </p>
        </div>

        {/* Listado de Tareas */}
        <div>
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Capítulos</h3>
          <ul className="space-y-4">
            {tareas.slice(1).map((tarea) => (
              <li key={tarea.id} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-black dark:text-white">{tarea.titulo}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tarea.descripcion}
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Fecha de entrega: {tarea.fechaEntrega}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TareasEstudiante;
