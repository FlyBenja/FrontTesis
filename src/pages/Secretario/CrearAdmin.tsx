import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes';
import { createAdmin } from '../../ts/Secretario/CreateAdmin';
import { getAdmins } from '../../ts/Secretario/GetAdmins';
import { deleteAdmin } from '../../ts/Secretario/DeleteAdmin';
import Swal from 'sweetalert2';
import { driver } from 'driver.js'; // Importa driver.js
import 'driver.js/dist/driver.css'; // Importa los estilos de driver.js

// Interface defining the structure of an Admin object
interface Admin {
  id: number;
  nombre: string;
  email: string;
  sede: string;
  carnet: string;
}

const CrearAdmin: React.FC = () => {
  // State for storing list of admins
  const [admins, setAdmins] = useState<Admin[]>([]);
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // States for managing form inputs
  const [adminUserName, setAdminUserName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminSede, setAdminSede] = useState('');
  const [adminCarnet, setAdminCarnet] = useState('');
  // State for pagination control
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // State for storing the list of "sedes"
  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string }[]>(
    [],
  );

  // Effect hook to fetch "sedes" and admins when the component mounts
  useEffect(() => {
    // Function to fetch the list of sedes
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        // Sort the sedes by sede_id in ascending order
        const sortedSedes = data.sort((a, b) => a.sede_id - b.sede_id);
        setSedes(sortedSedes); // Save the sorted sedes in state
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };

    // Function to fetch the list of admins
    const fetchAdmins = async () => {
      try {
        const data = await getAdmins();
        // Transform the data to match the Admin interface
        const transformedAdmins: Admin[] = data.map((admin) => ({
          id: admin.user_id,
          nombre: admin.name,
          email: admin.email,
          sede: admin.sede.nombre,
          carnet: admin.carnet,
        }));
        // Sort admins by id in ascending order
        const sortedAdmins = transformedAdmins.sort((a, b) => a.id - b.id);
        setAdmins(sortedAdmins);
      } catch (error) {
        console.error('Error al obtener los administradores:', error);
      }
    };

    // Fetch the data for sedes and admins
    fetchSedes();
    fetchAdmins();
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Function to open the modal
  const handleOpenModal = () => setIsModalOpen(true);
  // Function to close the modal and reset the form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAdminUserName('');
    setAdminEmail('');
    setAdminSede('');
    setAdminCarnet('');
  };

  // Function to handle admin creation form submission
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the createAdmin API
      await createAdmin({
        email: adminEmail,
        name: adminUserName,
        carnet: adminCarnet,
        sede_id: parseInt(adminSede),
      });

      // Display success alert
      Swal.fire({
        icon: 'success',
        title: 'Administrador creado',
        text: `El administrador ${adminUserName} ha sido creado exitosamente.`,
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Aceptar',
      });

      // Reload the list of admins
      const updatedAdmins = await getAdmins();
      const transformedAdmins: Admin[] = updatedAdmins.map((admin) => ({
        id: admin.user_id,
        nombre: admin.name,
        email: admin.email,
        sede: admin.sede.nombre,
        carnet: admin.carnet,
      }));
      const sortedAdmins = transformedAdmins.sort((a, b) => a.id - b.id);
      setAdmins(sortedAdmins);

      handleCloseModal();
    } catch (error: any) {
      // Display error alert if the admin creation fails
      Swal.fire({
        icon: 'error',
        title: 'Error al crear administrador',
        text: error.message,
        confirmButtonColor: '#FF5A5F',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  // Function to handle admin deletion
  const handleDeleteClick = (adminId: number, sedeId: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Al eliminar el administrador se volverá un catedrático en la sede asignada!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call the deleteAdmin API to delete the admin
          await deleteAdmin(adminId, sedeId);
          // Display success alert after deletion
          Swal.fire({
            icon: 'success',
            title: 'Administrador eliminado',
            text: `El administrador ha sido eliminado exitosamente.`,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
          });

          // Reload the list of admins after deletion
          const updatedAdmins = await getAdmins();
          const transformedAdmins: Admin[] = updatedAdmins.map((admin) => ({
            id: admin.user_id,
            nombre: admin.name,
            email: admin.email,
            sede: admin.sede.nombre,
            carnet: admin.carnet,
          }));
          const sortedAdmins = transformedAdmins.sort((a, b) => a.id - b.id);
          setAdmins(sortedAdmins);
        } catch (error: any) {
          // Display error alert if deletion fails
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar administrador',
            text: error.message,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = admins.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(admins.length / itemsPerPage);

  // Function to handle page navigation
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // Recorrido del componente principal
  const startComponentTour = () => {
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
        element: '#tabla-admins', // ID de la tabla de administradores
        popover: {
          title: 'Tabla de Administradores',
          description:
            'Aquí se muestran todos los administradores registrados en el sistema.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#boton-crear-admin', // ID del botón "Crear Admin"
        popover: {
          title: 'Crear Administrador',
          description:
            'Haz clic aquí para abrir el formulario de creación de un nuevo administrador.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#delete-admin', // Clase de los botones "Eliminar"
        popover: {
          title: 'Eliminar Administrador',
          description:
            'Puedes eliminar un administrador haciendo clic en el botón "Eliminar" de la fila correspondiente.',
          side: 'bottom',
          align: 'start',
        },
      },
    ]);

    driverObj.drive();
  };

  return (
    <>
      <Breadcrumb pageName="Crear Admin a Sede" />

      <div className="mx-auto max-w-6xl px-6 py-3">
        {/* Botones para iniciar los recorridos */}
        <button
          style={{ width: '35px', height: '35px', position: 'relative' }}
          onClick={startComponentTour}
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

        {/* Sección para mostrar la lista de administradores */}
        <div
          id="tabla-admins"
          className="bg-white dark:bg-boxdark rounded-lg shadow-md p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4 sm:mb-0">
              Administradores Registrados
            </h3>
            <button
              id="boton-crear-admin"
              onClick={handleOpenModal}
              className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2 sm:mt-0 sm:ml-auto text-md"
            >
              Crear Admin
            </button>
          </div>

          {admins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      No.
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      Nombre
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      Correo
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      Sede
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      Código
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {admin.id}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {admin.nombre}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {admin.email}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {admin.sede}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        {admin.carnet}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                        <button
                          onClick={() =>
                            handleDeleteClick(
                              admin.id,
                              sedes.find((sede) => sede.nameSede === admin.sede)
                                ?.sede_id || 0,
                            )
                          }
                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          id="delete-admin"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No hay administradores registrados.
            </p>
          )}
        </div>

        {/* Controles de paginación */}
        {admins.length > itemsPerPage && (
          <div id="paginacion" className="flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-black rounded-l-md hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-black">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-black rounded-r-md hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear un nuevo administrador */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Crear Administrador</h3>
            <form onSubmit={handleCreateAdmin}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-white"
                  htmlFor="adminUserName"
                >
                  Nombre
                </label>
                <input
                  id="input-nombre"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={adminUserName}
                  onChange={(e) => setAdminUserName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-white"
                  htmlFor="adminEmail"
                >
                  Correo Electrónico
                </label>
                <input
                  id="input-email"
                  type="email"
                  className="w-full p-2 border rounded"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-white"
                  htmlFor="adminSede"
                >
                  Sede
                </label>
                <select
                  id="select-sede"
                  className="w-full p-2 border rounded"
                  value={adminSede}
                  onChange={(e) => setAdminSede(e.target.value)}
                  required
                >
                  <option value="">Selecciona una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.sede_id} value={sede.sede_id}>
                      {sede.nameSede}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-white"
                  htmlFor="adminCarnet"
                >
                  Código
                </label>
                <input
                  id="input-carnet"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={adminCarnet}
                  onChange={(e) => setAdminCarnet(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  id="boton-crear"
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Crear Admin
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ml-3 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CrearAdmin;
