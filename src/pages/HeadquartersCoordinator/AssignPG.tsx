import type React from "react"
import { useState, useEffect } from "react"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getCursos } from "../../ts/General/GetCourses"
import { crearAsignacionSedeCurso } from "../../ts/HeadquartersCoordinator/CreatePG"
import TourAssignPG from "../../components/Tours/HeadquartersCoordinator/TourAssignPG"
import Swal from "sweetalert2"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

/**
 * Component for assigning graduation projects to headquarters
 */
const AssignPG: React.FC = () => {
  // State for headquarters ID and name
  const [sedeId, setSedeId] = useState<number | null>(null)
  const [sedeNombre, setSedeNombre] = useState<string>("")

  // State for PG1 and PG2 checkboxes
  const [pg1, setPg1] = useState(false)
  const [pg2, setPg2] = useState(false)

  // State for disabled checkboxes (when already assigned)
  const [pg1Disabled, setPg1Disabled] = useState(false)
  const [pg2Disabled, setPg2Disabled] = useState(false)

  // State for button disabled status
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  /**
   * Fetch profile data and course information on component mount
   */
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfil = await getDatosPerfil()
        setSedeId(perfil.sede)
        setSedeNombre(perfil.NombreSede)

        if (perfil.sede) {
          const currentYear = new Date().getFullYear()
          const cursos = await getCursos(perfil.sede, currentYear)

          const pg1Available = cursos.some((curso) => curso.course_id === 1)
          const pg2Available = cursos.some((curso) => curso.course_id === 2)

          setPg1(pg1Available)
          setPg2(pg2Available)
          setPg1Disabled(pg1Available)
          setPg2Disabled(pg2Available)

          // Enable button only if at least one course is NOT assigned
          setIsButtonDisabled(pg1Available && pg2Available)
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#DC3545",
          customClass: { confirmButton: "text-white" },
        })
      }
    }

    fetchPerfil()
  }, [])

  /**
   * Handle form submission to assign courses to headquarters
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sedeId) return

    try {
      const currentYear = new Date().getFullYear()
      let payload = null

      if (pg1 && !pg1Disabled && !pg2) {
        payload = { course_id: 1, sede_id: sedeId, year_id: currentYear, courseActive: true }
      } else if (pg2 && !pg2Disabled && !pg1) {
        payload = { course_id: 2, sede_id: sedeId, year_id: currentYear, courseActive: true }
      }

      if (payload) {
        await crearAsignacionSedeCurso(payload)
        Swal.fire({
          icon: "success",
          title: "¡Asignación completada!",
          text: `El curso ${payload.course_id === 1 ? "PG I" : "PG II"} se asignó correctamente a la sede "${sedeNombre}" para el año ${currentYear}.`,
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
          customClass: { confirmButton: "text-white" },
        })

        // Update the list of assigned courses after assignment
        setPg1Disabled(payload.course_id === 1 || pg1Disabled)
        setPg2Disabled(payload.course_id === 2 || pg2Disabled)
        setIsButtonDisabled(pg1Disabled && pg2Disabled)
      } else {
        Swal.fire({
          icon: "warning",
          title: "Selección inválida",
          text: "Por favor, seleccione solo un curso a la vez para asignar.",
          confirmButtonText: "OK",
          confirmButtonColor: "#F59E0B",
          customClass: { confirmButton: "text-white" },
        })
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error en la asignación",
        text: error.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#DC3545",
        customClass: { confirmButton: "text-white" },
      })
    }
  }

  return (
    <>
      <Breadcrumb pageName="Asignar PG" />
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-boxdark rounded-xl shadow-md mt-25">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          {/* Tour start button */}
          <TourAssignPG />
          <h2 className="text-2xl font-bold text-center mb-2 text-black dark:text-white ml-9">
            Asignar PG1 y PG2 a {sedeNombre}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pg1"
                  checked={pg1}
                  onChange={(e) => setPg1(e.target.checked)}
                  disabled={pg1Disabled}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="pg1" className="text-lg text-black dark:text-white">
                  Activar Proyecto de Graduación I
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pg2"
                  checked={pg2}
                  onChange={(e) => setPg2(e.target.checked)}
                  disabled={pg2Disabled}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="pg2" className="text-lg text-black dark:text-white">
                  Activar Proyecto de Graduación II
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg font-medium text-white ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={isButtonDisabled}
          >
            Asignar
          </button>
        </form>
      </div>
    </>
  )
}

export default AssignPG
