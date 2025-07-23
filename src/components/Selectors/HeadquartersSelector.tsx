import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getSedes } from "../../ts/GeneralCoordinator/GetHeadquarters"
import { useSede } from "../../components/ReloadPages/HeadquartersContext"

type Sede = {
  sede_id: number
  nameSede: string
  address: string
}

type Props = {
  onChange?: (value: string) => void
  reloadSedes?: () => void  // Función opcional para recargar sedes externamente
}

const SedeSelector = ({ onChange, reloadSedes }: Props) => {
  const [sedes, setSedes] = useState<Sede[]>([])
  const hasSetSelectedSede = useRef(false)
  const { selectedSede, setSelectedSede } = useSede()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes()
        setSedes(data)
      } catch (error) {
        console.error("Error al obtener las sedes:", error)
      }
    }
    fetchSedes()
  }, [])

  useEffect(() => {
    if (!hasSetSelectedSede.current && sedes.length > 0) {
      if (!selectedSede || !sedes.some(s => s.sede_id.toString() === selectedSede)) {
        setSelectedSede(sedes[0].sede_id.toString())
      }
      hasSetSelectedSede.current = true
    }
  }, [sedes])

  const handleSedeChange = (value: string) => {
    setSelectedSede(value)
    if (typeof onChange === "function") {
      onChange(value)
    }

    if (reloadSedes) {
      reloadSedes() // Aquí recargamos la API si nos pasan la función
    }

    // Navegación según ruta actual
    if (location.pathname.startsWith("/coordinadorgeneral/time-line")) {
      navigate(-1)
    } else if (location.pathname.startsWith("/coordinadorgeneral/tareas-estudiante")) {
      navigate(-2)
    } else if (
      location.pathname.startsWith("/coordinadorgeneral/capitulo") ||
      location.pathname.startsWith("/coordinadorgeneral/propuestas")
    ) {
      navigate(-3)
    }
  }

  return (
    <div
      className="flex-1 max-w-xs mx-auto sm:mx-7 sm:max-w-sm md:max-w-md"
      style={{
        position: "relative",
        left: window.innerWidth <= 640 ? "-8px" : "-10px",
        top: window.innerWidth <= 640 ? "-7.5px" : "1px",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <label
            htmlFor="sede"
            className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap"
          >
            Seleccione sede:
          </label>
        </div>
        <select
          id="sede"
          className="w-full px-4 py-2.5 text-sm bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
          value={selectedSede}
          onChange={(e) => handleSedeChange(e.target.value)}
        >
          {sedes.length === 0 ? (
            <option disabled value="">
              No existen sedes registradas
            </option>
          ) : (
            sedes.map((sede) => (
              <option key={sede.sede_id} value={sede.sede_id}>
                {sede.nameSede}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  )
}

export default SedeSelector
