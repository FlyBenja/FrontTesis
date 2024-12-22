import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from "../../ts/Secretario/GetSedes";
import { crearAsignacionSedeCurso } from "../../ts/Secretario/CreatePG";
import { getCursosPorSede } from "../../ts/Secretario/GetPgCurso";

interface Sede {
  sede_id: number;
  nameSede: string;
}

const AsignarPG: React.FC = () => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [sede, setSede] = useState("");
  const [pg1, setPg1] = useState(false);
  const [pg2, setPg2] = useState(false);
  const [pg1Disabled, setPg1Disabled] = useState(false);
  const [pg2Disabled, setPg2Disabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        const sortedSedes = data.sort((a, b) => a.sede_id - b.sede_id);
        setSedes(sortedSedes);
      } catch (error: any) {
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

    fetchSedes();
  }, []);

  useEffect(() => {
    if ((pg1 && !pg1Disabled) || (pg2 && !pg2Disabled)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [pg1, pg2, pg1Disabled, pg2Disabled]);

  const handleSedeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSede(e.target.value);
    const sedeObj = sedes.find((s) => s.nameSede === e.target.value);

    if (sedeObj) {
      try {
        setPg1(false);
        setPg2(false);
        setPg1Disabled(false);
        setPg2Disabled(false);
        const cursos = await getCursosPorSede(sedeObj.sede_id);

        setPg1(false);
        setPg2(false);
        setPg1Disabled(true);
        setPg2Disabled(true);

        const pg1Available = cursos.some((curso) => curso.course_id === 1);
        const pg2Available = cursos.some((curso) => curso.course_id === 2);

        if (pg1Available) {
          setPg1(true);
          setPg1Disabled(true);
        } else {
          setPg1Disabled(false);
        }

        if (pg2Available) {
          setPg2(true);
          setPg2Disabled(true);
        } else {
          setPg2Disabled(false);
        }

        if (pg2Available && pg1Available) {
          setIsButtonDisabled(false);
        } else {
          setIsButtonDisabled(true);
        }
      } catch (error: any) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const sedeObj = sedes.find((s) => s.nameSede === sede);
      if (!sedeObj) {
        throw new Error("Sede no encontrada. Por favor, selecciona una sede válida.");
      }

      const currentYear = new Date().getFullYear();

      const payloads = [];
      if (pg1 && !pg1Disabled) {
        payloads.push({
          course_id: 1,
          sede_id: sedeObj.sede_id,
          year_id: currentYear,
          courseActive: true,
        });
      }

      if (pg2 && !pg2Disabled) {
        payloads.push({
          course_id: 2,
          sede_id: sedeObj.sede_id,
          year_id: currentYear,
          courseActive: true,
        });
      }

      if (payloads.length > 0) {
        await Promise.all(
          payloads.map(async (payload) => {
            try {
              await crearAsignacionSedeCurso(payload);
            } catch (error: any) {
              const errorMsg = error.message;
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

        setSede("");
        setPg1(false);
        setPg2(false);
        setPg1Disabled(false);
        setPg2Disabled(false);
      }
    } catch (error: any) {
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

  return (
    <>
      <Breadcrumb pageName="Asignar PG" />
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-boxdark rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
          Asignar PG1 y PG2 a Sede
        </h2>
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
