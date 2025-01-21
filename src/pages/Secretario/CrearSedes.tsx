import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes';
import { createSede } from '../../ts/Secretario/createSede'; // Importar la función para actualizar sede
import Swal from 'sweetalert2';
import { updateSede } from '../../ts/Secretario/UpdateSede'; // Importar la función para actualizar sede

const CrearSedes: React.FC = () => {
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sedeIdEdit, setSedeIdEdit] = useState<number | null>(null); // Usamos sede_id en lugar de editingSedeId
  const [editingSedeNombre, setEditingSedeNombre] = useState(''); // Estado para el nuevo nombre de la sede
  const itemsPerPage = 5;

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
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Verifica que el nombre ingresado sea correcto antes de continuar.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await createSede(sedeNombre);
            const maxId = sedes.length > 0 ? Math.max(...sedes.map((sede) => sede.sede_id)) : 0;
            const newSede = { sede_id: maxId + 1, nameSede: sedeNombre };
            const updatedSedes = [...sedes, newSede].sort((a, b) => a.sede_id - b.sede_id);
            setSedes(updatedSedes);
            setSedeNombre('');
            Swal.fire({
              icon: 'success',
              title: 'Sede creada',
              text: `La sede "${sedeNombre}" se ha creado exitosamente.`,
              confirmButtonColor: '#28a745',
            });
          } catch (error: any) {
            console.error('Error al crear la sede:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.message || 'Ocurrió un error al crear la sede.',
              confirmButtonColor: '#dc3545',
            });
          }
        }
      });
    }
  };

  const handleEditClick = (sedeId: number, sedeNombre: string) => {
    setSedeIdEdit(sedeId); // Establecer el sede_id que estamos editando
    setEditingSedeNombre(sedeNombre);
  };

  const handleCancelEdit = () => {
    setSedeIdEdit(null);
    setEditingSedeNombre('');
  };

  const handleSaveEdit = async () => {
    if (editingSedeNombre.trim()) {
      try {
        await updateSede(sedeIdEdit!, editingSedeNombre); // Actualizar la sede
        const updatedSedes = sedes.map((sede) =>
          sede.sede_id === sedeIdEdit
            ? { ...sede, nameSede: editingSedeNombre }
            : sede
        );
        setSedes(updatedSedes);
        setSedeIdEdit(null);
        setEditingSedeNombre('');
        Swal.fire({
          icon: 'success',
          title: 'Sede actualizada',
          text: `La sede "${editingSedeNombre}" se ha actualizado exitosamente.`,
          confirmButtonColor: '#28a745',
        });
      } catch (error: any) {
        console.error('Error al actualizar la sede:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al actualizar la sede.',
          confirmButtonColor: '#dc3545',
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
        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={sedeNombre}
              onChange={(e) => setSedeNombre(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
              placeholder="Nombre de la nueva sede"
              required
            />
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Crear
            </button>
          </div>
        </form>

        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Sedes Registradas</h3>
          {sedes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-strokedark px-1 py-2 text-center" style={{ width: '10px' }}>No.</th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center" style={{ width: '400px' }}>Nombre de la Sede</th>
                    <th className="border border-gray-300 dark:border-strokedark px-1 py-2 text-center" style={{ width: '10px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSedes.map((sede) => (
                    <tr key={sede.sede_id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">{sede.sede_id}</td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {sedeIdEdit === sede.sede_id ? (
                          <input
                            type="text"
                            value={editingSedeNombre}
                            onChange={(e) => setEditingSedeNombre(e.target.value)}
                            className="px-6 py-2 w-full border rounded-md dark:bg-boxdark dark:text-white"
                            placeholder="Nombre de la sede"
                          />
                        ) : (
                          sede.nameSede
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {sedeIdEdit === sede.sede_id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="ml-2 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditClick(sede.sede_id, sede.nameSede)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                          >
                            Editar
                          </button>
                        )}
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
                className={`mx-1 px-3 py-1 rounded-md border ${currentPage === page
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
