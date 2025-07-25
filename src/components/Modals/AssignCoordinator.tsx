import type React from "react"
import { useState, useEffect } from "react"
import { assignsHeadquartersCoordinator } from "../../ts/GeneralCoordinator/AssignsHeadquartersCoordinator"
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

interface AssignCoordinatorProps {
  isOpen: boolean
  onClose: () => void
  onAssigned: () => void
}

const AssignCoordinatorModal: React.FC<AssignCoordinatorProps> = ({ isOpen, onClose, onAssigned }) => {
  const [userId, setUserId] = useState<number | null>(null)
  const [sedeId, setSedeId] = useState<number | null>(null)
  const [sedes, setSedes] = useState<Sede[]>([])
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [loading, setLoading] = useState(false)

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
        setUserId(null)
        setSedeId(null)
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: error.message || "No se pudieron cargar los datos necesarios",
          confirmButtonColor: "#ef4444",
          confirmButtonText: "Aceptar",
        })
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId || !sedeId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor selecciona un coordinador y una sede antes de continuar.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    setLoading(true)
    try {
      await assignsHeadquartersCoordinator(userId, sedeId)
      Swal.fire({
        icon: "success",
        title: "¡Coordinador asignado!",
        text: "El coordinador ha sido asignado exitosamente a la sede.",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Aceptar",
      })
      onAssigned()
      onClose()
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al asignar coordinador",
        text: error.message || "No se pudo asignar el coordinador a la sede",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Aceptar",
      })
    } finally {
      setLoading(false)
    }
  }

  // Obtiene IDs de sedes que ya están asignadas
  const assignedSedesIds = coordinators
    .filter((coord) => coord.sede_id !== null)
    .map((coord) => coord.sede_id)

  // Filtra sedes que NO están asignadas a ningún coordinador
  const availableSedes = sedes.filter((sede) => !assignedSedesIds.includes(sede.sede_id))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-2xl mt-32 md:max-w-3xl md:mt-40 lg:max-w-4xl lg:mt-35 lg:ml-[330px] transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Asignar Coordinador a Sede</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona un coordinador y asígnalo a una sede</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">👤 Coordinador</label>
              <select
                value={userId ?? ""}
                onChange={(e) => setUserId(Number(e.target.value))}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-gray-600
                           transition-all duration-200 outline-none"
                required
              >
                <option value="">Seleccione un coordinador</option>
                {coordinators
                  .filter((coord) => coord.sede_id === null && coord.location === null)
                  .map((coord) => (
                    <option key={coord.user_id} value={coord.user_id}>
                      {coord.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🏢 Sede</label>
              <select
                value={sedeId ?? ""}
                onChange={(e) => setSedeId(Number(e.target.value))}
                className="w-full px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-gray-600
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
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700
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
                "Asignar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignCoordinatorModal
