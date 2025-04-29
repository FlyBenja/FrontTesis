import { driver } from 'driver.js'; 
import 'driver.js/dist/driver.css'; 

/**
 * This component provides a guided tour for the "Proposals" page using driver.js.
 * It walks the user through the main elements like the "Back" button, proposal selection,
 * approval button, and PDF viewer.
 */
const AyudaPropuestas = () => {
  /**
   * Starts the guided tour by setting up the steps for the user.
   * Each step highlights a specific element and provides a description.
   */
  const startTour = () => {
    const driverObj = driver({
      showProgress: true, // Shows the progress bar
      animate: true, // Enables animations
      prevBtnText: 'Anterior', // Text for the "Previous" button
      nextBtnText: 'Siguiente', // Text for the "Next" button
      doneBtnText: 'Finalizar', // Text for the "Done" button
      progressText: 'Paso {{current}} de {{total}}', // Progress bar text
    });

    driverObj.setSteps([
      {
        element: '#back-button', // ID of the "Back" button
        popover: {
          title: 'Regresar', // Title of the tooltip
          description: 'Haz clic aquí para regresar a la lista de tareas.', // Tooltip description
          side: 'bottom', // Tooltip position
          align: 'start', // Tooltip alignment
        },
      },
      {
        element: '#select-proposal', // ID of the proposal selection section
        popover: {
          title: 'Seleccionar Propuesta', // Title of the tooltip
          description: 'Aquí puedes seleccionar una propuesta para aprobarla.', // Tooltip description
          side: 'top', // Tooltip position
          align: 'start', // Tooltip alignment
        },
      },
      {
        element: '#approve-button', // ID of the "Approve Proposal" button
        popover: {
          title: 'Aprobar Propuesta', // Title of the tooltip
          description: 'Haz clic aquí para aprobar la propuesta seleccionada.', // Tooltip description
          side: 'top', // Tooltip position
          align: 'start', // Tooltip alignment
        },
      },
      {
        element: '#pdf-viewer', // ID of the PDF viewer
        popover: {
          title: 'Visualización de PDF', // Title of the tooltip
          description:
            'Aquí puedes ver el documento PDF de la propuesta seleccionada.', // Tooltip description
          side: 'top', // Tooltip position
          align: 'start', // Tooltip alignment
        },
      },
    ]);

    driverObj.drive(); // Starts the tour
  };

  return (
    <div>
      {/* Button to start the guided tour */}
      <button
        onClick={startTour}
        className="relative w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg transition duration-300 group"
        aria-label="Iniciar recorrido guiado"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
        >
          <g>
            <path
              d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
          </g>
        </svg>
        {/* Tooltip */}
        <span className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          Iniciar recorrido de ayuda
        </span>
      </button>
    </div>
  );
};

export default AyudaPropuestas;
