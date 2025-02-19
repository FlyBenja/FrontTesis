import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AsignaRevisor from '../../components/Modals/AsignaRevisor/AsignaRevisor';
import { getRevisionDetallePendi } from '../../ts/Cordinador/GetRevisionDetallePendi';

const RevisionEstudiante: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revisiones, setRevisiones] = useState<any[]>([]);

  const userId = location.state?.userId;

  useEffect(() => {
    if (userId) {
      const fetchRevisiones = async () => {
        try {
          const data = await getRevisionDetallePendi(userId);
          setRevisiones(data);
        } catch (error) {
          console.error('Error al obtener detalles de revisiones pendientes:', error);
        }
      };

      fetchRevisiones();
    }
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Breadcrumb pageName="Revisión de estudiante" />

      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        {revisiones.length > 0 ? (
          revisiones.map((revision) => (
            <div key={revision.revision_thesis_id} className="mb-6 border-b pb-4">
              <div className="flex items-center">
                {/* Foto de perfil o inicial */}
                {revision.user.profilePhoto ? (
                  <img
                    src={revision.user.profilePhoto}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
                    {revision.user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Información del estudiante */}
                <div className="ml-4">
                  <p className="text-gray-700 dark:text-gray-300">Nombre: {revision.user.name}</p>
                  <p className="text-gray-700 dark:text-gray-300">Correo: {revision.user.email}</p>
                  <p className="text-gray-700 dark:text-gray-300">Carnet: {revision.user.carnet}</p>
                </div>

                {/* Año y sede */}
                <div className="ml-auto text-right">
                  <p className="text-gray-700 dark:text-gray-300">Año: {revision.user.year.year}</p>
                  <p className="text-gray-700 dark:text-gray-300">Sede: {revision.user.location.nameSede}</p>
                </div>
              </div>

              {/* Fecha de revisión y estado */}
              <div className="mt-2">
                <p className="text-gray-700 dark:text-gray-300">
                  Fecha de revisión: {new Date(revision.date_revision).toLocaleDateString()}
                </p>
                <p className={`text-sm font-semibold ${revision.active_process ? 'text-green-500' : 'text-red-500'}`}>
                  Estado: {revision.active_process ? 'En proceso' : 'Finalizado'}
                </p>
              </div>

              {/* Botón para descargar tesis si existe */}
              {revision.thesis_dir && (
                <div className="mt-4">
                  <a
                    href={revision.thesis_dir}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg inline-block"
                  >
                    Descargar Tesis
                  </a>
                </div>
              )}

              {/* Vista previa del PDF si existe */}
              {revision.thesis_dir && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vista previa del PDF</h3>
                  <iframe
                    src={revision.thesis_dir}
                    width="100%"
                    height="400"
                    className="mt-2"
                  ></iframe>
                </div>
              )}

              {/* Botón para asignar revisor */}
              <div className="mt-4 text-right">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={handleOpenModal}
                >
                  Asignar Revisor
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Cargando información o no hay revisiones pendientes...</p>
        )}
      </div>

      {isModalOpen && <AsignaRevisor onClose={handleCloseModal} />}
    </>
  );
};

export default RevisionEstudiante;
