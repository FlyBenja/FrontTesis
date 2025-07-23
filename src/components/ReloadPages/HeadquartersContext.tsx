import { createContext, useContext, useState, ReactNode } from "react"

type HeadquartersContextType = {
    selectedSede: string
    setSelectedSede: (sedeId: string) => void
}

const HeadquartersContext = createContext<HeadquartersContextType | undefined>(undefined)

export const SedeProvider = ({ children }: { children: ReactNode }) => {
    const [selectedSede, setSelectedSede] = useState<string>(() => {
        return localStorage.getItem("selectedSedeId") || ""
    })

    const changeSede = (sedeId: string) => {
        localStorage.setItem("selectedSedeId", sedeId)
        setSelectedSede(sedeId)
    }

    return (
        <HeadquartersContext.Provider value={{ selectedSede, setSelectedSede: changeSede }}>
            {children}
        </HeadquartersContext.Provider>
    )
}

export const useSede = () => {
    const context = useContext(HeadquartersContext)
    if (!context) {
        throw new Error("useSede must be used within a SedeProvider")
    }
    return context
}
