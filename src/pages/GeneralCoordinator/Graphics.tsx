import { useEffect, useState } from "react"
import { getStudentsSede } from "../../ts/Administrator/GetStudentsSede.ts"
import { useSede } from "../../components/ReloadPages/HeadquarterPagesContext"
import type React from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.tsx"
import CardDataStats from "../../components/Cards/CardDataStats.tsx"
import TasksStudents from "../../components/Graphics/GeneralCoordinator/TasksStudents.tsx"
import PercentageHeadquarters from "../../components/Graphics/GeneralCoordinator/PercentageHeadquarters.tsx"
import { Users, CheckCircle, Clock } from "lucide-react"

const Graphics: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0)
  const [totalStudentsHeadquarters, setTotalStudentsHeadquarters] = useState<number>(0)
  const [totalApprovedRevisions, setTotalApprovedRevisions] = useState<number>(0)
  const [totalInRevisions, setTotalInRevisions] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { selectedSede } = useSede()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (selectedSede) {
          const studentsData = await getStudentsSede(Number(selectedSede))
          setTotalStudents(studentsData.totalStudents ?? 0)
          setTotalStudentsHeadquarters(studentsData.totalStudentsSede ?? 0)
          setTotalApprovedRevisions(studentsData.totalApprovedRevisions ?? 0)
          setTotalInRevisions(studentsData.totalInRevisions ?? 0)
        }
      } catch (error) {
        setTotalStudents(0)
        setTotalStudentsHeadquarters(0)
        setTotalApprovedRevisions(0)
        setTotalInRevisions(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedSede])

  const studentHeadquartersPercentage =
    totalStudents > 0
      ? ((totalStudentsHeadquarters / totalStudents) * 100).toFixed(2)
      : "0"

  const approvedRevisionsPercentage =
    totalInRevisions > 0
      ? ((totalApprovedRevisions / totalInRevisions) * 100).toFixed(2)
      : "0"

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumb pageName="Gráficas" />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          Resumen de Estadísticas
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="mt-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-4 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Total Estudiantes"
              total={totalStudentsHeadquarters.toLocaleString()}
              rate={`${studentHeadquartersPercentage}%`}
              levelUp={Number(studentHeadquartersPercentage) > 0}
              levelDown={Number(studentHeadquartersPercentage) <= 0}
            >
              <Users className="h-6 w-6" />
            </CardDataStats>
            <CardDataStats
              title="Revisiones Aprobadas"
              total={totalApprovedRevisions.toLocaleString()}
              rate={`${approvedRevisionsPercentage}%`}
              levelUp={Number(approvedRevisionsPercentage) > 0}
              levelDown={Number(approvedRevisionsPercentage) <= 0}
            >
              <CheckCircle className="h-6 w-6" />
            </CardDataStats>
            <CardDataStats
              title="Total en Revisiones"
              total={totalInRevisions.toLocaleString()}
              rate={`${
                100 - Number(approvedRevisionsPercentage) > 0
                  ? (100 - Number(approvedRevisionsPercentage)).toFixed(2)
                  : "0"
              }%`}
              levelUp={false}
              levelDown={100 - Number(approvedRevisionsPercentage) > 0}
            >
              <Clock className="h-6 w-6" />
            </CardDataStats>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Visualización de Datos</h2>
        {isLoading ? (
          <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
            {[1, 2].map((_, i) => (
              <div key={i} className="col-span-12 animate-pulse xl:col-span-6">
                <div className="h-96 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-[calc(100%-2rem)] w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-6">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Porcentaje por Sede</h3>
                </div>
                <PercentageHeadquarters />
              </div>
            </div>
            <div className="col-span-12 xl:col-span-6">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Tareas de Estudiantes</h3>
                </div>
                <TasksStudents />
              </div>
            </div>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de Actividad</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Última actualización: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Estudiantes activos: {totalStudentsHeadquarters.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Graphics
