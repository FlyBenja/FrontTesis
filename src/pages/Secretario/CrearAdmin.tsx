import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getSedes } from '../../ts/Secretario/GetSedes';  // Importa la API para obtener las sedes
import { registerUser } from '../../ts/Secretario/CreateAdmin';  // Importa la API para registrar administradores
import Swal from 'sweetalert2';

interface Admin {
  id: number;
  nombre: string;
  email: string;
  sede: string;
  carnet: string;
}

const CrearAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);  // Lista de administradores
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
        setSedes(sortedSedes);  // Guardar las sedes ordenadas en el estado
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };

    fetchSedes();

    // Simular carga de administradores (puedes reemplazarlo con una llamada real a tu API)
    const fetchedAdmins = [
      { id: 3, nombre: 'Admin 3', email: 'admin3@example.com', sede: 'Sede 1', carnet: '123' },
      { id: 1, nombre: 'Admin 1', email: 'admin1@example.com', sede: 'Sede 2', carnet: '456' },
      { id: 2, nombre: 'Admin 2', email: 'admin2@example.com', sede: 'Sede 3', carnet: '789' },
    ];

    // Ordenar administradores por id ascendente
    const sortedAdmins = fetchedAdmins.sort((a, b) => a.id - b.id);
    setAdmins(sortedAdmins);

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
    
    // Validar que los campos necesarios están llenos
    if (!adminUserName || !adminEmail || !adminCarnet || !adminSede) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos.',
        confirmButtonColor: '#FF5A5F', // Rojo para error
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    
    // Obtener el año actual
    const currentYear = new Date().getFullYear();
    
    // Llamar a la API para registrar el usuario
    try {
      await registerUser(
        adminEmail,
        'contratempo', // Contraseña fija
        adminUserName,
        adminCarnet,
        parseInt(adminSede),
        3,  // rol_id fijo
        currentYear  // Año actual dinámico
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Administrador creado',
        text: `El administrador ${adminUserName} ha sido creado exitosamente.`,
        confirmButtonColor: '#28a745', // Verde para éxito
        confirmButtonText: 'Aceptar',
      });
      handleCloseModal(); // Cerrar el modal
      // Aquí puedes agregar el nuevo administrador a la lista si es necesario
    } catch (error) {
      console.error('Error al crear el administrador:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear administrador',
        text: 'Hubo un problema al crear el administrador. Intenta nuevamente.',
        confirmButtonColor: '#FF5A5F', // Rojo para error
        confirmButtonText: 'Aceptar',
      });
    }
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Crear Administrador</h2>
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Crear Admin
          </button>
        </div>

        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Administradores Registrados
          </h3>
          {admins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      #
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      UserName
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Correo
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Sede
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Carnet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {admin.id}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {admin.nombre}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {admin.email}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {admin.sede}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {admin.carnet}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Nuevo Administrador</h3>
              <form onSubmit={handleCreateAdmin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={adminUserName}
                    onChange={(e) => setAdminUserName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
                    placeholder="Ingrese el nombre del administrador"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Correo
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
                    placeholder="Ingrese el correo electrónico"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Carnet
                  </label>
                  <input
                    type="text"
                    value={adminCarnet}
                    onChange={(e) => setAdminCarnet(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
                    placeholder="Ingrese el número de carnet"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Sede
                  </label>
                  <select
                    value={adminSede}
                    onChange={(e) => setAdminSede(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
                    required
                  >
                    <option value="">Seleccione una sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.sede_id} value={sede.sede_id}>
                        {sede.nameSede}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CrearAdmin;
