import { ApexOptions } from 'apexcharts'; 
import React, { useEffect, useState } from 'react'; 
import ReactApexChart from 'react-apexcharts';  
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil'; 
import { getTaskStats } from '../../ts/Admin/GetTaskStat';

// Defines the structure of the chart data
interface ChartData {
  series: { name: string; data: number[] }[];
  categories: string[];
}

const TareasEstudiantes: React.FC = () => {
  // State to store the chart data
  const [chartData, setChartData] = useState<ChartData>({
    series: [
      { name: 'Estudiantes Pendientes', data: [] },
      { name: 'Estudiantes Confirmados', data: [] },
    ],
    categories: [],
  });

  // State to store the selected course ID
  const [courseId, setCourseId] = useState<number>(1);
  // State to store the maximum Y-axis value
  const [maxYValue, setMaxYValue] = useState<number>(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const perfil = await getDatosPerfil();
        const currentYear = new Date().getFullYear();
        const sedeId = perfil.sede;
        
        // Fetch task statistics for the given course and year
        const stats = await getTaskStats(courseId, currentYear, sedeId);

        // Determine the maximum number of students
        const totalStudents = stats.find(s => s.totalStudents !== undefined)?.totalStudents || 10;
        setMaxYValue(totalStudents);

        // Extract task categories and student counts
        let categories = stats.filter(s => s.task !== undefined).map(s => `T${s.task}`);
        let pendingStudents = stats.filter(s => s.task !== undefined).map(s => s.pendingStudents || 0);
        let confirmedStudents = stats.filter(s => s.task !== undefined).map(s => s.confirmedStudents || 0);

        // Handle empty data case
        if (categories.length === 0) {
          categories = ['Sin Datos'];
          pendingStudents = [0];
          confirmedStudents = [0];
        }

        // Update the chart data state
        setChartData({
          series: [
            { name: 'Estudiantes Pendientes', data: pendingStudents },
            { name: 'Estudiantes Confirmados', data: confirmedStudents },
          ],
          categories,
        });
      } catch (error) {
        // Handle errors silently
      }
    };

    fetchData();
  }, [courseId]); // Re-fetch data when course ID changes

  // Handles the change event for the course selection dropdown
  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseId(Number(event.target.value));
  };

  // Configuration for ApexCharts options
  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'], // Chart colors
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '25%',
        borderRadius: 0,
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: chartData.categories },
    yaxis: { max: maxYValue },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: { radius: 99 },
    },
    fill: { opacity: 1 },
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
          {/* Course selection dropdown */}
          <select
            className="py-1 pl-3 pr-8 text-sm font-medium outline-none"
            value={courseId}
            onChange={handleCourseChange}
          >
            <option value="1">PG1</option>
            <option value="2">PG2</option>
          </select>
        </div>
      </div>
      {/* Render the chart with the configured options and data */}
      <ReactApexChart options={options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default TareasEstudiantes;