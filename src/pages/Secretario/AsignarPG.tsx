import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from "../../ts/Secretario/GetSedes";
import { crearAsignacionSedeCurso } from "../../ts/Secretario/CreatePG";
import { getCursos } from "../../ts/Generales/GetCursos";
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

// Define an interface for the Sede object
interface Sede {
  sede_id: number;
  nameSede: string;
}

const AsignarPG: React.FC = () => {
  // State hooks for managing data and form values
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [sede, setSede] = useState(""); // Store selected Sede
  const [pg1, setPg1] = useState(false); // State for checking PG1 checkbox
  const [pg2, setPg2] = useState(false); // State for checking PG2 checkbox
  const [pg1Disabled, setPg1Disabled] = useState(false); // Disable PG1 checkbox if necessary
  const [pg2Disabled, setPg2Disabled] = useState(false); // Disable PG2 checkbox if necessary
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Disable the submit button initially

  // Effect hook for fetching Sedes data when the component is mounted
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        // Get the list of sedes
        const data = await getSedes();
        const sortedSedes = data.sort((a, b) => a.sede_id - b.sede_id); // Sort sedes by their ID
        setSedes(sortedSedes); // Update the sedes state
      } catch (error: any) {
        // Show error message if fetching fails
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#DC3545",
          customClass: {
            confirmButton: "text-white",
          },
        });
      }
    };

    fetchSedes(); // Call the fetch function
  }, []); // Empty dependency array to run the effect only once

  // Effect hook to update the submit button's disabled state based on checkbox states
  useEffect(() => {
    // Enable or disable the submit button based on the PG1 and PG2 checkbox states
    if ((pg1 && !pg1Disabled) || (pg2 && !pg2Disabled)) {
      setIsButtonDisabled(false); // Enable button if any checkbox is checked
    } else {
      setIsButtonDisabled(true); // Disable button if neither checkbox is checked
    }
  }, [pg1, pg2, pg1Disabled, pg2Disabled]); // Trigger when checkbox states change

  // Handler for when a Sede is selected from the dropdown
  const handleSedeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSede(e.target.value); // Update the selected Sede value
    const sedeObj = sedes.find((s) => s.nameSede === e.target.value); // Find the selected Sede object

    if (sedeObj) {
      try {
        // Reset PG checkboxes and disable states
        setPg1(false);
        setPg2(false);
        setPg1Disabled(false);
        setPg2Disabled(false);

        const currentYear = new Date().getFullYear(); // Get the current year
        const cursos = await getCursos(sedeObj.sede_id, currentYear); // Fetch the courses for the selected Sede

        // Reset checkboxes and disable them initially
        setPg1(false);
        setPg2(false);
        setPg1Disabled(true);
        setPg2Disabled(true);

        // Check if PG1 and PG2 courses are available
        const pg1Available = cursos.some((curso) => curso.course_id === 1);
        const pg2Available = cursos.some((curso) => curso.course_id === 2);

        // Enable or disable the PG checkboxes based on availability
        if (pg1Available) {
          setPg1(true); // Enable PG1 if available
          setPg1Disabled(true); // Disable PG1 checkbox after it's checked
        } else {
          setPg1Disabled(false); // Enable PG1 checkbox if not available
        }

        if (pg2Available) {
          setPg2(true); // Enable PG2 if available
          setPg2Disabled(true); // Disable PG2 checkbox after it's checked
        } else {
          setPg2Disabled(false); // Enable PG2 checkbox if not available
        }

        // Disable the submit button if neither PG1 nor PG2 are available
        if (pg2Available && pg1Available) {
          setIsButtonDisabled(false); // Enable submit button if both are available
        } else {
          setIsButtonDisabled(true); // Disable button if one or both are unavailable
        }
      } catch (error: any) {
        // Show error message if fetching courses fails
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#DC3545",
          customClass: {
            confirmButton: "text-white",
          },
        });
      }
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const sedeObj = sedes.find((s) => s.nameSede === sede); // Find the selected Sede object
      if (!sedeObj) {
        throw new Error("Sede no encontrada. Por favor, selecciona una sede válida."); // Show error if Sede is not found
      }

      const currentYear = new Date().getFullYear(); // Get the current year

      const payloads = []; // Array to store course assignment data

      // Add PG1 assignment to payloads if it's selected and not disabled
      if (pg1 && !pg1Disabled) {
        payloads.push({
          course_id: 1,
          sede_id: sedeObj.sede_id,
          year_id: currentYear,
          courseActive: true,
        });
      }

      // Add PG2 assignment to payloads if it's selected and not disabled
      if (pg2 && !pg2Disabled) {
        payloads.push({
          course_id: 2,
          sede_id: sedeObj.sede_id,
          year_id: currentYear,
          courseActive: true,
        });
      }

      // If there are any assignments, proceed to create them
      if (payloads.length > 0) {
        await Promise.all(
          payloads.map(async (payload) => {
            try {
              // Create the course assignment using the payload
              await crearAsignacionSedeCurso(payload);
            } catch (error: any) {
              const errorMsg = error.message;
              // If an error occurs, reset the corresponding checkbox and show the error
              if (payload.course_id === 1) {
                setPg1(false);
                throw new Error(`PG I: ${errorMsg}`);
              } else if (payload.course_id === 2) {
                setPg2(false);
                throw new Error(`PG II: ${errorMsg}`);
              }
            }
          })
        );

        // Show success message after assignment is completed
        Swal.fire({
          icon: "success",
          title: "¡Asignación completada!",
          text: `Se asignaron correctamente los cursos seleccionados a la sede "${sede}" para el año ${currentYear}.`,
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
          customClass: {
            confirmButton: "text-white",
          },
        });

        // Reset the form state after successful submission
        setSede("");
        setPg1(false);
        setPg2(false);
        setPg1Disabled(false);
        setPg2Disabled(false);
      }
    } catch (error: any) {
      // Show error message if assignment fails
      Swal.fire({
        icon: "error",
        title: "Error en la asignación",
        text: error.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#DC3545",
        customClass: {
          confirmButton: "text-white",
        },
      });
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
        element: '#sede', // ID del campo "Seleccione la sede"
        popover: {
          title: 'Seleccionar Sede',
          description: 'Aquí debes seleccionar la sede a la que deseas asignar los proyectos de graduación (PG).',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#pg1', // ID del checkbox "PG1"
        popover: {
          title: 'Activar PG I',
          description: 'Marca esta casilla si deseas activar el Proyecto de Graduación I (PG I) para la sede seleccionada.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#pg2', // ID del checkbox "PG2"
        popover: {
          title: 'Activar PG II',
          description: 'Marca esta casilla si deseas activar el Proyecto de Graduación II (PG II) para la sede seleccionada.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: 'button[type="submit"]', // Selector del botón "Asignar"
        popover: {
          title: 'Asignar PG',
          description: 'Haz clic aquí para guardar la asignación de los proyectos de graduación seleccionados.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb pageName="Asignar PG" />
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-boxdark rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
          Asignar PG1 y PG2 a Sede
        </h2>
        {/* Botón para iniciar el recorrido */}
        <button
          style={{ width: '35px', height: '35px', position: 'relative' }}
          onClick={startTour}
          className="mb-4 flex items-center gap-2 px-1 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 group"
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
          
          {/* Tooltip */}
          <span
            className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: 'calc(50% + 50px)' }}
          >
            Iniciar recorrido de ayuda
          </span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="sede"
              className="block text-lg font-medium text-black dark:text-white"
            >
              Seleccione la sede
            </label>
            <select
              id="sede"
              value={sede}
              onChange={handleSedeChange}
              className="w-full appearance-none rounded-lg border bg-gray-100 dark:bg-gray-800 px-4 py-3 text-base text-black dark:text-white shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="" disabled>
                Seleccione una sede
              </option>
              {sedes.map(({ sede_id, nameSede }) => (
                <option key={sede_id} value={nameSede}>
                  {nameSede}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pg1"
                  checked={pg1}
                  onChange={(e) => setPg1(e.target.checked)}
                  disabled={pg1Disabled}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="pg1"
                  className="text-lg text-black dark:text-white"
                >
                  Activar Proyecto de Graduación I
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pg2"
                  checked={pg2}
                  onChange={(e) => setPg2(e.target.checked)}
                  disabled={pg2Disabled}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="pg2"
                  className="text-lg text-black dark:text-white"
                >
                  Activar Proyecto de Graduación II
                </label>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg font-medium text-white ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={isButtonDisabled}
          >
            Asignar
          </button>
        </form>
      </div>
    </>
  );
};

export default AsignarPG;