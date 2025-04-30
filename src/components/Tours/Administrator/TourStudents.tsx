import React from "react";
import { driver } from "driver.js"; 
import "driver.js/dist/driver.css"; 

/**
 * TourStudents component provides a guided tour for the student list page.
 * It highlights key elements like search, filtering, and actions like printing reports.
 * 
 */
const TourStudents: React.FC = () => {
  /**
   * Starts the guided tour by initializing driver.js with the desired settings.
   * The tour will highlight various elements on the page and provide descriptions.
   */
  const startTour = () => {
    const driverObj = driver({
      showProgress: true, // Show progress bar
      animate: true, // Enable animations
      prevBtnText: "Anterior", // Previous button text
      nextBtnText: "Siguiente", // Next button text
      doneBtnText: "Finalizar", // Done button text
      progressText: "Paso {{current}} de {{total}}", // Progress bar text
    });

    driverObj.setSteps([
      {
        element: "#search-input", // ID of the search field by student ID
        popover: {
          title: "Buscar Estudiante", // Title of the popover
          description:
            "Escribe el carnet del estudiante (mínimo 12 caracteres) para buscarlo automáticamente.", // Description of the search input
          side: "bottom", // Position of the popover relative to the element
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#select-year", // ID of the year selection field
        popover: {
          title: "Seleccionar Año", // Title of the popover
          description: "Selecciona el año para filtrar la lista de estudiantes.", // Description of the year selector
          side: "bottom", // Position of the popover
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#select-course", // ID of the course selection field
        popover: {
          title: "Seleccionar Curso", // Title of the popover
          description: "Selecciona el curso para filtrar la lista de estudiantes.", // Description of the course selector
          side: "bottom", // Position of the popover
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#print-report", // ID of the print report button
        popover: {
          title: "Imprimir Reporte", // Title of the popover
          description:
            "Haz clic aquí para generar un reporte en PDF de los estudiantes filtrados.", // Description of the print report button
          side: "bottom", // Position of the popover
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#student-table", // ID of the student table
        popover: {
          title: "Lista de Estudiantes", // Title of the popover
          description:
            "Aquí se muestran los estudiantes filtrados. Haz clic en un estudiante para ver su línea de tiempo.", // Description of the student table
          side: "top", // Position of the popover
          align: "start", // Alignment of the popover
        },
      },
      {
        element: "#pagination", // ID of the pagination controls
        popover: {
          title: "Paginación", // Title of the popover
          description:
            "Usa estos controles para navegar entre las páginas de estudiantes.", // Description of the pagination controls
          side: "top", // Position of the popover
          align: "start", // Alignment of the popover
        },
      },
    ]);

    driverObj.drive(); // Start the guided tour
  };

  return (
    <div>
      {/* Button to start the tour */}
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

export default TourStudents;
