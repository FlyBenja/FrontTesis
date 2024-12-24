import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { getPropuesta } from '../../../ts/Generales/GetPropuesta';
import { aprobarPropuesta } from '../../../ts/Admin/AprobarPropuesta';  // Asegúrate de importar la función

interface Propuesta {
  id: number;
  titulo: string;
}

interface LocationState {
  tarea: string;
  estudiante: { id: number; userName: string };
  selectedAño: number;
}

const Propuestas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { estudiante } = location.state as LocationState;
  const userId = estudiante ? estudiante.id : null;

  const [propuestas] = useState<Propuesta[]>([
    { id: 1, titulo: 'Propuesta 1' },
    { id: 2, titulo: 'Propuesta 2' },
    { id: 3, titulo: 'Propuesta 3' },
  ]);
  const [selectedPropuesta, setSelectedPropuesta] = useState<number | null>(null);
  const [aprobadaPropuesta, setAprobadaPropuesta] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [noPropuestas, setNoPropuestas] = useState<boolean>(false);
  const [thesisSubmissionsId, setThesisSubmissionsId] = useState<number | null>(null);

  const fetchPropuesta = async (user_id: number) => {
    try {
      const propuestaData = await getPropuesta(user_id);
      if (propuestaData) {
        setPdfUrl(propuestaData.file_path);
        setThesisSubmissionsId(propuestaData.thesisSubmissions_id);

        if (propuestaData.approved_proposal === 0) {
          setAprobadaPropuesta(null);
        } else {
          setAprobadaPropuesta(propuestaData.approved_proposal);
          setSelectedPropuesta(propuestaData.approved_proposal);
        }
      } else {
        setNoPropuestas(true);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener la propuesta',
        text: 'No se pudo cargar la propuesta.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPropuesta(userId);  
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID del estudiante.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
    }
  }, [userId]);

  const handleSelectPropuesta = (id: number) => {
    if (aprobadaPropuesta === null) {
      setSelectedPropuesta(id);
    }
  };

  const handleAprobarPropuesta = async () => {
    if (selectedPropuesta !== null && thesisSubmissionsId !== null && userId !== null) {
      const approvedProposalValue = selectedPropuesta;  // Asignar el valor de la propuesta seleccionada

      try {
        // Llamada a la API para aprobar la propuesta
        await aprobarPropuesta(thesisSubmissionsId, userId, approvedProposalValue);

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Propuesta Aprobada',
          text: `La propuesta ${selectedPropuesta} ha sido aprobada correctamente.`,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-green-600 text-white',
          },
        });

        // Actualizar el estado
        setAprobadaPropuesta(selectedPropuesta);
        setSelectedPropuesta(null);

      } catch (error: any) {
        // Mostrar mensaje de error según lo que la API regresa
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar la propuesta',
          text: error?.response?.data?.message || 'No se pudo aprobar la propuesta.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-red-600 text-white',
          },
        });
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Propuestas del Estudiante" />

      <div className="mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4">
        {noPropuestas ? (
          <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6 flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-white text-center">
              Estudiante No Ha Subido Sus Propuestas
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                Seleccione una Propuesta
              </h3>
              <div className="space-y-3">
                {propuestas.map((propuesta) => (
                  <div
                    key={propuesta.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition ${aprobadaPropuesta === propuesta.id
                        ? 'bg-green-500 text-white'
                        : selectedPropuesta === propuesta.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    onClick={() => handleSelectPropuesta(propuesta.id)}
                  >
                    <input
                      type="radio"
                      checked={selectedPropuesta === propuesta.id}
                      onChange={() => handleSelectPropuesta(propuesta.id)}
                      className="mr-2 cursor-pointer"
                      disabled={aprobadaPropuesta !== null}
                    />
                    <label className="cursor-pointer">{propuesta.titulo}</label>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  className={`w-full px-4 py-3 rounded-md text-white transition ${(selectedPropuesta === null || [1, 2, 3].includes(aprobadaPropuesta ?? 0))
                      ? 'bg-gray-400 cursor-not-allowed' // Gris cuando está deshabilitado
                      : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  onClick={handleAprobarPropuesta}
                  disabled={selectedPropuesta === null || [1, 2, 3].includes(aprobadaPropuesta ?? 0)}
                >
                  Aprobar Propuesta
                </button>
              </div>
            </div>

            {pdfUrl && (
              <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                  Visualización de Documento PDF
                </h3>
                <iframe
                  src={pdfUrl}
                  title="Vista PDF"
                  className="w-full h-[600px] rounded-md shadow-sm"
                ></iframe>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Propuestas;
