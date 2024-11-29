import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil'; // Llamada a la API para obtener el sede_id
import { cargarCatedraticos } from '../../../ts/Admin/CargaCatedraticos';


const SubirCatedraticos = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false); // Estado para controlar el indicador de carga
  const [sedeId, setSedeId] = useState<number | null>(null); // Almacenará el sede_id
  const fileInputRef = React.createRef<HTMLInputElement>();

  // Obtiene el sede_id desde la API
  useEffect(() => {
    const fetchSedeId = async () => {
      try {
        const { sede } = await getDatosPerfil();
        setSedeId(sede); // Almacena el sede_id
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        showAlert('error', '¡Error!', 'No se pudo obtener la información del perfil.');
      }
    };

    fetchSedeId();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileSelected(file);
  };

  const showAlert = (type: 'success' | 'error', title: string, text: string) => {
    const confirmButtonColor = type === 'success' ? '#28a745' : '#dc3545'; // Verde para éxito, Rojo para error
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor,
      confirmButtonText: 'OK',
    });
  };

  const handleUpload = async () => {
    if (!fileSelected || !sedeId) {
      showAlert('error', '¡Error!', 'Archivo o sede no seleccionada.');
      return;
    }
  
    setApiLoading(true);
  
    try {
      const response = await cargarCatedraticos({
        archivo: fileSelected,
        sede_id: sedeId, // Solo se envía el ID de la sede
      });
  
      showAlert('success', 'Carga completada', response.message || 'Los catedráticos se han cargado exitosamente.');
      handleReset();
    } catch (error) {
      if (error instanceof Error) {
        showAlert('error', '¡Error!', error.message);
      }
    } finally {
      setApiLoading(false);
    }
  };  

  const handleReset = () => {
    setFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Plantilla.xlsx';
    link.download = 'Plantilla_Catedraticos.xlsx';
    link.click();
  };

  return (
    <>
      <Breadcrumb pageName="Subir Catedráticos" />
      <div className="flex justify-center mt-18">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white text-center">
                Subir Catedráticos
              </h3>
            </div>
            <div className="p-6.5">
              {/* Mensaje de favor seleccionar archivo */}
              <p className="text-center text-sm font-medium text-black dark:text-white mb-4">
                Favor de seleccionar un archivo Excel (.xls, .xlsx)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />

              <button
                className={`mt-4 w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity ${fileSelected ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleUpload}
                disabled={!fileSelected || !sedeId} // Deshabilitar el botón si no hay archivo o sede
              >
                Confirmar Subida
              </button>

              {/* Apartado de Plantilla */}
              <div className="mt-6 text-center">
                <p className="text-black dark:text-white">
                  ¿Necesitas una plantilla? Descarga la plantilla de Excel.
                </p>
                <button
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

      {/* Indicador de carga */}
      {apiLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Espere un momento en lo que se suben los Catedraticos...</div>
        </div>
      )}
    </>
  );
};

export default SubirCatedraticos;
