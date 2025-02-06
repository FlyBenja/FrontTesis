import { ApexOptions } from 'apexcharts'; 
import React, { useEffect, useState } from 'react'; 
import ReactApexChart from 'react-apexcharts';  
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil'; 
import { getTaskStats } from '../../ts/Admin/GetTaskStat';

// Defining the structure of the data expected for the chart
interface ChartData {
  series: { name: string; data: number[] }[]; // Array of series data for the chart (with names and numeric values)
  categories: string[]; // Array for categories (x-axis labels)
}

const TareasEstudiantes: React.FC = () => {
  // State to store chart data, including series and categories
  const [chartData, setChartData] = useState<ChartData>({
    series: [
      { name: 'Estudiantes Pendientes', data: [] },
      { name: 'Estudiantes Confirmados', data: [] },
    ],
    categories: [],
  });

  // State to store the current courseId (PG1 or PG2)
  const [courseId, setCourseId] = useState<number>(1);

  // State to store the dynamic max Y-axis value
  const [maxYValue, setMaxYValue] = useState<number>(30); // New state for the max Y-axis value

  // Fetching data when the component mounts or when courseId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const perfil = await getDatosPerfil();

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Get the current 'sede' (campus) from the profile data
        const sedeId = perfil.sede;

        // Fetch task statistics for the given courseId and current year
        const stats = await getTaskStats(courseId, currentYear, sedeId);

        // Set the dynamic max value for the Y-axis based on totalStudents
        setMaxYValue(stats.totalStudents || 10); // Default to 30 if no totalStudents is available

        // Update chart data with fetched statistics
        setChartData({
          series: [
            { name: 'Estudiantes Pendientes', data: [stats.pendingStudents || 0] }, // Pending students data
            { name: 'Estudiantes Confirmados', data: [stats.confirmedStudents || 0] }, // Confirmed students data
          ],
          categories: [`T ${stats.task?.toString() || 'Sin Datos'}`], // Task ID as the category label
        });
      } catch (error) {
        // Handle any errors during the data fetching process if needed
      }
    };
    fetchData(); // Call the function to fetch data
  }, [courseId]); // Dependency on courseId so data refetches when the courseId changes

  // Function to handle course change selection from the dropdown
  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseId(Number(event.target.value)); // Set the selected courseId
  };

  // Configuration for ApexCharts options
  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'], // Colors for the chart bars
    chart: {
      fontFamily: 'Satoshi, sans-serif', // Font for the chart
      type: 'bar', // Type of chart (bar chart)
      height: 335, // Height of the chart
      stacked: true, // Stacked bars
      toolbar: { show: false }, // Hide the toolbar
      zoom: { enabled: false }, // Disable zoom functionality
    },
    plotOptions: {
      bar: {
        horizontal: false, // Bars will be vertical
        columnWidth: '25%', // Width of the bars
        borderRadius: 0, // No border radius for the bars
      },
    },
    dataLabels: { enabled: false }, // Disable data labels
    xaxis: { categories: chartData.categories }, // Set categories for the x-axis (task label)
    yaxis: { max: maxYValue }, // Use the dynamic max value for the Y-axis
    legend: {
      position: 'top', // Position of the legend
      horizontalAlign: 'left', // Align the legend to the left
      fontFamily: 'Satoshi', // Font for the legend
      fontWeight: 500, // Font weight for the legend
      fontSize: '14px', // Font size for the legend
      markers: { radius: 99 }, // Radius for the legend markers
    },
    fill: { opacity: 1 }, // Set fill opacity for the bars
  };

  return (
    // Container for the chart component
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Estadísticas de Tareas
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="#"
              id="#"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              value={courseId}
              onChange={handleCourseChange}
            >
              <option value="1" className="dark:bg-boxdark">PG1</option>
              <option value="2" className="dark:bg-boxdark">PG2</option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Rendering the chart with the options and data */}
      <ReactApexChart options={options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default TareasEstudiantes;
