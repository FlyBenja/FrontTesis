import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getComisionesIndiv } from '../../../ts/Admin/GetComisionesIndiv';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import { deleteUserComision } from '../../../ts/Admin/DeleteUserComision';
import Swal from 'sweetalert2';
import ListarCatedraticosModal from '../../../components/Modals/AsignaCatedratico/ListarCatedraticosModal';

interface Usuario {
  userId: number;
  nombre: string;
  rol: string;
  carnet: string;
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear();

        if (perfil.sede) {
          const grupos = await getComisionesIndiv(perfil.sede, year);

          if (grupos.length > 0) {
            setGroupId(grupos[0].groupId);
          }

          const listaUsuarios = grupos.flatMap((grupo) =>
            grupo.groupData.users.map((user) => ({
              userId: user.userId,
              nombre: user.nombre,
              rol: user.rol,
              carnet: user.carnet,
            }))
          );
          setUsuarios(listaUsuarios);
        }
      } catch (error) {
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
    });

    usuarios.forEach((usuario) => {
      const posicion = ROLES_CODIGOS[usuario.rol] - 1;
      if (posicion >= 0 && posicion < TOTAL_FILAS) {
        data[posicion] = usuario;
      }
    });

    return data;
  };

  const handleDelete = async (userId: number) => {
    if (!groupId) return;

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
        const response = await deleteUserComision(groupId, userId);

        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado',
          text: response.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745',
          customClass: { confirmButton: 'text-white' },
        });

        const perfil = await getDatosPerfil();
        const year = new Date().getFullYear();
        if (perfil.sede) {
          const grupos = await getComisionesIndiv(perfil.sede, year);
          const listaUsuarios = grupos.flatMap((grupo) =>
            grupo.groupData.users.map((user) => ({
              userId: user.userId,
              nombre: user.nombre,
              rol: user.rol,
              carnet: user.carnet,
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
      }
    }
  };

  const handleAssign = (rowIndex: number) => {
    setSelectedRow(rowIndex + 1);
    setShowModal(true);
  };

  const closeModal = async () => {
    setShowModal(false);
    setSelectedRow(null);

    const perfil = await getDatosPerfil();
    const year = new Date().getFullYear();
    if (perfil.sede) {
      const grupos = await getComisionesIndiv(perfil.sede, year);
      const listaUsuarios = grupos.flatMap((grupo) =>
        grupo.groupData.users.map((user) => ({
          userId: user.userId,
          nombre: user.nombre,
          rol: user.rol,
          carnet: user.carnet,
        }))
      );
      setUsuarios(listaUsuarios);
    }
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
                        onClick={() => handleDelete(usuario.userId)}
                      >
                        <FaTrashAlt className="mr-1" />
                        Eliminar
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        aria-label="Asignar usuario"
                        onClick={() => handleAssign(index)}
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

      {showModal && <ListarCatedraticosModal onClose={closeModal} selectedRow={selectedRow} groupId={groupId} />}
    </>
  );
};

export default ListarComision;
