import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { cargarCatedraticos } from '../../../ts/CoordinadorSede/CargaCatedraticos';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

const SubirCatedraticos = () => {
  // State variables to manage selected file, API loading status, and sedeId
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [sedeId, setSedeId] = useState<number | null>(null);
  const fileInputRef = React.createRef<HTMLInputElement>();

  // Fetch sedeId from user profile on component mount
  useEffect(() => {
    const fetchSedeId = async () => {
      try {
        const { sede } = await getDatosPerfil();
        setSedeId(sede);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'No se pudo obtener la información del perfil.',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchSedeId();
  }, []);

  // Handle file selection event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileSelected(file);
  };

  // Handle file upload process
  const handleUpload = async () => {
    if (!fileSelected || !sedeId) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Archivo o sede no seleccionada.',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'OK',
      });
      return;
    }

    setApiLoading(true);

    try {
      const response = await cargarCatedraticos({
        archivo: fileSelected,
        sede_id: sedeId,
      });

      Swal.fire({
        icon: 'success',
        title: 'Carga completada',
        text:
          response.message || 'Los catedráticos se han cargado exitosamente.',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'OK',
      });
      handleReset();
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: error.message,
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'OK',
        });
      }
    } finally {
      setApiLoading(false);
    }
  };

  // Reset file selection
  const handleReset = () => {
    setFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download the template file for uploading professors
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Plantilla.xlsx';
    link.download = 'Plantilla_Catedraticos.xlsx';
    link.click();
  };

  // Función para iniciar el recorrido
  const startTour = () => {
    const driverObj = driver({
      showProgress: true, // Muestra la barra de progreso
      animate: true, // Habilita animaciones
      prevBtnText: 'Anterior', // Texto del botón "Anterior"
      nextBtnText: 'Siguiente', // Texto del botón "Siguiente"
      doneBtnText: 'Finalizar', // Texto del botón "Finalizar"
      progressText: 'Paso {{current}} de {{total}}', // Texto de la barra de progreso
    });

    driverObj.setSteps([
      {
        element: '#file-input', // ID del input de archivo
        popover: {
          title: 'Seleccionar Archivo',
          description:
            'Haz clic aquí para seleccionar un archivo Excel (.xls, .xlsx).',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#confirm-button', // ID del botón "Confirmar Subida"
        popover: {
          title: 'Confirmar Subida',
          description: 'Haz clic aquí para subir el archivo seleccionado.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#download-template', // ID del botón "Descargar Plantilla"
        popover: {
          title: 'Descargar Plantilla',
          description: 'Haz clic aquí para descargar la plantilla de Excel.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb pageName="Subir Catedráticos" />
      <div className="flex justify-center mt-18">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
              {/* Botón para iniciar el recorrido */}
              <button
                style={{ width: '35px', height: '35px' }}
                onClick={startTour}
                className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 group"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <circle cx="12" cy="17" r="1" fill="#ffffff"></circle>
                  </g>
                </svg>
                <span className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Iniciar recorrido de ayuda
                </span>
              </button>

              <h3 className="font-medium text-black dark:text-white ml-22">Subir Catedráticos</h3>
            </div>
            <div className="p-6.5">
              <p className="text-center text-sm font-medium text-black dark:text-white mb-4">
                Favor de seleccionar un archivo Excel (.xls, .xlsx)
              </p>

              <input
                id="file-input"
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />

              <button
                id="confirm-button"
                className={`mt-4 w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity ${fileSelected
                    ? 'opacity-100 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                  }`}
                onClick={handleUpload}
                disabled={!fileSelected || !sedeId}
              >
                Confirmar Subida
              </button>

              <div className="mt-6 text-center">
                <p className="text-black dark:text-white">
                  ¿Necesitas una plantilla? Descarga la plantilla de Excel.
                </p>
                <button
                  id="download-template"
                  onClick={handleDownloadTemplate}
                  className="mt-2 rounded bg-primary p-2 font-medium text-white hover:bg-opacity-90 transition-opacity"
                >
                  Descargar Plantilla
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {apiLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">
            Espere un momento en lo que se suben los Catedraticos...
          </div>
        </div>
      )}
    </>
  );
};

export default SubirCatedraticos;
