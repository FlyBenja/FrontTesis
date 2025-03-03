import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes';
import { createSede } from '../../ts/Secretario/createSede';
import Swal from 'sweetalert2';
import { updateSede } from '../../ts/Secretario/UpdateSede';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const CrearSedes: React.FC = () => {
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string }[]>([]);
  const [sedeIdEdit, setSedeIdEdit] = useState<number | null>(null);
  const [editingSedeNombre, setEditingSedeNombre] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [sedesPerPage, setSedesPerPage] = useState(5);
  const [maxPageButtons, setMaxPageButtons] = useState(5);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const fetchedSedes = await getSedes();
        setSedes(fetchedSedes.sort((a, b) => a.sede_id - b.sede_id));
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };
    fetchSedes();

    // Agregar el listener para el cambio de tamaño de la ventana
    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar a handleResize al cargar para establecer los valores iniciales

    return () => {
      window.removeEventListener('resize', handleResize); // Limpiar el listener al desmontar el componente
    };
  }, []);

  // Función para manejar el cambio de tamaño de la ventana
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSedesPerPage(4);
      setMaxPageButtons(5);
    } else {
      setSedesPerPage(5);
      setMaxPageButtons(10);
    }
  };

  const handleCreateSede = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sedeNombre.trim()) return;

    try {
      await createSede(sedeNombre);
      const newSede = { sede_id: sedes.length + 1, nameSede: sedeNombre };
      setSedes([...sedes, newSede].sort((a, b) => a.sede_id - b.sede_id));
      setSedeNombre('');
      setIsCreateModalOpen(false);
      Swal.fire({
        title: 'Éxito',
        text: 'Sede creada correctamente',
        icon: 'success',
        customClass: { confirmButton: 'bg-green-500 text-white' },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'bg-red-600 text-white' },
      });
    }
  };

  const handleOpenEditModal = (sede: { sede_id: number; nameSede: string }) => {
    setSedeIdEdit(sede.sede_id);
    setEditingSedeNombre(sede.nameSede);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSedeNombre.trim() || sedeIdEdit === null) return;

    try {
      await updateSede(sedeIdEdit, editingSedeNombre);
      setSedes(sedes.map(sede => sede.sede_id === sedeIdEdit ? { ...sede, nameSede: editingSedeNombre } : sede));
      setIsEditModalOpen(false);
      Swal.fire({
        title: 'Éxito',
        text: 'Sede actualizada correctamente',
        icon: 'success',
        customClass: { confirmButton: 'bg-green-500 text-white' },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'bg-red-600 text-white' },
      });
    }
  };

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: 'Paso {{current}} de {{total}}',
    });

    driverObj.setSteps([
      {
        element: '#create-sede-tour',
        popover: {
          title: 'Sedes Registradas',
          description: 'Aquí se muestran todas las sedes registradas en el sistema.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#form-crear-sede',
        popover: {
          title: 'Crear Nueva Sede',
          description: 'Usa este formulario para agregar una nueva sede. Ingresa el nombre y haz clic en "Crear".',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tabla-sedes',
        popover: {
          title: 'Tabla de Sedes',
          description: 'Aquí puedes ver todas las sedes registradas. Puedes editar el nombre sede existente.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#edit-sede',
        popover: {
          title: 'Editar Sede',
          description: 'Haz clic en "Editar" para modificar el nombre de la sede.',
          side: 'top',
          align: 'start',
        },
      },
    ]);

    driverObj.drive();
  };

  const indexOfLastSede = currentPage * sedesPerPage;
  const indexOfFirstSede = indexOfLastSede - sedesPerPage;
  const currentSedes = sedes.slice(indexOfFirstSede, indexOfLastSede);
  const totalPages = Math.ceil(sedes.length / sedesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      <Breadcrumb pageName="Crear Sedes" />
      <div className="mx-auto max-w-6xl px-6 py-0">
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Crear Nueva Sede</h2>
              <form onSubmit={handleCreateSede} className="flex flex-col gap-4">
                <input type="text" value={sedeNombre} onChange={(e) => setSedeNombre(e.target.value)} className="px-4 py-2 border rounded-md" required />
                <div className="flex justify-end gap-2">
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">Crear</button>
                  <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Editar Sede</h2>
              <input type="text" value={editingSedeNombre} onChange={(e) => setEditingSedeNombre(e.target.value)} className="px-4 py-2 border rounded-md w-full" required />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-500 text-white rounded-md">Guardar</button>
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <div id="tabla-sedes" className="bg-white dark:bg-boxdark rounded-lg shadow-md p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h3 id="create-sede-tour" className="text-lg font-semibold text-black dark:text-white">
              Sedes Registradas
            </h3>
            <div className="flex items-center ml-auto space-x-2">
              <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Crear Nueva Sede
              </button>

              <button
                style={{ width: '35px', height: '35px' }}
                onClick={startTour}
                className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 group"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    ></path>
                    <circle cx="12" cy="17" r="1" fill="#ffffff"></circle>
                  </g>
                </svg>
                <span className="absolute bottom-full z-50 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Iniciar recorrido de ayuda
                </span>
              </button>
            </div>
          </div>

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
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">{sede.nameSede}</td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        <button onClick={() => handleOpenEditModal(sede)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="mt-4 flex justify-center">
                {/* Previous page button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
                >
                  &#8592;
                </button>

                {/* Page number buttons */}
                {getPageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`mx-1 px-3 py-1 rounded-md border ${currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next page button */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
                >
                  &#8594;
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No hay sedes registradas.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CrearSedes;
