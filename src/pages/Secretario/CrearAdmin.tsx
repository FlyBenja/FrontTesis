import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Admin {
  id: number;
  nombre: string;
  email: string;
  sede: string;
}

const CrearAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUserName, setAdminUserName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminSede, setAdminSede] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sedes = ['Sede Central', 'Sede Norte', 'Sede Sur', 'Sede Este', 'Sede Oeste'];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAdminUserName('');
    setAdminEmail('');
    setAdminSede('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUserName && adminEmail && adminSede) {
      setAdmins((prev) => [
        ...prev,
        { id: prev.length + 1, nombre: adminUserName, email: adminEmail, sede: adminSede },
      ]);
      handleCloseModal();
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
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Crear Nuevo Administrador
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  UserName
                </label>
                <input
                  type="text"
                  value={adminUserName}
                  onChange={(e) => setAdminUserName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
                  placeholder="Ingrese el nombre de usuario"
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
                  Sede
                </label>
                <select
                  value={adminSede}
                  onChange={(e) => setAdminSede(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-boxdark dark:text-white"
                  required
                >
                  <option value="">Seleccione una sede</option>
                  {sedes.map((sede, index) => (
                    <option key={index} value={sede}>
                      {sede}
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
    </>
  );
};

export default CrearAdmin;
