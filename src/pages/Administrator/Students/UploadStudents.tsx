import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getCursos } from '../../../ts/General/GetCourses';
import { getDatosPerfil } from '../../../ts/General/GetProfileData';
import { cargaMasiva } from '../../../ts/Administrator/MassiveLoadStudents';
import AyudaSubirEstudiantes from '../../../components/Tours/Administrator/TourUploadStudents';

// Main component for uploading students
const SubirEstudiantes = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null); // State for the selected file
  const [selectedCurso, setSelectedCurso] = useState<string>(''); // State for the selected course
  const [cursos, setCursos] = useState<any[]>([]); // State to hold the list of courses
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status for fetching courses
  const [apiLoading, setApiLoading] = useState<boolean>(false); // State to track API loading during the file upload process
  const fileInputRef = React.createRef<HTMLInputElement>(); // Ref for the file input element

  // Fetching the courses when the component mounts
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // Fetching user profile data to get the 'sede'
        const { sede } = await getDatosPerfil();
        const currentYear = new Date().getFullYear(); // Getting the current year
        // Fetching courses for the current year and the selected sede
        const cursosData = await getCursos(sede, currentYear);
        if (Array.isArray(cursosData) && cursosData.length > 0) {
          setCursos(cursosData); // Setting the fetched courses in state
        }
      } catch (error) {
        console.error('Error al obtener los cursos:', error); // Logging any errors
      } finally {
        setLoading(false); // Setting loading state to false after fetching is done
      }
    };

    fetchCursos(); // Calling the fetch function
  }, []); // Empty dependency array to run only once on mount

  // Helper function to show alerts
  const showAlert = (
    type: 'success' | 'error',
    title: string,
    text: string,
  ) => {
    const confirmButtonColor = type === 'success' ? '#28a745' : '#dc3545'; // Success is green, error is red
    Swal.fire({
      icon: type, // Setting the alert type (success or error)
      title, // Setting the title of the alert
      text, // Setting the text of the alert
      confirmButtonColor, // Setting the button color
      confirmButtonText: 'OK', // Setting the button text
    });
  };

  // Handling file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Getting the selected file
    if (
      file &&
      file.type !== 'application/vnd.ms-excel' &&
      file.type !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // If the file is not an Excel file
      showAlert(
        'error',
        '¡Error!',
        'Por favor, seleccione un archivo Excel válido (.xls, .xlsx).',
      ); // Show error alert
      setFileSelected(null); // Reset the selected file state
      return;
    }
    setFileSelected(file); // Set the selected file
  };

  // Handling the file upload process
  const handleUpload = async () => {
    if (!fileSelected || !selectedCurso) {
      showAlert('error', '¡Error!', 'Archivo o curso no seleccionado.'); // Show error if no file or course is selected
      return;
    }

    setApiLoading(true); // Start loading state

    try {
      // Fetching user profile data again to get the 'sede'
      const { sede } = await getDatosPerfil();
      // Finding the selected course in the list of courses
      const selectedCourse = cursos.find(
        (curso) => curso.courseName === selectedCurso,
      );
      if (!selectedCourse) {
        throw new Error('Curso seleccionado no encontrado'); // Throw an error if the course is not found
      }

      // Calling the bulk upload function
      await cargaMasiva({
        archivo: fileSelected,
        sede_id: sede,
        rol_id: 1, // Assuming role 1 is the student role
        course_id: selectedCourse.course_id, // Passing the selected course ID
      });

      showAlert(
        'success',
        'Carga masiva completada',
        'Los estudiantes se han cargado exitosamente.',
      ); // Show success alert
      handleReset(); // Reset the form after successful upload
    } catch (error) {
      if (error instanceof Error) {
        showAlert('error', '¡Error!', error.message); // Show error alert if an error occurs
      }
    } finally {
      setApiLoading(false); // Stop loading state
    }
  };

  // Resetting the form to its initial state
  const handleReset = () => {
    setFileSelected(null); // Reset file state
    setSelectedCurso(''); // Reset selected course
    fileInputRef.current && (fileInputRef.current.value = ''); // Clear the file input
  };

  // Handling the download of the Excel template
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Plantilla.xlsx'; // Path to the template file
    link.download = 'Plantilla_Estudiantes.xlsx'; // File name for the download
    link.click(); // Trigger the download
  };

  // Displaying a loading message while fetching courses
  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  // If no courses are available, show a message
  if (cursos.length === 0) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            No existen cursos asignados a esta sede. Por favor, comuníquese con
            central.
          </p>
        </div>
      </div>
    );
  }

  // Main JSX structure
  return (
    <>
      <Breadcrumb pageName="Subir Estudiantes" />{' '}
      {/* Breadcrumb component for navigation */}
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
              <AyudaSubirEstudiantes />
              <h3 className="font-medium text-black dark:text-white ml-21">Subir Estudiantes</h3>
            </div>
            <div className="p-6.5">
              <label
                htmlFor="curso"
                className="block text-sm font-medium text-black dark:text-white mb-2"
              >
                Seleccionar curso:
              </label>
              <select
                id="curso"
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)} // Update selected course
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
                onChange={handleFileChange} // Handle file change
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />

              <button
                className={`mt-4 w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition-opacity ${fileSelected && selectedCurso
                  ? 'opacity-100 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                  }`}
                onClick={handleUpload} // Upload the file when clicked
                disabled={!fileSelected || !selectedCurso} // Disable button if no file or course selected
                id="confirm-submit" // ID para el recorrido
              >
                Confirmar Subida
              </button>

              <div className="mt-6 text-center">
                <p className="text-black dark:text-white">
                  ¿Necesitas una plantilla? Descarga la plantilla de Excel.
                </p>
                <button
                  onClick={handleDownloadTemplate} // Trigger download when clicked
                  className="mt-2 rounded bg-primary p-2 font-medium text-white transition-opacity"
                  id="plantilla-excel"
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
          <div className="text-white text-xl">
            Espere un momento en lo que se suben los Estudiantes...
          </div>
        </div>
      )}
    </>
  );
};

export default SubirEstudiantes;
