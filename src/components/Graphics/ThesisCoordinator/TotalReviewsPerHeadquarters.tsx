import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getRevisionesPorSede } from '../../../ts/ThesisCoordinatorandReviewer/ReviewsbyHeadquarters';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'smooth', // Cambié a smooth para los gráficos de área
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [], // Las categorías se actualizarán dinámicamente
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100, // Este valor se actualizará dinámicamente
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const TotalReviewsPerHeadquarters: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Product One',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },
      {
        name: 'Product Two',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
  });

  const [totalSedes, setTotalSedes] = useState<number>(0);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [updatedOptions, setUpdatedOptions] = useState<ApexOptions>(options);

  const updateYAxis = (totalRequests: number) => {
    let max = Math.floor(totalRequests / 10) * 10;
    if (totalRequests % 10 !== 0) {
      max += 10;
    }
    return max;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRevisionesPorSede();
        const totalRequests = data.data.reduce((sum, item) => sum + item.totalRequests, 0);
        const names = data.data.map((item) => item.sede.nameSede);
        setTotalSedes(data.data.length);
        setTotalRequests(totalRequests);

        const seriesData = data.data.map((item) => item.totalRequests);

        setState({
          series: [
            {
              name: 'Total Requests',
              data: seriesData,
            },
          ],
        });

        // Actualizamos opciones con los nuevos datos
        setUpdatedOptions({
          ...options,
          yaxis: {
            ...options.yaxis,
            max: updateYAxis(totalRequests),
          },
          xaxis: {
            ...options.xaxis,
            categories: names, // Actualizamos las categorías de las sedes
          },
        });
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Sedes</p>
              <p className="text-sm font-medium">{totalSedes}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Requests</p>
              <p className="text-sm font-medium">{totalRequests}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={updatedOptions} // Usamos las opciones actualizadas
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalReviewsPerHeadquarters;
