import type { ApexOptions } from "apexcharts"
import type React from "react"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { getDatosPerfil } from "../../ts/General/GetProfileData"
import { getTaskStats } from "../../ts/Administrator/GetTaskStat"
import { Loader2 } from "lucide-react" // Import spinner icon

/**
 * Interface to define the structure of the chart data.
 */
interface ChartData {
  series: { name: string; data: number[] }[] // Array of series, each with a name and data points
  categories: string[] // Array of task labels (e.g., T1, T2, etc.)
}

/**
 * `TasksStudents` component displays a stacked bar chart showing the number of pending and confirmed students
 * for each task based on the selected course and the user's associated 'sede' (campus).
 * It fetches the required data dynamically from backend services and updates the chart accordingly.
 */
const TasksStudents: React.FC = () => {
  // State to store the chart data (series and categories)
  const [chartData, setChartData] = useState<ChartData>({
    series: [
      { name: "Estudiantes Pendientes", data: [] },
      { name: "Estudiantes Confirmados", data: [] },
    ],
    categories: [],
  })
  // State to store the selected course ID (default is 1)
  const [courseId, setCourseId] = useState<number>(1)
  // State to store the maximum Y-axis value for the chart
  const [maxYValue, setMaxYValue] = useState<number>(30)
  // State to manage loading status
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /**
   * Fetch data whenever the selected course ID changes.
   * It retrieves the user's profile and then fetches the task statistics
   * corresponding to the selected course, current year, and user's 'sede'.
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch user profile data
        const perfil = await getDatosPerfil()
        const currentYear = new Date().getFullYear()
        const sedeId = perfil.sede
        // Fetch task statistics
        const stats = await getTaskStats(courseId, currentYear, sedeId)
        // Get the total number of students from the stats
        const totalStudents = stats.find((s) => s.totalStudents !== undefined)?.totalStudents || 10
        setMaxYValue(totalStudents)
        // Prepare task categories and corresponding student data
        let categories = stats.filter((s) => s.task !== undefined).map((s) => `T${s.task}`)
        let pendingStudents = stats.filter((s) => s.task !== undefined).map((s) => s.pendingStudents || 0)
        let confirmedStudents = stats.filter((s) => s.task !== undefined).map((s) => s.confirmedStudents || 0)
        // Handle case when no data is available
        if (categories.length === 0) {
          categories = ["Sin Datos"]
          pendingStudents = [0]
          confirmedStudents = [0]
        }
        // Update the chart data state
        setChartData({
          series: [
            { name: "Estudiantes Pendientes", data: pendingStudents },
            { name: "Estudiantes Confirmados", data: confirmedStudents },
          ],
          categories,
        })
      } catch (error) {
        // Handle errors silently
        console.error("Error fetching task stats:", error)
        setChartData({
          series: [
            { name: "Estudiantes Pendientes", data: [0] },
            { name: "Estudiantes Confirmados", data: [0] },
          ],
          categories: ["Sin Datos"],
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData() // Execute data fetching
  }, [courseId]) // Dependency on courseId

  /**
   * Handles the change event when the user selects a different course from the dropdown.
   * @param event The change event from the select element.
   */
  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseId(Number(event.target.value))
  }

  // Configuration options for the stacked bar chart
  const options: ApexOptions = {
    colors: ["#6366F1", "#A78BFA"], // Custom colors for the chart (indigo/purple shades)
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: { show: false }, // Hide the toolbar
      zoom: { enabled: false }, // Disable zoom functionality
      background: "transparent", // Ensure chart background is transparent
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%", // Width of the columns
        borderRadius: 4, // Slightly rounded bars
      },
    },
    dataLabels: { enabled: false }, // Disable data labels on bars
    xaxis: {
      categories: chartData.categories, // X-axis categories (tasks)
      labels: {
        style: {
          colors: "#6B7280", // Gray-500 for labels
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      max: maxYValue, // Maximum value for the Y-axis
      labels: {
        style: {
          colors: "#6B7280", // Gray-500 for labels
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: { radius: 99 }, // Make legend markers circular
      labels: {
        colors: "#374151", // Darker gray for legend labels
      },
    },
    fill: { opacity: 1 }, // Full opacity for bar colors
    grid: {
      show: true,
      borderColor: "#E5E7EB", // Light gray grid lines
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: "dark", // Dark tooltip theme
      style: {
        fontSize: "12px",
        fontFamily: "Satoshi, sans-serif",
      },
    },
  }

  return (
    // Container for the bar chart and course selection dropdown
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-800 dark:to-purple-800 blur-3xl"></div>
      </div>

      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Estadísticas de Tareas 📊</h4>
        </div>
        <div>
          {/* Course selection dropdown */}
          <select
            className="py-1.5 pl-4 pr-10 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-600"
            value={courseId}
            onChange={handleCourseChange}
          >
            <option value="1">PG1</option>
            <option value="2">PG2</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <span className="sr-only">Cargando estadísticas...</span>
        </div>
      ) : (
        /* Render the stacked bar chart with dynamic options and series */
        <ReactApexChart options={options} series={chartData.series} type="bar" height={350} />
      )}
    </div>
  )
}

export default TasksStudents
