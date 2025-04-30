import { driver } from 'driver.js'; 
import 'driver.js/dist/driver.css'; 

/**
 * TourTimeLine Component
 * 
 * This component provides a guided tour feature to help users navigate through the timeline page. It uses 
 * the 'driver.js' library to create an interactive tour of the page elements. The tour highlights the 
 * key elements such as the back button, print report button, view tasks button, and timeline events.
 * 
 */
const TourTimeLine = () => {
  /**
   * Start Tour Function
   * 
   * This function initializes and starts the guided tour of the timeline page using the 'driver.js' library.
   * The steps of the tour highlight various elements such as buttons and the timeline.
   */
  const startTour = () => {
    // Initialize driver.js with options
    const driverObj = driver({
      showProgress: true, // Show progress bar
      animate: true, // Enable animations
      prevBtnText: "Anterior", // Previous button text
      nextBtnText: "Siguiente", // Next button text
      doneBtnText: "Finalizar", // Done button text
      progressText: "Paso {{current}} de {{total}}", // Progress text format
    });

    // Define the steps of the tour
    driverObj.setSteps([
      {
        element: "#back-button", // ID of the "Back" button
        popover: {
          title: "Regresar", // Title of the popover
          description: "Haz clic aquí para regresar a la lista de estudiantes.", // Description of the "Back" button
          side: "bottom", // Position of the popover relative to the element
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#print-report", // ID of the "Print Report" button
        popover: {
          title: "Imprimir Reporte", // Title of the popover
          description: "Haz clic aquí para generar un reporte en PDF de la línea de tiempo del estudiante.", // Description of the "Print Report" button
          side: "bottom", // Position of the popover relative to the element
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#view-tasks", // ID of the "View Tasks" button
        popover: {
          title: "Ver Tareas", // Title of the popover
          description: "Haz clic aquí para ver las tareas asignadas a este estudiante.", // Description of the "View Tasks" button
          side: "bottom", // Position of the popover relative to the element
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#timeline", // ID of the timeline element
        popover: {
          title: "Línea de Tiempo", // Title of the popover
          description: "Aquí se muestran los eventos de la línea de tiempo del estudiante.", // Description of the timeline
          side: "top", // Position of the popover relative to the element
          align: "start", // Alignment of the popover
        },
      },
    ]);

    // Start the tour
    driverObj.drive(); 
  };

  return (
    <div>
      {/* Button to start the tour */}
      <button
        onClick={startTour}
        className="relative w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg transition duration-300 group"
        aria-label="Iniciar recorrido guiado" // Tooltip for accessibility
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

export default TourTimeLine;
