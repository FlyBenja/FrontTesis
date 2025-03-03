import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes';
import { createSede } from '../../ts/Secretario/createSede';
import Swal from 'sweetalert2';
import { updateSede } from '../../ts/Secretario/UpdateSede';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const CrearSedes: React.FC = () => {
  // State to manage the name of the new sede
  const [sedeNombre, setSedeNombre] = useState('');
  // State to store the list of sedes fetched from the API
  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string }[]>(
    [],
  );
  // State to manage pagination, current page
  const [currentPage, setCurrentPage] = useState(1);
  // State to store the ID of the sede being edited
  const [sedeIdEdit, setSedeIdEdit] = useState<number | null>(null); // Using sede_id instead of editingSedeId
  // State for the name of the sede being edited
  const [editingSedeNombre, setEditingSedeNombre] = useState('');
  // Define the number of items per page for pagination
  const itemsPerPage = 5;

  // Fetch sedes on component mount
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

  // Handle form submission for creating a new sede
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sedeNombre.trim()) {
      // Display a confirmation modal before proceeding
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
            // Create the new sede via API
            await createSede(sedeNombre);
            const maxId =
              sedes.length > 0
                ? Math.max(...sedes.map((sede) => sede.sede_id))
                : 0;
            const newSede = { sede_id: maxId + 1, nameSede: sedeNombre };
            // Add the new sede to the list and sort the list by sede_id
            const updatedSedes = [...sedes, newSede].sort(
              (a, b) => a.sede_id - b.sede_id,
            );
            setSedes(updatedSedes);
            setSedeNombre(''); // Clear the input field
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

  // Handle the click to edit a specific sede
  const handleEditClick = (sedeId: number, sedeNombre: string) => {
    setSedeIdEdit(sedeId); // Set the ID of the sede being edited
    setEditingSedeNombre(sedeNombre);
  };

  // Handle the cancel edit action
  const handleCancelEdit = () => {
    setSedeIdEdit(null); // Reset the ID of the sede being edited
    setEditingSedeNombre(''); // Clear the editing name
  };

  // Handle saving the edited sede
  const handleSaveEdit = async () => {
    if (editingSedeNombre.trim()) {
      try {
        // Update the sede via API
        await updateSede(sedeIdEdit!, editingSedeNombre);
        // Update the sedes list with the new name
        const updatedSedes = sedes.map((sede) =>
          sede.sede_id === sedeIdEdit
            ? { ...sede, nameSede: editingSedeNombre }
            : sede,
        );
        setSedes(updatedSedes);
        setSedeIdEdit(null); // Reset edit mode
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSedes = sedes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sedes.length / itemsPerPage);

  // Paginate to a specific page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
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

    // Define los pasos del recorrido
    driverObj.setSteps([
      {
        element: '#create-sede-tour', // ID del título "Sedes Registradas"
        popover: {
          title: 'Sedes Registradas',
          description:
            'Aquí se muestran todas las sedes registradas en el sistema.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#form-crear-sede', // ID del formulario de creación de sede
        popover: {
          title: 'Crear Nueva Sede',
          description:
            'Usa este formulario para agregar una nueva sede. Ingresa el nombre y haz clic en "Crear".',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tabla-sedes', // ID de la tabla de sedes
        popover: {
          title: 'Tabla de Sedes',
          description:
            'Aquí puedes ver todas las sedes registradas. Puedes editar el nombre sede existente.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#edit-sede', // ID del botón de editar
        popover: {
          title: 'Editar Sede',
          description:
            'Haz clic en "Editar" para modificar el nombre de la sede.',
          side: 'top',
          align: 'start',
        },
      },

    ]);

    driverObj.drive(); // Inicia el recorrido
  };

  return (
    <>
      <Breadcrumb pageName="Crear Sedes" />

      <div className="mx-auto max-w-6xl px-6 py-0">
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

        {/* Form for creating a new sede */}
        <form
          id="form-crear-sede"
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

        {/* Table displaying the list of sedes */}
        <div
          id="tabla-sedes" // Agrega este ID
          className="bg-white dark:bg-boxdark rounded-lg shadow-md p-4"
        >
          <h3
            id="create-sede-tour"
            className="text-lg font-semibold text-black dark:text-white mb-4"
          >
            Sedes Registradas
          </h3>
          {sedes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th
                      className="border border-gray-300 dark:border-strokedark px-1 py-2 text-center"
                      style={{ width: '10px' }}
                    >
                      No.
                    </th>
                    <th
                      className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center"
                      style={{ width: '400px' }}
                    >
                      Nombre de la Sede
                    </th>
                    <th
                      className="border border-gray-300 dark:border-strokedark px-1 py-2 text-center"
                      style={{ width: '10px' }}
                    >
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSedes.map((sede) => (
                    <tr
                      key={sede.sede_id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {sede.sede_id}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {sedeIdEdit === sede.sede_id ? (
                          <input
                            type="text"
                            value={editingSedeNombre}
                            onChange={(e) =>
                              setEditingSedeNombre(e.target.value)
                            }
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
                            onClick={() =>
                              handleEditClick(sede.sede_id, sede.nameSede)
                            }
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                            id='edit-sede'
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
            <p className="text-gray-600 dark:text-gray-400">
              No hay sedes registradas.
            </p>
          )}
        </div>

        {/* Pagination controls */}
        {sedes.length > itemsPerPage && (
          <div
            id="paginacion" // Agrega este ID
            className="flex justify-center mt-6"
          >
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
