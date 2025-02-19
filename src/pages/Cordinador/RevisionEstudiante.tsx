import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AsignaRevisor from '../../components/Modals/AsignaRevisor/AsignaRevisor';

const RevisionEstudiante: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Breadcrumb pageName="Revisión de estudiante" />

      {/* Botón para regresar */}
      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex justify-between items-center">
          {/* Foto de perfil */}
          <img
            src="https://via.placeholder.com/100"
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full"
          />

          {/* Información del estudiante (nombre, correo, carnet) */}
          <div className="ml-4">
            <p className="text-gray-700 dark:text-gray-300">Nombre: Axel Emiliano Herrera Muñoz</p>
            <p className="text-gray-700 dark:text-gray-300">Correo: axel@example.com</p>
            <p className="text-gray-700 dark:text-gray-300">Carnet: 1890-21-9415</p>
          </div>

          {/* Año y sede */}
          <div className="text-right">
            <p className="text-gray-700 dark:text-gray-300">Año: 2024</p>
            <p className="text-gray-700 dark:text-gray-300">Sede: Central</p>
          </div>
        </div>

        {/* Botón para descargar tesis */}
        <div className="mt-4">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
            Descargar Tesis
          </button>
        </div>

        {/* Vista previa del PDF */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vista previa del PDF</h3>
          <iframe
            src="https://via.placeholder.com/500x400"
            width="100%"
            height="400"
            className="mt-2"
          ></iframe>
        </div>
        {/* Botón para asignar revisor alineado a la derecha */}
        <div className="mt-4 text-right">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleOpenModal}
          >
            Asignar Revisor
          </button>
        </div>
      </div>

      {isModalOpen && <AsignaRevisor onClose={handleCloseModal} />}
    </>
  );
};

export default RevisionEstudiante;
