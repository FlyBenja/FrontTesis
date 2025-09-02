import type React from "react"
import { useState, useEffect } from "react"
import { createHeadquartersCoordinator } from "../../ts/GeneralCoordinator/CreateHeadquartersCoordinator"
import { getSedes } from "../../ts/GeneralCoordinator/GetHeadquarters"
import { getHeadquartersCoordinator } from "../../ts/GeneralCoordinator/GetHeadquartersCoordinator"
import Swal from "sweetalert2"

interface Sede {
  sede_id: number
  nameSede: string
  address: string
}

interface Coordinator {
  user_id: number
  name: string
  email: string
  carnet: string
  sede_id: number | null
  location: { nameSede: string } | null
}

interface CreateCoordinatorProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

const CreateCoordinatorModal: React.FC<CreateCoordinatorProps> = ({ isOpen, onClose, onCreated }) => {
  const [codigo, setCodigo] = useState<string>("")
  const [nombre, setNombre] = useState<string>("")
  const [correo, setCorreo] = useState<string>("")
  const [sedeId, setSedeId] = useState<number | null>(null)
  const [sedes, setSedes] = useState<Sede[]>([])
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sedesData = await getSedes()
        const coordinatorsData = await getHeadquartersCoordinator()

        const transformedCoordinators = coordinatorsData.map((coord) => ({
          user_id: coord.user_id,
          name: coord.name,
          email: coord.email,
          carnet: coord.carnet,
          sede_id: coord.sede_id,
          location: coord.location,
        }))

        setSedes(sedesData)
        setCoordinators(transformedCoordinators)
        setCodigo("")
        setNombre("")
        setCorreo("")
        setSedeId(null)
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar sedes",
          text: error.message || "No se pudieron cargar las sedes",
          confirmButtonColor: "#ef4444",
          confirmButtonText: "De Acuerdo",
        })
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codigo || !nombre || !correo || !sedeId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setLoading(true)
    try {
      await createHeadquartersCoordinator(nombre, correo, codigo, sedeId)
      Swal.fire({
        icon: "success",
        title: "¡Coordinador creado!",
        text: `El coordinador ${nombre} ha sido creado exitosamente.`,
        confirmButtonColor: "#10b981",
        confirmButtonText: "De Acuerdo",
      })
      onCreated()
      onClose()
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al crear coordinador",
        text: error.message || "No se pudo crear el coordinador",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "De Acuerdo",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar sedes que no tienen coordinador asignado
  const assignedSedesIds = coordinators
    .filter((coord) => coord.sede_id !== null)
    .map((coord) => coord.sede_id)

  const availableSedes = sedes.filter((sede) => !assignedSedesIds.includes(sede.sede_id))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-2xl mt-32 md:max-w-3xl md:mt-40 lg:max-w-4xl lg:mt-35 lg:ml-[330px] transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Crear Coordinador</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Registra un nuevo coordinador de sede</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="ejemplo@miumg.edu.gt"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🎫 Código</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="Ingrese el código"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                👤 Nombre Completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🏢 Sede</label>
              <select
                value={sedeId ?? ""}
                onChange={(e) => setSedeId(Number(e.target.value))}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                required
              >
                <option value="">Seleccione una sede</option>
                {availableSedes.map((sede) => (
                  <option key={sede.sede_id} value={sede.sede_id}>
                    {sede.nameSede}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 mr-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-gray-700 dark:text-gray-300 font-medium rounded-md transition-all duration-200 text-sm
                         border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700
                         text-white font-medium rounded-md transition-all duration-200 transform text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Cargando...
                </div>
              ) : (
                "Crear Coordinador"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCoordinatorModal
