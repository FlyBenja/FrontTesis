import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getDatosPerfil } from '../../ts/General/GetProfileData';
import { getSedeComplete, SedeStats } from '../../ts/Administrator/GetCompleteHeadquarters';

/**
 * Interface to define the structure of the chart data.
 */
interface ChartData {
    series: number[]; // Array of series data for the chart (percentage values)
    labels: string[]; // Array of labels for the chart
}

/**
 * for a specific 'sede' (campus) based on the user's profile information.
 * It fetches the required data from backend services and renders it dynamically.
 */
const PercentageHeadquarters: React.FC = () => {
    // State to store chart data including series and labels
    const [chartData, setChartData] = useState<ChartData>({
        series: [],
        labels: [],
    });

    /**
     * Fetch data when the component mounts.
     * Retrieves the user profile and then gets the completion and pending rates
     * for the corresponding 'sede', updating the chart data accordingly.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile data
                const perfil = await getDatosPerfil();

                // Get the current 'sede' (campus) from the profile data
                const sedeId = perfil.sede;

                // Fetch advanced task statistics for the given 'sedeId'
                const stats: SedeStats = await getSedeComplete(sedeId);

                // If stats are available, update the chart data
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
    }, []); // Empty dependency array ensures it runs once on mount

    // Configuration options for the pie chart
    const options: ApexOptions = {
        colors: ['#3C50E0', '#80CAEE'], // Custom colors for the chart
        chart: {
            type: 'pie',
            height: 350,
            toolbar: { show: false }, // Hides the chart toolbar
        },
        labels: chartData.labels, // Labels for each section of the pie
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            fontFamily: 'Satoshi',
            fontWeight: 500,
            fontSize: '14px',
        },
        fill: { opacity: 1 }, // Full opacity for chart fill
        tooltip: {
            y: {
                formatter: (val) => `${val}%`, // Displays percentage symbol in tooltip
            },
        },
        dataLabels: {
            formatter: (val) => `${Number(val || 0).toFixed(2)}%`, // Format labels inside the pie chart
        },
    };

    return (
        // Container for the pie chart
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Porcentaje de Tareas
                    </h4>
                </div>
            </div>

            {/* Rendering the pie chart with dynamic options and series */}
            <ReactApexChart options={options} series={chartData.series} type="pie" height={350} />
        </div>
    );
};

export default PercentageHeadquarters;
