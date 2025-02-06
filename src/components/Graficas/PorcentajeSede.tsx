import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getSedeComplete, SedeStats } from '../../ts/Admin/GetSedeComplete';

// Defining the structure of the data expected for the chart
interface ChartData {
    series: number[]; // Array of series data for the chart (percentage values)
    labels: string[]; // Array for labels (completion vs pending)
}

const PorcentajeSede: React.FC = () => {
    // State to store chart data, including series and labels
    const [chartData, setChartData] = useState<ChartData>({
        series: [],
        labels: [],
    });

    // Fetching data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile data
                const perfil = await getDatosPerfil();

                // Get the current 'sede' (campus) from the profile data
                const sedeId = perfil.sede; // Retrieve the sedeId directly from the profile data

                // Fetch advanced task statistics for the given sedeId
                const stats: SedeStats = await getSedeComplete(sedeId);

                // If the stats data is available, update the chart data
                if (stats) {
                    setChartData({
                        series: [
                            parseFloat(stats.completionRate), // Completion rate
                            parseFloat(stats.pendingRate), // Pending rate
                        ],
                        labels: ['Completado', 'Pendiente'], // Labels for the chart
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData(); // Call the function to fetch data
    }, []); // Empty dependency array to fetch data on component mount

    // Configuration for ApexCharts options
    const options: ApexOptions = {
        colors: ['#3C50E0', '#80CAEE'], // Colors for the chart sections
        chart: {
            type: 'pie', // Type of chart (pie chart)
            height: 350, // Height of the chart
            toolbar: { show: false }, // Hide the toolbar
        },
        labels: chartData.labels, // Set labels for the pie chart
        legend: {
            position: 'top', // Position of the legend
            horizontalAlign: 'center', // Align the legend in the center
            fontFamily: 'Satoshi', // Font for the legend
            fontWeight: 500, // Font weight for the legend
            fontSize: '14px', // Font size for the legend
        },
        fill: { opacity: 1 }, // Set fill opacity for the sections
    };

    return (
        // Container for the chart component
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Porcentaje de Tareas
                    </h4>
                </div>
            </div>

            {/* Rendering the chart with the options and data */}
            <ReactApexChart options={options} series={chartData.series} type="pie" height={350} />
        </div>
    );
};

export default PorcentajeSede;
