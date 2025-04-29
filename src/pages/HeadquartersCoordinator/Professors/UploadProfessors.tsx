import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/General/GetProfileData';
import { cargarCatedraticos } from '../../../ts/HeadquartersCoordinator/LoadProfessors';
import AyudaSubirCatedratico from '../../../components/Tours/HeadquartersCoordinator/TourUploadProffesor';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

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

  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb pageName="Subir Catedráticos" />
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
              {/* Botón para iniciar el recorrido */}
              <AyudaSubirCatedratico />
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
