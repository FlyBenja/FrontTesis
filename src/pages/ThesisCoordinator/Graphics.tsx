import type React from "react"
import { useEffect, useState } from "react"
import { getTotalesRevision } from "../../ts/ThesisCoordinatorandReviewer/TotalsReview.ts"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.tsx"
import CardDataStats from "../../components/Cards/CardDataStats.tsx"
import GraficaPorSede from "../../components/Graphics/TotalReviewsPerHeadquarters.tsx"

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <CardDataStats
              title="Total de Revisiones"
              total={totales.totalRevisions.toLocaleString()}
              rate=""
              levelDown={false}
            >
              <svg
                width="200px"
                height="200px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#00c6ff", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#0072ff", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="12" fill="url(#grad1)" />
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Revisiones Aprobadas"
              total={totales.totalApprovedRevisions.toLocaleString()}
              rate=""
              levelDown={false}
            >
              <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    stroke="#21be5c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Revisiones Rechazadas"
              total={totales.totalRejectedRevisions.toLocaleString()}
              rate=""
              levelDown={false}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0,0,256,256"
                width="50px"
                height="50px"
                fillRule="nonzero"
              >
                <g
                  fill="#ff0000"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                >
                  <g transform="scale(5.12,5.12)">
                    <path d="M25,2c-12.681,0 -23,10.319 -23,23c0,12.681 10.319,23 23,23c12.681,0 23,-10.319 23,-23c0,-12.681 -10.319,-23 -23,-23zM33.71,32.29c0.39,0.39 0.39,1.03 0,1.42c-0.2,0.19 -0.45,0.29 -0.71,0.29c-0.26,0 -0.51,-0.1 -0.71,-0.29l-7.29,-7.29l-7.29,7.29c-0.2,0.19 -0.45,0.29 -0.71,0.29c-0.26,0 -0.51,-0.1 -0.71,-0.29c-0.39,-0.39 -0.39,-1.03 0,-1.42l7.29,-7.29l-7.29,-7.29c-0.39,-0.39 -0.39,-1.03 0,-1.42c0.39,-0.39 1.03,-0.39 1.42,0l7.29,7.29l7.29,-7.29c0.39,-0.39 1.03,-0.39 1.42,0c0.39,0.39 0.39,1.03 0,1.42l-7.29,7.29z"></path>
                  </g>
                </g>
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Revisiones Activas"
              total={totales.totalActiveRevisions.toLocaleString()}
              rate=""
              levelDown={false}
            >
              <svg
                width="800px"
                height="800px"
                viewBox="-0.5 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffcc00"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M10.8809 16.15C10.8809 16.0021 10.9101 15.8556 10.967 15.7191C11.024 15.5825 11.1073 15.4586 11.2124 15.3545C11.3175 15.2504 11.4422 15.1681 11.5792 15.1124C11.7163 15.0567 11.8629 15.0287 12.0109 15.03C12.2291 15.034 12.4413 15.1021 12.621 15.226C12.8006 15.3499 12.9399 15.5241 13.0211 15.7266C13.1024 15.9292 13.122 16.1512 13.0778 16.3649C13.0335 16.5786 12.9272 16.7745 12.7722 16.9282C12.6172 17.0818 12.4204 17.1863 12.2063 17.2287C11.9922 17.2711 11.7703 17.2494 11.5685 17.1663C11.3666 17.0833 11.1938 16.9426 11.0715 16.7618C10.9492 16.5811 10.8829 16.3683 10.8809 16.15ZM11.2408 13.42L11.1008 8.20001C11.0875 8.07453 11.1008 7.94766 11.1398 7.82764C11.1787 7.70761 11.2424 7.5971 11.3268 7.5033C11.4112 7.40949 11.5144 7.33449 11.6296 7.28314C11.7449 7.2318 11.8697 7.20526 11.9958 7.20526C12.122 7.20526 12.2468 7.2318 12.3621 7.28314C12.4773 7.33449 12.5805 7.40949 12.6649 7.5033C12.7493 7.5971 12.813 7.70761 12.8519 7.82764C12.8909 7.94766 12.9042 8.07453 12.8909 8.20001L12.7609 13.42C12.7609 13.6215 12.6809 13.8149 12.5383 13.9574C12.3958 14.0999 12.2024 14.18 12.0009 14.18C11.7993 14.18 11.606 14.0999 11.4635 13.9574C11.321 13.8149 11.2408 13.6215 11.2408 13.42Z"
                    fill="#ffcc00"
                    stroke="#333"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M12 21.5C17.1086 21.5 21.25 17.3586 21.25 12.25C21.25 7.14137 17.1086 3 12 3C6.89137 3 2.75 7.14137 2.75 12.25C2.75 17.3586 6.89137 21.5 12 21.5ZM12 19.5C7.60218 19.5 4.25 16.1478 4.25 12.25C4.25 8.35218 7.60218 5 12 5C16.3978 5 19.75 8.35218 19.75 12.25C19.75 16.1478 16.3978 19.5 12 19.5Z"
                    fill="#ffcc00"
                    stroke="#333"
                    strokeWidth="0.5"
                  />
                </g>
              </svg>
            </CardDataStats>
          </>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <GraficaPorSede />
      </div>
    </>
  )
}

export default Graphics
