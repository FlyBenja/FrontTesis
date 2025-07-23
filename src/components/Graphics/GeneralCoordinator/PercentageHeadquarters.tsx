import type { ApexOptions } from "apexcharts"
import type React from "react"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { getSedeComplete, type SedeStats } from "../../../ts/Administrator/GetCompleteHeadquarters"
import { Loader2 } from "lucide-react"
import { useSede } from "../../ReloadPages/HeadquarterPagesContext"

interface ChartData {
  series: number[]
  labels: string[]
}

const PercentageHeadquarters: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    labels: [],
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { selectedSede } = useSede() // ✅ Obtener sede desde el contexto

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSede) return
      setIsLoading(true)
      try {
        const stats: SedeStats = await getSedeComplete(Number(selectedSede))
        if (stats) {
          setChartData({
            series: [
              Number.parseFloat(stats.completionRate),
              Number.parseFloat(stats.pendingRate),
            ],
            labels: ["Completado", "Pendiente"],
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setChartData({
          series: [0, 0],
          labels: ["Completado", "Pendiente"],
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedSede]) // ✅ Ejecutar cuando cambia la sede

  const options: ApexOptions = {
    colors: ["#6366F1", "#A78BFA"],
    chart: {
      type: "pie",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    labels: chartData.labels,
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: { radius: 99 },
      labels: { colors: "#374151" },
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Satoshi, sans-serif",
      },
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    dataLabels: {
      formatter: (val) => `${Number(val || 0).toFixed(2)}%`,
      style: {
        fontSize: "14px",
        fontFamily: "Satoshi, sans-serif",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45,
      },
    },
    stroke: {
      colors: ["#ffffff"],
      width: 2,
    },
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-800 dark:to-indigo-800 blur-3xl"></div>
      </div>

      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Porcentaje de Tareas 📈</h4>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          <span className="sr-only">Cargando porcentaje...</span>
        </div>
      ) : (
        <ReactApexChart options={options} series={chartData.series} type="pie" height={350} />
      )}
    </div>
  )
}

export default PercentageHeadquarters
