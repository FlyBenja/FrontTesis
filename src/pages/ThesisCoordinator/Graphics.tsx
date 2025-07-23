import type React from "react"
import { useEffect, useState } from "react"
import { getTotalesRevision } from "../../ts/ThesisCoordinatorandReviewer/TotalsReview.ts"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.tsx"
import CardDataStats from "../../components/Cards/CardDataStats.tsx"
import GraficaPorSede from "../../components/Graphics/ThesisCoordinator/TotalReviewsPerHeadquarters.tsx"
import { List, CheckCircle, XCircle, AlertCircle } from "lucide-react" // Import Lucide icons

/**
 * Component for displaying thesis review statistics and charts
 */
const Graphics: React.FC = () => {
  // State for storing review statistics
  const [totales, setTotales] = useState({
    totalRevisions: 0,
    totalApprovedRevisions: 0,
    totalRejectedRevisions: 0,
    totalActiveRevisions: 0,
    totalRevisores: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  /**
   * Fetch review statistics data when component mounts
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalesRevision()
        setTotales(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <>
      <Breadcrumb pageName="Graficas" />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {loading ? (
            <div className="flex justify-center items-center col-span-full min-h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
              </div>
            </div>
          ) : (
            <>
              <CardDataStats
                title="Total de Revisiones"
                total={totales.totalRevisions.toLocaleString()}
                rate=""
                levelDown={false}
              >
                <List className="h-12 w-12 text-blue-500 dark:text-blue-300" />
              </CardDataStats>
              <CardDataStats
                title="Revisiones Aprobadas"
                total={totales.totalApprovedRevisions.toLocaleString()}
                rate=""
                levelDown={false}
              >
                <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-300" />
              </CardDataStats>
              <CardDataStats
                title="Revisiones Rechazadas"
                total={totales.totalRejectedRevisions.toLocaleString()}
                rate=""
                levelDown={false}
              >
                <XCircle className="h-12 w-12 text-red-500 dark:text-red-300" />
              </CardDataStats>
              <CardDataStats
                title="Revisiones Activas"
                total={totales.totalActiveRevisions.toLocaleString()}
                rate=""
                levelDown={false}
              >
                <AlertCircle className="h-12 w-12 text-yellow-500 dark:text-yellow-300" />
              </CardDataStats>
            </>
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <GraficaPorSede />
        </div>
      </div>
    </>
  )
}

export default Graphics
