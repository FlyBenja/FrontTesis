import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes'; // Importar la función para obtener sedes
import { createSede } from '../../ts/Secretario/createSede'; // Importar la función para crear sede
import Swal from 'sweetalert2';

const CrearSedes: React.FC = () => {
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Llamar a la API al cargar el componente
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const fetchedSedes = await getSedes();
        const sortedSedes = fetchedSedes.sort((a, b) => a.sede_id - b.sede_id);
        setSedes(sortedSedes);
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };

    fetchSedes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sedeNombre.trim()) {
      try {
        await createSede(sedeNombre); // Crear la sede en el backend
        const maxId = sedes.length > 0 ? Math.max(...sedes.map((sede) => sede.sede_id)) : 0;
        const newSede = { sede_id: maxId + 1, nameSede: sedeNombre };

        const updatedSedes = [...sedes, newSede].sort((a, b) => a.sede_id - b.sede_id);
        setSedes(updatedSedes);
        setSedeNombre('');

        // Mostrar alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Sede creada',
          text: `La sede "${sedeNombre}" se ha creado exitosamente.`,
        });
      } catch (error: any) {
        console.error('Error al crear la sede:', error);

        // Mostrar alerta con el mensaje específico devuelto por el backend
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al crear la sede.',
        });
      }
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

      <div className="mx-auto max-w-6xl px-6 py-0">
        {/* Formulario para crear sedes */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md mb-8"
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
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-4">
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
                  {currentSedes.map((sede) => (
                    <tr
                      key={sede.sede_id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {sede.sede_id}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {sede.nameSede}
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
