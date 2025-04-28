import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getDatosPerfil } from '../../ts/General/GetProfileData';
import { getSedeComplete, SedeStats } from '../../ts/Administrator/GetCompleteHeadquarters';

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
        colors: ['#3C50E0', '#80CAEE'], // Colores del gráfico
        chart: {
            type: 'pie',
            height: 350,
            toolbar: { show: false },
        },
        labels: chartData.labels,
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            fontFamily: 'Satoshi',
            fontWeight: 500,
            fontSize: '14px',
        },
        fill: { opacity: 1 },
        tooltip: {
            y: {
                formatter: (val) => `${val}%`, // Agrega el signo de porcentaje en el tooltip
            },
        },
        dataLabels: {
            formatter: (val) => `${Number(val || 0).toFixed(2)}%`, // Maneja valores nulos o no numéricos
        },
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
