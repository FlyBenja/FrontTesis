import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getComentariosRevision } from '../../ts/CoordinadorTesis/GetComentariosRevision';

const RevisionEstudianteComentarios: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [revisiones, setRevisiones] = useState<any[]>([]);

  const userId = location.state?.userId;

  useEffect(() => {
    if (userId) {
      const fetchRevisiones = async () => {
        try {
          const data = await getComentariosRevision(userId);
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
              <div className="flex items-center justify-between mb-4">
                {/* Foto de perfil y Datos del Alumno */}
                <div className="flex items-center mr-12">
                  {/* Foto de perfil */}
                  <div className="mr-6">
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
                  </div>

                  {/* Datos del Alumno */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Datos del Alumno</h3>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Nombre:</strong> {revision.user.name}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Carne:</strong> {revision.user.carnet}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Correo:</strong> {revision.user.email}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Sede:</strong> {revision.user.location.nameSede}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Año:</strong> {revision.user.year.year}</p>
                  </div>
                </div>

                {/* Datos del Revisor */}
                <div className="flex items-start flex-col mr-12 self-start">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center">Datos del Revisor</h3>
                  {revision.AssignedReviews.map((assignedReview: any) => (
                    <div key={assignedReview.assigned_review_id} className="mb-2">
                      <p className="text-gray-700 dark:text-gray-300"><strong>Nombre:</strong> {assignedReview.user.name}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Correo:</strong> {assignedReview.user.email}</p>
                    </div>
                  ))}
                </div>

                {/* Datos de la Sede */}
                <div className="flex items-start flex-col text-right self-start">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Datos de la Sede</h3>
                  <p className="text-gray-700 dark:text-gray-300"><strong>Sede:</strong> Guastatoya</p>
                  <p className="text-gray-700 dark:text-gray-300"><strong>Año:</strong> 2025</p>
                </div>
              </div>

              {/* Estado y Fecha de Revisión */}
              <div className="mt-2">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Fecha de Revisión: </strong>
                  {revision.approvaltheses[0]?.status === 'approved' && revision.approvaltheses[0]?.date_approved
                    ? (
                      <div className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                        <p className="text-sm text-black dark:text-white">
                          {new Date(new Date(revision.approvaltheses[0].date_approved).setDate(new Date(revision.approvaltheses[0].date_approved).getDate() + 1)).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-xs">
                          {new Date(new Date(revision.approvaltheses[0].date_approved).setDate(new Date(revision.approvaltheses[0].date_approved).getDate() + 1)).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          / {new Date(new Date(revision.approvaltheses[0].date_approved).setDate(new Date(revision.approvaltheses[0].date_approved).getDate() + 1)).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                    )
                    : (
                      <div className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                        <p className="text-sm text-black dark:text-white">
                          {new Date(revision.AssignedReviews[0]?.date_assigned || '').toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-xs">
                          {new Date(revision.AssignedReviews[0]?.date_assigned || '').toLocaleDateString('es-ES', {
                            weekday: 'long',
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          / {new Date(revision.AssignedReviews[0]?.date_assigned || '').toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                </p>
                <p className={`text-sm font-semibold ${revision.active_process ? 'text-green-500' : 'text-red-500'}`}>
                  <strong>Estado:</strong> {revision.active_process ? 'En proceso' : 'Finalizado'}
                </p>
              </div>

              {/* Descargar Tesis */}
              {revision.thesis_dir && (
                <div className="mt-4">
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => handleDownload(revision.thesis_dir, `tesis_${revision.AssignedReviews[0].user.user_id}.pdf`)}
                  >
                    Descargar Tesis
                  </button>
                </div>
              )}

              {/* Comentarios del Revisor */}
              {revision.AssignedReviews.map((assignedReview: any) => (
                <div key={assignedReview.assigned_review_id} className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Comentarios del Revisor</h3>
                  {assignedReview.commentsRevisions.map((comment: any) => (
                    <div key={comment.date_comment} className="mb-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">{comment.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{comment.comment}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{new Date(comment.date_comment).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Cargando información o no hay revisiones pendientes...</p>
        )}
      </div>
    </>
  );
};

export default RevisionEstudianteComentarios;
