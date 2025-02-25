import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getRevisionDetallePendi } from '../../ts/Cordinador/GetRevisionDetallePendi';

const HistorialDetalle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
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

                <div className="ml-4">
                  <p className="text-gray-700 dark:text-gray-300">Nombre: {revision.user.name}</p>
                  <p className="text-gray-700 dark:text-gray-300">Correo: {revision.user.email}</p>
                  <p className="text-gray-700 dark:text-gray-300">Carnet: {revision.user.carnet}</p>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-gray-700 dark:text-gray-300">Año: {revision.user.year.year}</p>
                  <p className="text-gray-700 dark:text-gray-300">Sede: {revision.user.location.nameSede}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-gray-700 dark:text-gray-300">
                  Fecha de revisión: {new Date(revision.date_revision).toLocaleDateString()}
                </p>
                <p className={`text-sm font-semibold ${revision.active_process ? 'text-green-500' : 'text-red-500'}`}>
                  Estado: {revision.active_process ? 'En proceso' : 'Finalizado'}
                </p>
              </div>

              {revision.thesis_dir && (
                <div className="mt-4">
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => handleDownload(revision.thesis_dir, `tesis_${revision.user.carnet}.pdf`)}
                  >
                    Descargar Tesis
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Cargando información o no hay revisiones pendientes...</p>
        )}
      </div>
    </>
  );
};

export default HistorialDetalle;
