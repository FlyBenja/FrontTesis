import React, { useState } from 'react';

const SubirCatedraticos = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const fileInputRef = React.createRef<HTMLInputElement>(); // Crear una referencia para el input de archivo

  // Función para manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileSelected(file);
  };

  // Función para confirmar la subida y limpiar el formulario
  const handleConfirm = () => {
    // Aquí podrías manejar la lógica de la subida del archivo...

    // Limpiar el input y el estado
    setFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Limpiar el campo de archivo
    }
  };

  return (
    <div className="flex justify-center mt-40">
      <div className="w-full max-w-md">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white text-center">
              Subir Catedráticos
            </h3>
          </div>
          <div className="p-6.5">
            <input
              ref={fileInputRef} // Añadir la referencia al input de archivo
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />

            {/* Botón de confirmar */}
            <button
              className={`mt-4 w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity ${
                fileSelected ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleConfirm}
              disabled={!fileSelected} // El botón está deshabilitado si no se selecciona un archivo
            >
              Confirmar Subida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubirCatedraticos;
