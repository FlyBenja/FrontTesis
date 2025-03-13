import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from "../../ts/Generales/GetDatsPerfil";
import { getCursos } from "../../ts/Generales/GetCursos";
import { crearAsignacionSedeCurso } from "../../ts/CoordinadorSede/CreatePG";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const AsignarPG: React.FC = () => {
  const [sedeId, setSedeId] = useState<number | null>(null);
  const [sedeNombre, setSedeNombre] = useState<string>("");
  const [pg1, setPg1] = useState(false);
  const [pg2, setPg2] = useState(false);
  const [pg1Disabled, setPg1Disabled] = useState(false);
  const [pg2Disabled, setPg2Disabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfil = await getDatosPerfil();
        setSedeId(perfil.sede);
        setSedeNombre(perfil.NombreSede);

        if (perfil.sede) {
          const currentYear = new Date().getFullYear();
          const cursos = await getCursos(perfil.sede, currentYear);

          const pg1Available = cursos.some((curso) => curso.course_id === 1);
          const pg2Available = cursos.some((curso) => curso.course_id === 2);

          setPg1(pg1Available);
          setPg2(pg2Available);
          setPg1Disabled(pg1Available);
          setPg2Disabled(pg2Available);

          setIsButtonDisabled(!(pg1Available || pg2Available));
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#DC3545",
          customClass: { confirmButton: "text-white" },
        });
      }
    };

    fetchPerfil();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sedeId) return;

    try {
      const currentYear = new Date().getFullYear();
      const payloads = [];

      if (pg1 && !pg1Disabled) {
        payloads.push({ course_id: 1, sede_id: sedeId, year_id: currentYear, courseActive: true });
      }
      if (pg2 && !pg2Disabled) {
        payloads.push({ course_id: 2, sede_id: sedeId, year_id: currentYear, courseActive: true });
      }

      if (payloads.length > 0) {
        await Promise.all(payloads.map(payload => crearAsignacionSedeCurso(payload)));
        Swal.fire({
          icon: "success",
          title: "¡Asignación completada!",
          text: `Se asignaron correctamente los cursos seleccionados a la sede "${sedeNombre}" para el año ${currentYear}.`,
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
          customClass: { confirmButton: "text-white" },
        });
      }
    } catch (error: any) {
      // Limpiar los checkboxes no bloqueados en caso de error
      if (!pg1Disabled) setPg1(false); // Desmarcar pg1 si no está bloqueado
      if (!pg2Disabled) setPg2(false); // Desmarcar pg2 si no está bloqueado

      Swal.fire({
        icon: "error",
        title: "Error en la asignación",
        text: error.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#DC3545",
        customClass: { confirmButton: "text-white" },
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
      <Breadcrumb pageName="Asignar PG" />
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-boxdark rounded-xl shadow-md mt-25">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
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

          <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white ml-9">Asignar PG1 y PG2 a {sedeNombre}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="pg1" className="text-lg text-black dark:text-white">
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
                <label htmlFor="pg2" className="text-lg text-black dark:text-white">
                  Activar Proyecto de Graduación II
                </label>
              </div>
            </div>
          </div>

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
