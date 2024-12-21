import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getComisionesIndiv } from '../../../ts/Admin/GetComisionesIndiv';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import { deleteUserComision } from '../../../ts/Admin/DeleteUserComision'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2'; // Importar SweetAlert2
import ListarCatedraticosModal from '../../../components/Modals/ListarCatedraticosModal'; // Asegúrate de que la ruta sea correcta

interface Usuario {
  userId: number;
  nombre: string;
  rol: string;
  carnet: string;
  groupId: number; // Nuevo campo para el groupId
}

const ROLES_CODIGOS: { [key: string]: number } = {
  Presidente: 1,
  Secretario: 2,
  'Vocal 1': 3,
  'Vocal 2': 4,
  'Vocal 3': 5,
};

const TOTAL_FILAS = 5;

const ListarComision: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false); // Estado para mostrar/ocultar el modal
  const [selectedRow, setSelectedRow] = useState<number | null>(null); // Estado para almacenar el número de fila seleccionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear();

        if (perfil.sede) {
          const grupos = await getComisionesIndiv(perfil.sede, year);
          const listaUsuarios = grupos.flatMap((grupo: any) =>
            grupo.users.map((user: any) => ({
              userId: user.userId,
              nombre: user.nombre,
              rol: user.rol,
              carnet: user.carnet,
              groupId: grupo.groupId, // Recuperamos el groupId de cada grupo
            }))
          );
          setUsuarios(listaUsuarios);
        }
      } catch (error) {
        console.error('Error al cargar las comisiones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const usuariosConEspacios = () => {
    const data: Usuario[] = Array(TOTAL_FILAS).fill({
      userId: 0,
      nombre: '',
      rol: '',
      carnet: '',
      groupId: 0, // Campo para el groupId
    });

    usuarios.forEach((usuario) => {
      const posicion = ROLES_CODIGOS[usuario.rol] - 1;
      if (posicion >= 0 && posicion < TOTAL_FILAS) {
        data[posicion] = usuario;
      }
    });

    return data;
  };

  const handleDelete = async (userId: number, groupId: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar a este usuario de la comisión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        console.log(userId, groupId);
        const response = await deleteUserComision(groupId, userId); // Usamos el groupId y el userId

        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado',
          text: response.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745',
          customClass: { confirmButton: 'text-white' },
        });

        // Actualizar la lista de usuarios
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear();
        if (perfil.sede) {
          const grupos = await getComisionesIndiv(perfil.sede, year);
          const listaUsuarios = grupos.flatMap((grupo: any) =>
            grupo.users.map((user: any) => ({
              userId: user.userId,
              nombre: user.nombre,
              rol: user.rol,
              carnet: user.carnet,
              groupId: grupo.groupId, // Recuperamos el groupId de cada grupo
            }))
          );
          setUsuarios(listaUsuarios);
        }
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: error?.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
          customClass: { confirmButton: 'text-white' },
        });
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const handleAssign = (rowIndex: number) => {
    console.log('Asignando a la fila con índice:', rowIndex); // Imprimir el índice de la fila en la consola
    setSelectedRow(rowIndex); // Guardar el índice de la fila seleccionada
    setShowModal(true); // Mostrar el modal
  };

  const closeModal = () => {
    setShowModal(false); // Ocultar el modal
    setSelectedRow(null); // Limpiar la fila seleccionada
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Comisiones" />
      <div className="mx-auto max-w-7xl px-2 py-4">
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 dark:bg-meta-4 dark:text-white">
                <th className="py-2 px-4 border-r text-center">No.</th>
                <th className="py-2 px-4 border-r text-center">Nombre</th>
                <th className="py-2 px-4 border-r text-center">Cargo</th>
                <th className="py-2 px-4 hidden sm:table-cell border-r text-center">Codigo</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosConEspacios().map((usuario, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-strokedark">
                  <td className="py-2 px-4 text-black dark:text-white border-r text-center">{index + 1}</td>
                  <td className="py-2 px-4 text-black dark:text-white border-r text-center">{usuario.nombre}</td>
                  <td className="py-2 px-4 text-black dark:text-white border-r text-center">{usuario.rol}</td>
                  <td className="py-2 px-4 text-black dark:text-white hidden sm:table-cell border-r text-center">{usuario.carnet}</td>
                  <td className="py-2 px-4 flex items-center justify-center space-x-3">
                    {usuario.nombre ? (
                      <button
                        className="text-red-500 hover:text-red-700 flex items-center"
                        aria-label="Eliminar usuario"
                        onClick={() => handleDelete(usuario.userId, usuario.groupId)} // Pasar tanto el userId como el groupId
                      >
                        <FaTrashAlt className="mr-1" />
                        Eliminar
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        aria-label="Asignar usuario"
                        onClick={() => handleAssign(index)} // Solo pasar el índice de la fila
                      >
                        <FaUserPlus className="mr-1" />
                        Asignar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <ListarCatedraticosModal onClose={closeModal} selectedRow={selectedRow} />}
    </>
  );
};

export default ListarComision;
