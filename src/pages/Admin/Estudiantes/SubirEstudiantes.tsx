import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getCursos } from '../../../ts/Generales/GetCursos';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { cargaMasiva } from '../../../ts/Admin/CargaMasiva';

const SubirEstudiantes = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<string>('');
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const fileInputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const { sede } = await getDatosPerfil();
        const currentYear = new Date().getFullYear();
        const cursosData = await getCursos(sede, currentYear);
        if (Array.isArray(cursosData) && cursosData.length > 0) {
          setCursos(cursosData);
        }
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const showAlert = (type: 'success' | 'error', title: string, text: string) => {
    const confirmButtonColor = type === 'success' ? '#28a745' : '#dc3545';
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor,
      confirmButtonText: 'OK',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      showAlert('error', '¡Error!', 'Por favor, seleccione un archivo Excel válido (.xls, .xlsx).');
      setFileSelected(null);
      return;
    }
    setFileSelected(file);
  };

  const handleUpload = async () => {
    if (!fileSelected || !selectedCurso) {
      showAlert('error', '¡Error!', 'Archivo o curso no seleccionado.');
      return;
    }

    setApiLoading(true);

    try {
      const { sede } = await getDatosPerfil();
      const selectedCourse = cursos.find((curso) => curso.courseName === selectedCurso);
      if (!selectedCourse) {
        throw new Error('Curso seleccionado no encontrado');
      }

      await cargaMasiva({
        archivo: fileSelected,
        sede_id: sede,
        rol_id: 1,
        course_id: selectedCourse.course_id,
      });

      showAlert('success', 'Carga masiva completada', 'Los estudiantes se han cargado exitosamente.');
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
    setSelectedCurso('');
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Plantilla.xlsx';
    link.download = 'Plantilla_Estudiantes.xlsx';
    link.click();
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (cursos.length === 0) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            No existen cursos asignados a esta sede. Por favor, comuníquese con central.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Subir Estudiantes" />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white text-center">
                Subir Estudiantes
              </h3>
            </div>
            <div className="p-6.5">
              <label htmlFor="curso" className="block text-sm font-medium text-black dark:text-white mb-2">
                Seleccionar curso:
              </label>
              <select
                id="curso"
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
              >
                <option value="">Seleccionar curso</option>
                {cursos.map(({ course_id, courseName }) => (
                  <option key={course_id} value={courseName}>
                    {courseName}
                  </option>
                ))}
              </select>

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
                className={`mt-4 w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity ${fileSelected && selectedCurso ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleUpload}
                disabled={!fileSelected || !selectedCurso}
              >
                Confirmar Subida
              </button>

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

      {apiLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Espere un momento en lo que se suben los Estudiantes...</div>
        </div>
      )}
    </>
  );
};

export default SubirEstudiantes;
