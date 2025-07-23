import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react"
import { getSedes } from "../../ts/GeneralCoordinator/GetHeadquarters"

type Sede = {
  sede_id: number
  nameSede: string
  address: string
}

type SedesContextType = {
  sedes: Sede[]
  reloadSedes: () => Promise<void>
}

const SedesContext = createContext<SedesContextType | undefined>(undefined)

export const SedesProvider = ({ children }: { children: ReactNode }) => {
  const [sedes, setSedes] = useState<Sede[]>([])

  const reloadSedes = useCallback(async () => {
    try {
      const data = await getSedes()
      setSedes(data)
    } catch (error) {
      console.error("Error al obtener las sedes:", error)
    }
  }, [])

  useEffect(() => {
    reloadSedes()
  }, [reloadSedes])

  return (
    <SedesContext.Provider value={{ sedes, reloadSedes }}>
      {children}
    </SedesContext.Provider>
  )
}

export const useSedes = () => {
  const context = useContext(SedesContext)
  if (!context) {
    throw new Error("useSedes must be used within a SedesProvider")
  }
  return context
}
