import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes'; // Importa la API para obtener las sedes
import { createAdmin } from '../../ts/Secretario/CreateAdmin'; // Importa la API para crear administradores
import { getAdmins } from '../../ts/Secretario/GetAdmins'; // Importa la API para obtener los administradores
import { deleteAdmin } from '../../ts/Secretario/DeleteAdmin'; // Importa la API para eliminar administradores
import Swal from 'sweetalert2';

interface Admin {
  id: number;
  nombre: string;
  email: string;
  sede: string;
  carnet: string;
}

const CrearAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]); // Lista de administradores
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUserName, setAdminUserName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminSede, setAdminSede] = useState('');
  const [adminCarnet, setAdminCarnet] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string }[]>([]);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        // Ordenar las sedes por sede_id de forma ascendente
        const sortedSedes = data.sort((a, b) => a.sede_id - b.sede_id);
        setSedes(sortedSedes); // Guardar las sedes ordenadas en el estado
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };

    const fetchAdmins = async () => {
      try {
        const data = await getAdmins();
        // Transformar los datos para ajustarlos a la interfaz de Admin
        const transformedAdmins: Admin[] = data.map((admin) => ({
          id: admin.user_id,
          nombre: admin.name,
          email: admin.email,
          sede: admin.sede.nombre,
          carnet: admin.carnet,
        }));
        // Ordenar administradores por id ascendente
        const sortedAdmins = transformedAdmins.sort((a, b) => a.id - b.id);
        setAdmins(sortedAdmins);
      } catch (error) {
        console.error('Error al obtener los administradores:', error);
      }
    };

    fetchSedes();
    fetchAdmins();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAdminUserName('');
    setAdminEmail('');
    setAdminSede('');
    setAdminCarnet('');
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createAdmin({
        email: adminEmail,
        name: adminUserName,
        carnet: adminCarnet,
        sede_id: parseInt(adminSede),
      });

      Swal.fire({
        icon: 'success',
        title: 'Administrador creado',
        text: `El administrador ${adminUserName} ha sido creado exitosamente.`,
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Aceptar',
      });

      // Volver a cargar los administradores
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
      Swal.fire({
        icon: 'error',
        title: 'Error al crear administrador',
        text: error.message,
        confirmButtonColor: '#FF5A5F',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleDeleteClick = (adminId: number, sedeId: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Al eliminar el administrador se volvera un catedratico en la sede Asignada!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdmin(adminId, sedeId);
          Swal.fire({
            icon: 'success',
            title: 'Administrador eliminado',
            text: `El administrador ha sido eliminado exitosamente.`,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
          });

          // Volver a cargar los administradores después de eliminar
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = admins.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(admins.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <>
      <Breadcrumb pageName="Crear Admin a Sede" />

      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-5">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex justify-between items-center">
            Administradores Registrados
            <button
              onClick={handleOpenModal}
              className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-auto"
            >
              Crear Admin
            </button>
          </h3>
          {admins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      No.
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                      UserName
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
                    <tr key={admin.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
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
                          onClick={() => handleDeleteClick(admin.id, sedes.find(sede => sede.nameSede === admin.sede)?.sede_id || 0)}
                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
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
            <p className="text-gray-600 dark:text-gray-400">No hay administradores registrados.</p>
          )}
        </div>

        {admins.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Crear Administrador</h3>
            <form onSubmit={handleCreateAdmin}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-white" htmlFor="adminUserName">
                  Nombre
                </label>
                <input
                  type="text"
                  id="adminUserName"
                  className="w-full p-2 border rounded"
                  value={adminUserName}
                  onChange={(e) => setAdminUserName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-white" htmlFor="adminEmail">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  className="w-full p-2 border rounded"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-white" htmlFor="adminCarnet">
                  Carnet
                </label>
                <input
                  type="text"
                  id="adminCarnet"
                  className="w-full p-2 border rounded"
                  value={adminCarnet}
                  onChange={(e) => setAdminCarnet(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-white" htmlFor="adminSede">
                  Sede
                </label>
                <select
                  id="adminSede"
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
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
