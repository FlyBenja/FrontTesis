import React, { useState, useEffect } from 'react';
import { getComisionesIndiv } from '../../../ts/HeadquartersCoordinator/GetIndivComissions';
import { getDatosPerfil } from '../../../ts/General/GetProfileData';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import { deleteUserComision } from '../../../ts/HeadquartersCoordinator/DeleteUserCommission';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import ListarCatedraticosModal from '../../../components/Modals/ListProfessorsModal';

/**
 * Interface for User object representing a commission member
 */
interface User {
  userId: number
  nombre: string
  rol: string
  carnet: string
}

/**
 * Mapping of role names to their numeric codes
 */
const ROLE_CODES: { [key: string]: number } = {
  Presidente: 1,
  Secretario: 2,
  "Vocal 1": 3,
  "Vocal 2": 4,
  "Vocal 3": 5,
}

const TOTAL_ROWS = 5 // Total number of rows to display (5 roles)

const ListCommission: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]) // State to store list of users
  const [loading, setLoading] = useState<boolean>(true) // Loading state
  const [showModal, setShowModal] = useState<boolean>(false) // State to show/hide modal
  const [selectedRow, setSelectedRow] = useState<number | null>(null) // State to store the selected row
  const [groupId, setGroupId] = useState<number | null>(null) // State to store group ID

  /**
   * Fetch data when component is mounted
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getDatosPerfil() // Fetch user profile data
        const year = new Date().getFullYear() // Get current year

        if (profile.sede) {
          const groups = await getComisionesIndiv(profile.sede, year) // Fetch commissions for the current year

          if (groups.length === 0) {
            // If no commissions, show a message
            setUsers([])
          } else {
            setGroupId(groups[0].groupId) // Set the group ID
            const userList = groups.flatMap((group) =>
              group.groupData.users.map((user) => ({
                userId: user.userId,
                nombre: user.nombre,
                rol: user.rol,
                carnet: user.carnet,
              })),
            )
            setUsers(userList) // Set users for the current group
          }
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error) // Log any errors during data fetching
      } finally {
        setLoading(false) // Set loading to false after data fetch
      }
    }

    fetchData()
  }, []) // Empty dependency array, meaning the effect will run only once when the component is mounted

  /**
   * This function creates an array of users with empty spaces if needed
   */
  const usersWithSpaces = () => {
    const data: User[] = Array(TOTAL_ROWS).fill({
      userId: 0,
      nombre: "",
      rol: "",
      carnet: "",
    })

    // Place each user in the correct position according to their role
    users.forEach((user) => {
      const position = ROLE_CODES[user.rol] - 1
      if (position >= 0 && position < TOTAL_ROWS) {
        data[position] = user
      }
    })

    return data
  }

  /**
   * Handle deletion of a user from the commission
   */
  const handleDelete = async (userId: number) => {
    if (!groupId) return // Return if no group ID is selected

    // Confirm before deleting the user
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar a este usuario de la comisión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        const response = await deleteUserComision(groupId, userId) // Call API to delete user

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: response.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
          customClass: { confirmButton: "text-white" },
        })

        // Re-fetch the data after deletion
        const profile = await getDatosPerfil()
        const year = new Date().getFullYear()
        if (profile.sede) {
          const groups = await getComisionesIndiv(profile.sede, year)
          const userList = groups.flatMap((group) =>
            group.groupData.users.map((user) => ({
              userId: user.userId,
              nombre: user.nombre,
              rol: user.rol,
              carnet: user.carnet,
            })),
          )
          setUsers(userList)
        }
      } catch (error: any) {
        // Show error alert if there is a problem deleting the user
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: error?.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
          customClass: { confirmButton: "text-white" },
        })
      }
    }
  }

  /**
   * Handle assignment of a user to a role
   */
  const handleAssign = (rowIndex: number) => {
    setSelectedRow(rowIndex + 1) // Set the selected row
    setShowModal(true) // Show the modal
  }

  /**
   * Close the modal and re-fetch the data
   */
  const closeModal = async () => {
    setShowModal(false) // Hide the modal
    setSelectedRow(null) // Reset the selected row

    const profile = await getDatosPerfil()
    const year = new Date().getFullYear()
    if (profile.sede) {
      const groups = await getComisionesIndiv(profile.sede, year)
      const userList = groups.flatMap((group) =>
        group.groupData.users.map((user) => ({
          userId: user.userId,
          nombre: user.nombre,
          rol: user.rol,
          carnet: user.carnet,
        })),
      )
      setUsers(userList) // Update the user list
    }
  }

  // Show loading message while data is being fetched
  if (loading) {
    return <div className="text-center">Cargando...</div>
  }

  // Show message if no users are found
  if (users.length === 0) {
    return (
      <div className="relative bg-gray-100 dark:bg-boxdark">
        <div className="absolute top-50 left-0 right-0 text-center p-6 bg-white dark:bg-boxdark rounded shadow-lg max-w-lg mx-auto">
          <p className="text-xl text-black dark:text-white font-semibold">
            No Hay Ninguna Comisión Creada Para Este Año.
          </p>
        </div>
      </div>
    )
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
              {usersWithSpaces().map((user, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-strokedark">
                  <td className="py-2 px-4 text-black dark:text-white border-r text-center">{index + 1}</td>
                  <td className="py-2 px-4 text-black dark:text-white border-r text-center">{user.nombre}</td>
                  <td className="py-2 px-4 text-black dark:text-white border-r text-center">{user.rol}</td>
                  <td className="py-2 px-4 text-black dark:text-white hidden sm:table-cell border-r text-center">
                    {user.carnet}
                  </td>
                  <td className="py-2 px-4 flex items-center justify-center space-x-3">
                    {user.nombre ? (
                      <button
                        className="text-red-500 hover:text-red-700 flex items-center"
                        aria-label="Eliminar usuario"
                        onClick={() => handleDelete(user.userId)}
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
  )
}

export default ListCommission
