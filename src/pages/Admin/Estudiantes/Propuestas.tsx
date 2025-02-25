import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { getPropuesta } from '../../../ts/Generales/GetPropuesta';
import { aprobarPropuesta } from '../../../ts/Admin/AprobarPropuesta';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

// Define TypeScript interfaces for the expected data structure
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
  const navigate = useNavigate(); // Hook to handle navigation
  const location = useLocation(); // Hook to get the current location (for accessing route state)
  const { estudiante } = location.state as LocationState; // Retrieve student data from location state
  const userId = estudiante ? estudiante.id : null; // Get the student's ID

  // State management using React's useState hook
  const [propuestas] = useState<Propuesta[]>([
    { id: 1, titulo: 'Propuesta 1' },
    { id: 2, titulo: 'Propuesta 2' },
    { id: 3, titulo: 'Propuesta 3' },
  ]);
  const [selectedPropuesta, setSelectedPropuesta] = useState<number | null>(
    null,
  ); // Selected proposal ID
  const [aprobadaPropuesta, setAprobadaPropuesta] = useState<number | null>(
    null,
  ); // Approved proposal ID
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // URL for the proposal PDF
  const [noPropuestas, setNoPropuestas] = useState<boolean>(false); // Flag for no proposals uploaded
  const [thesisSubmissionsId, setThesisSubmissionsId] = useState<number | null>(
    null,
  ); // Thesis submission ID

  // Function to fetch proposal data from the server
  const fetchPropuesta = async (user_id: number) => {
    try {
      // Call to get the proposal data based on the student ID
      const propuestaData = await getPropuesta(user_id);

      // If proposal data is returned, update the state
      if (propuestaData) {
        setPdfUrl(propuestaData.file_path); // Set PDF URL
        setThesisSubmissionsId(propuestaData.thesisSubmissions_id); // Set thesis submission ID

        // If proposal is not approved, reset the approval state
        if (propuestaData.approved_proposal === 0) {
          setAprobadaPropuesta(null);
        } else {
          // If proposal is approved, update the state with the proposal ID
          setAprobadaPropuesta(propuestaData.approved_proposal);
          setSelectedPropuesta(propuestaData.approved_proposal);
        }
      } else {
        // If no proposal is found, update state to indicate this
        setNoPropuestas(true);
      }
    } catch (error) {
      // Show error if proposal fetching fails
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

  // useEffect hook to fetch proposal data when the component mounts
  useEffect(() => {
    if (userId) {
      fetchPropuesta(userId); // Call fetchPropuesta function if student ID is available
    } else {
      // Show error if student ID is not available
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

  // Function to handle proposal selection
  const handleSelectPropuesta = (id: number) => {
    // Allow selection only if the proposal is not approved
    if (aprobadaPropuesta === null) {
      setSelectedPropuesta(id);
    }
  };

  // Function to handle approval of the selected proposal
  const handleAprobarPropuesta = async () => {
    // Ensure selected proposal and thesis submission ID are not null
    if (
      selectedPropuesta !== null &&
      thesisSubmissionsId !== null &&
      userId !== null
    ) {
      const approvedProposalValue = selectedPropuesta; // Store selected proposal ID for approval

      try {
        // Call API to approve the proposal
        await aprobarPropuesta(
          thesisSubmissionsId,
          userId,
          approvedProposalValue,
        );

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Propuesta Aprobada',
          text: `La propuesta ${selectedPropuesta} ha sido aprobada correctamente.`,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-green-600 text-white',
          },
        });

        // Update state after successful approval
        setAprobadaPropuesta(selectedPropuesta);
        setSelectedPropuesta(null); // Reset selected proposal after approval
      } catch (error: any) {
        // Show error message if approval fails
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar la propuesta',
          text:
            error?.response?.data?.message ||
            'No se pudo aprobar la propuesta.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-red-600 text-white',
          },
        });
      }
    }
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
        element: '#back-button', // ID del botón "Regresar"
        popover: {
          title: 'Regresar',
          description: 'Haz clic aquí para regresar a la lista de tareas.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#select-proposal', // ID de la sección de selección de propuestas
        popover: {
          title: 'Seleccionar Propuesta',
          description: 'Aquí puedes seleccionar una propuesta para aprobarla.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#approve-button', // ID del botón "Aprobar Propuesta"
        popover: {
          title: 'Aprobar Propuesta',
          description: 'Haz clic aquí para aprobar la propuesta seleccionada.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#pdf-viewer', // ID del visor de PDF
        popover: {
          title: 'Visualización de PDF',
          description:
            'Aquí puedes ver el documento PDF de la propuesta seleccionada.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      <Breadcrumb pageName="Propuestas del Estudiante" />{' '}
      {/* Breadcrumb component for navigation */}
      <div className="mb-4 flex items-center justify-between sm:justify-start gap-4">
        {/* Botón de regresar */}
        <button
          id="back-button"
          className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Regresar
        </button>

        {/* Botón para iniciar el recorrido (solo si hay una entrega de propuesta) */}
        {pdfUrl && (
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
        )}
      </div>
      <div className="mx-auto max-w-5xl px-4 py-4">
        {/* Display message if no proposals are found */}
        {noPropuestas ? (
          <div className="bg-gray-100 dark:bg-boxdark rounded-lg p-6 shadow-md mb-6 flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-white text-center">
              Estudiante No Ha Subido Sus Propuestas
            </p>
          </div>
        ) : (
          <>
            {/* Section to select a proposal */}
            <div id="select-proposal">
              {' '}
              {/* Agrega este ID */}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                Seleccione una Propuesta
              </h3>
              <div className="space-y-3">
                {/* Render each proposal */}
                {propuestas.map((propuesta) => (
                  <div
                    key={propuesta.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                      aprobadaPropuesta === propuesta.id
                        ? 'bg-green-500 text-white' // Highlight approved proposal
                        : selectedPropuesta === propuesta.id
                        ? 'bg-blue-500 text-white' // Highlight selected proposal
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleSelectPropuesta(propuesta.id)}
                  >
                    {/* Radio button to select proposal */}
                    <input
                      type="radio"
                      checked={selectedPropuesta === propuesta.id}
                      onChange={() => handleSelectPropuesta(propuesta.id)}
                      className="mr-2 cursor-pointer"
                      disabled={aprobadaPropuesta !== null} // Disable selection if proposal is already approved
                    />
                    <label className="cursor-pointer">{propuesta.titulo}</label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                {/* Button to approve proposal */}
                <button
                  id="approve-button" // Agrega este ID
                  className={`w-full px-4 py-3 rounded-md text-white transition ${
                    selectedPropuesta === null ||
                    [1, 2, 3].includes(aprobadaPropuesta ?? 0)
                      ? 'bg-gray-400 cursor-not-allowed' // Disable button when no proposal is selected or proposal is approved
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={handleAprobarPropuesta}
                  disabled={
                    selectedPropuesta === null ||
                    [1, 2, 3].includes(aprobadaPropuesta ?? 0)
                  }
                >
                  Aprobar Propuesta
                </button>
              </div>
            </div>

            {/* Section to display PDF if available */}
            {pdfUrl && (
              <div id="pdf-viewer">
                {' '}
                {/* Agrega este ID */}
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
