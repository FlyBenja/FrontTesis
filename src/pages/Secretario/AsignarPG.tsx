import React, { useState } from "react";

const AsignarPG: React.FC = () => {
  const [sede, setSede] = useState("");
  const [year, setYear] = useState("");
  const [pg1, setPg1] = useState(false);
  const [pg2, setPg2] = useState(false);

  const sedes = ["Sede Central", "Sede Norte", "Sede Sur", "Sede Este", "Sede Oeste"];
  const years = ["2023", "2024", "2025", "2026"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Asignación:", { sede, year, PG1: pg1, PG2: pg2 });
    setSede("");
    setYear("");
    setPg1(false);
    setPg2(false);
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
          <div className="relative">
            <select
              id="sede"
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="w-full appearance-none rounded-lg border bg-gray-100 dark:bg-gray-800 px-4 py-3 text-base text-black dark:text-white shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="" disabled>
                Seleccione una sede
              </option>
              {sedes.map((sedeOption, index) => (
                <option key={index} value={sedeOption}>
                  {sedeOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selector de año */}
        <div className="space-y-2">
          <label
            htmlFor="year"
            className="block text-lg font-medium text-black dark:text-white"
          >
            Seleccione el año
          </label>
          <div className="relative">
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full appearance-none rounded-lg border bg-gray-100 dark:bg-gray-800 px-4 py-3 text-base text-black dark:text-white shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
              disabled={!sede}
              required
            >
              <option value="" disabled>
                {sede ? "Seleccione un año" : "Primero seleccione una sede"}
              </option>
              {years.map((yearOption, index) => (
                <option key={index} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activar PG1 y PG2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pg1"
                checked={pg1}
                onChange={(e) => setPg1(e.target.checked)}
                disabled={!year}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="pg1"
                className={`text-lg ${year ? "text-black dark:text-white" : "text-gray-500"}`}
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
                disabled={!year}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="pg2"
                className={`text-lg ${year ? "text-black dark:text-white" : "text-gray-500"}`}
              >
                Activar PG2
              </label>
            </div>
          </div>

          {!year && (
            <p className="text-sm text-red-500">
              Debe seleccionar un año para activar PG1 o PG2.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AsignarPG;
