import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const CrearSedes: React.FC = () => {
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedes, setSedes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sedeNombre) {
      setSedes((prev) => [...prev, sedeNombre]);
      setSedeNombre('');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSedes = sedes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sedes.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <>
      <Breadcrumb pageName="Crear Sedes" />

      <div className="mx-auto max-w-6xl px-6 py-3">
        {/* Formulario para crear sedes */}
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-boxdark rounded-lg shadow-md mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={sedeNombre}
              onChange={(e) => setSedeNombre(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
              placeholder="Nombre de la nueva sede"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Crear
            </button>
          </div>
        </form>

        {/* Tabla para mostrar sedes */}
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Sedes Registradas
          </h3>
          {sedes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      #
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Nombre de la Sede
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSedes.map((sede, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {sede}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No hay sedes registradas.</p>
          )}
        </div>

        {/* Paginación */}
        {sedes.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="mx-1 px-3 py-1 rounded-md border bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
              disabled={currentPage === 1}
            >
              &#8592;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`mx-1 px-3 py-1 rounded-md border ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              className="mx-1 px-3 py-1 rounded-md border bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
              disabled={currentPage === totalPages}
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CrearSedes;
