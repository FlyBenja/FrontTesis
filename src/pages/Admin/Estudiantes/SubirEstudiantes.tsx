import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import React, { useState } from 'react';

const SubirEstudiantes = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<string>(''); // Estado para el curso seleccionado
  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileSelected(file);
  };

  const handleConfirm = () => {
    setFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedCurso(''); // Reiniciar seleccionador de curso después de la subida
  };

  const handleDownloadTemplate = () => {
    // Simula la descarga de un archivo
    const link = document.createElement('a');
    link.href = '/path/to/template_estudiantes.xlsx'; // Aquí pones el enlace correcto al archivo de la plantilla
    link.download = 'Plantilla_Estudiantes.xlsx';
    link.click();
  };

  const handleCursoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
  };

  return (
    <>
      <Breadcrumb pageName="Subir Estudiantes" /> {/* Añadido el Breadcrumb */}
      <div className="flex justify-center mt-8"> {/* Ajuste del margin-top */}
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white text-center">
                Subir Estudiantes
              </h3>
            </div>
            <div className="p-6.5">

              {/* Seleccionador de cursos */}
              <label htmlFor="curso" className="block text-sm font-medium text-black dark:text-white mb-2">
                Seleccionar curso:
              </label>
              <select
                id="curso"
                value={selectedCurso}
                onChange={handleCursoChange}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
              >
                <option value="">Seleccionar curso</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Historia">Historia</option>
                {/* Agrega más opciones según sea necesario */}
              </select>

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
                className={`mt-4 w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity ${
                  fileSelected && selectedCurso ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={handleConfirm}
                disabled={!fileSelected || !selectedCurso} // Deshabilitar si no se selecciona archivo o curso
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
                  className="mt-2 rounded bg-primary p-2 font-medium text-white transition-opacity"
                >
                  Descargar Plantilla
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubirEstudiantes;
