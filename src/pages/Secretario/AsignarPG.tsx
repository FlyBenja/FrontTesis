import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getSedes } from "../../ts/Secretario/GetSedes"; // Ajusta la ruta según la ubicación de tu archivo
import { crearAsignacionSedeCurso } from "../../ts/Secretario/CreatePG"; // Ajusta la ruta según la ubicación de tu archivo
import { getCursosPorSede } from "../../ts/Secretario/GetPgCurso"; // La nueva API para obtener cursos por sede

interface Sede {
  sede_id: number;
  nameSede: string;
}

const AsignarPG: React.FC = () => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [sede, setSede] = useState("");
  const [pg1, setPg1] = useState(false);
  const [pg2, setPg2] = useState(false);
  const [pg1Disabled, setPg1Disabled] = useState(false);  // Estado para deshabilitar PG1
  const [pg2Disabled, setPg2Disabled] = useState(false);  // Estado para deshabilitar PG2

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        const sortedSedes = data.sort((a, b) => a.sede_id - b.sede_id);
        setSedes(sortedSedes);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la lista de sedes.",
        });
      }
    };

    fetchSedes();
  }, []);

  const handleSedeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSede(e.target.value);
    const sedeObj = sedes.find((s) => s.nameSede === e.target.value);
  
    if (sedeObj) {
      try {
        // Obtener los cursos de la sede seleccionada
        const cursos = await getCursosPorSede(sedeObj.sede_id);
  
        // Mostrar la información en la consola
        console.log("Cursos recuperados:", cursos);
  
        // Reiniciar los checkboxes y deshabilitar
        setPg1(false);
        setPg2(false);
        setPg1Disabled(true); // Deshabilitar PG1 inicialmente
        setPg2Disabled(true); // Deshabilitar PG2 inicialmente
  
        // Verificar disponibilidad de PG1 y PG2
        const pg1Available = cursos.some((curso) => curso.course_id === 1);
        const pg2Available = cursos.some((curso) => curso.course_id === 2);
  
        // Lógica para habilitar o deshabilitar PG1 y PG2
        if (pg1Available) {
          setPg1(true); // Activar PG1 si está presente
          setPg1Disabled(true); // Bloquear PG1
        } else {
          setPg1Disabled(false); // Habilitar PG1 si no está en la API
        }
  
        if (pg2Available) {
          setPg2(true); // Activar PG2 si está presente
          setPg2Disabled(true); // Bloquear PG2
        } else {
          setPg2Disabled(false); // Habilitar PG2 si no está en la API
        }
  
        // Si PG2 está bloqueado, también bloquear PG1
        if (pg2Available) {
          setPg1Disabled(true); // Bloquear PG1 si PG2 está bloqueado
        }
  
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo recuperar la información de los cursos para esta sede.",
        });
      }
    }
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar la sede seleccionada
      const sedeObj = sedes.find((s) => s.nameSede === sede);
      if (!sedeObj) {
        throw new Error("Sede no encontrada. Por favor, selecciona una sede válida.");
      }

      // Obtener el año actual
      const currentYear = new Date().getFullYear();

      // Crear payloads basados en los checkboxes seleccionados
      const payloads = [];
      if (pg1 && !pg1Disabled) {  // Verificar que PG1 esté habilitado
        payloads.push({
          course_id: 1, // PG1
          sede_id: sedeObj.sede_id,
          year_id: currentYear, // Año actual
          courseActive: true,
        });
      }

      if (pg2 && !pg2Disabled) {  // Verificar que PG2 esté habilitado
        payloads.push({
          course_id: 2, // PG2
          sede_id: sedeObj.sede_id,
          year_id: currentYear, // Año actual
          courseActive: true,
        });
      }

      // Verificar si hay payloads y enviarlos
      if (payloads.length > 0) {
        await Promise.all(
          payloads.map(async (payload) => {
            try {
              await crearAsignacionSedeCurso(payload);
            } catch (error) {
              // Aquí manejamos el error específico según el curso que falló
              if (payload.course_id === 1) {
                // Si el error ocurrió para PG1
                setPg1(false); // Desmarcar PG1
                throw new Error("El curso Proyecto De Graduación I fuera del periodo de asignación.");
              } else if (payload.course_id === 2) {
                // Si el error ocurrió para PG2
                setPg2(false); // Desmarcar PG2
                throw new Error("El curso Proyecto De Graduación II fuera del periodo de asignación.");
              }
            }
          })
        );

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "Asignación Completada",
          text: `La asignación se completó con éxito para la sede "${sede}" en el año ${currentYear}.`,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#28a745",
          customClass: {
            confirmButton: "text-white",
          },
        });

        // Resetear el formulario
        setSede("");
        setPg1(false);
        setPg2(false);
        setPg1Disabled(false);
        setPg2Disabled(false);
      } else {
        // Mostrar un mensaje si no se enviaron payloads
        Swal.fire({
          icon: "info",
          title: "Sin Asignaciones",
          text: "No se enviaron asignaciones, ya que todos los cursos seleccionados están bloqueados.",
        });
      }
    } catch (error: any) {
      // Mostrar el mensaje de error específico en el SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error desconocido",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#dc3545",
        customClass: {
          confirmButton: "text-white",
        },
      });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-boxdark rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
        Asignar PG1 y PG2 a Sede
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de sede */}
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

        {/* Activar PG1 y PG2 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pg1"
                checked={pg1}
                onChange={(e) => setPg1(e.target.checked)}
                disabled={pg1Disabled}  // Bloquear si está presente en la API
                className={`h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 ${pg1 ? "bg-green-500 cursor-not-allowed" : ""}`}
              />
              <label
                htmlFor="pg1"
                className={`text-lg ${sede ? "text-black dark:text-white" : "text-gray-500"}`}
              >
                Activar PG1
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pg2"
                checked={pg2}
                onChange={(e) => setPg2(e.target.checked)}
                disabled={pg2Disabled}  // Bloquear si está presente en la API
                className={`h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 ${pg2 ? "bg-green-500 cursor-not-allowed" : ""}`}
              />
              <label
                htmlFor="pg2"
                className={`text-lg ${sede ? "text-black dark:text-white" : "text-gray-500"}`}
              >
                Activar PG2
              </label>
            </div>
          </div>
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-lg font-medium text-white ${pg1 || pg2 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          disabled={pg1 || pg2 ? false : true}
        >
          Asignar
        </button>
      </form>
    </div>
  );
};

export default AsignarPG;
