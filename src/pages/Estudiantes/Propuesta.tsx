import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { subirPropuesta } from '../../ts/Estudiantes/SubirPropuestas';
import { getPropuesta } from '../../ts/Generales/GetPropuesta';
import { getTareasSede, Tarea } from '../../ts/Generales/GetTareasSede';

const Propuesta: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [checkbox3Checked, setCheckbox3Checked] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('Pendiente Aprobar');
  const [approvedProposal, setApprovedProposal] = useState<number>(0);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [sedeId, setSedeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const perfilData = await getDatosPerfil();
        const user_id = perfilData?.user_id;
        const sede = perfilData?.sede;
        setSedeId(sede);

        if (user_id) {
          fetchPropuesta(user_id);
        } else {
          throw new Error('No se pudo obtener el ID del usuario.');
        }
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al obtener los datos iniciales.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-red-600 text-white',
          },
        });
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null) {
        try {
          const currentYear = new Date().getFullYear(); // Obtén el año actual aquí
          const tareas = await getTareasSede(sedeId, currentYear);
          const tareaPropuesta = tareas.find((tarea: Tarea) => tarea.typeTask_id === 1);
          if (tareaPropuesta) {
            setTaskId(tareaPropuesta.task_id);
          } else {
            throw new Error('No se encontró una tarea con typeTask_id = 1.');
          }
        } catch (error: any) {
          
        }
      }
    };

    fetchTareas();
  }, [sedeId]);

  const fetchPropuesta = async (user_id: number) => {
    try {
      const propuestaData = await getPropuesta(user_id);
      if (propuestaData) {
        setPdfUrl(propuestaData.file_path);
        const approvalStatus = propuestaData.approved_proposal;
        setApprovedProposal(approvalStatus);

        if (approvalStatus === 0) {
          setApprovalMessage('Pendiente Aprobar');
          setCheckbox1Checked(false);
          setCheckbox2Checked(false);
          setCheckbox3Checked(false);
        } else if (approvalStatus === 1) {
          setApprovalMessage('Propuesta 1 Aprobada');
          setCheckbox1Checked(true);
          setCheckbox2Checked(false);
          setCheckbox3Checked(false);
        } else if (approvalStatus === 2) {
          setApprovalMessage('Propuesta 2 Aprobada');
          setCheckbox1Checked(false);
          setCheckbox2Checked(true);
          setCheckbox3Checked(false);
        } else if (approvalStatus === 3) {
          setApprovalMessage('Propuesta 3 Aprobada');
          setCheckbox1Checked(false);
          setCheckbox2Checked(false);
          setCheckbox3Checked(true);
        }

        setIsButtonsDisabled(approvalStatus !== 0);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formato no válido',
        text: 'Por favor, selecciona un archivo en formato PDF.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona un archivo PDF antes de continuar.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
      return;
    }
  
    if (!taskId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el task_id para esta tarea.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const perfilData = await getDatosPerfil();
      const user_id = perfilData?.user_id;
  
      if (!user_id) {
        throw new Error('No se pudo recuperar el ID del usuario. Por favor, inténtalo más tarde.');
      }
  
      await subirPropuesta({
        file: pdfFile,
        user_id,
        task_id: taskId,
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Propuesta subida exitosamente',
        text: 'Tu propuesta ha sido subida correctamente.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-green-600 text-white',
        },
      });
  
      setPdfFile(null);
      setPdfUrl(null);
  
      // Volver a ejecutar la API getPropuesta después de guardar
      fetchPropuesta(user_id);
  
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error desconocido al subir la propuesta';
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: errorMessage,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      });
    } finally {
      setLoading(false);
    }
  };  

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/FormatoPropuestaTesis.docx';
    link.download = 'Formato_Propuesta_Tesis.docx';
    link.click();
  };

  return (
    <>
      <Breadcrumb pageName="Propuesta" />

      <div className="max-w-7xl mx-auto p-0 space-y-8">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-5 h-5 text-blue-600 focus:ring-blue-500" checked={checkbox1Checked} disabled />
              <span className="text-gray-800 dark:text-white">Propuesta 1</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-5 h-5 text-blue-600 focus:ring-blue-500" checked={checkbox2Checked} disabled />
              <span className="text-gray-800 dark:text-white">Propuesta 2</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-5 h-5 text-blue-600 focus:ring-blue-500" checked={checkbox3Checked} disabled />
              <span className="text-gray-800 dark:text-white">Propuesta 3</span>
            </label>
          </div>
          <span className={approvalMessage.includes('Aprobada') ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {approvalMessage}
          </span>
        </div>

        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Subir PDF de Propuesta
            </h2>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-700"
              disabled={approvedProposal !== 0} // Bloquear si la propuesta está aprobada
            >
              Descargar Plantilla
            </button>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-gray-500 dark:text-gray-300 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16v4h10v-4m-3-8h-4v4H7m6 0v6h3l4-4m-7 4h3M7 4h10v4H7z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Haz clic para subir un archivo PDF
              </p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={approvedProposal !== 0} // Bloquear si la propuesta está aprobada
            />
          </label>

          {pdfFile && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Archivo seleccionado:</span> {pdfFile.name}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleUpload}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isButtonsDisabled || loading || approvedProposal !== 0} // Bloquear si la propuesta está aprobada
            >
              {loading ? 'Subiendo...' : 'Subir Propuesta'}
            </button>
          </div>
        </div>
      </div>

      {pdfUrl && (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Vista previa del PDF:
          </h3>
          <iframe
            src={pdfUrl}
            title="Vista previa del PDF"
            className="w-full h-[40rem] border-2 border-gray-200 dark:border-gray-600"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Propuesta;
