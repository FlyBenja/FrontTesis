import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';

const SolicitudRevisiones: React.FC = () => {
  const navigate = useNavigate();

  const estudiantes = [
    { no: 1, nombre: "Axel Emiliano Herrera Muñoz", carnet: "1890-21-9415", fechaSolicitud: "20-02-2024" },
    { no: 2, nombre: "Laura Gabriela Pérez López", carnet: "1890-21-9416", fechaSolicitud: "21-02-2024" },
    { no: 3, nombre: "Carlos Antonio Gutiérrez Morales", carnet: "1890-21-9417", fechaSolicitud: "22-02-2024" },
    { no: 4, nombre: "Sofía Isabel Ramírez Gómez", carnet: "1890-21-9418", fechaSolicitud: "23-02-2024" },
    { no: 5, nombre: "Juan Sebastián Rodríguez Díaz", carnet: "1890-21-9419", fechaSolicitud: "24-02-2024" },
    { no: 6, nombre: "María Fernanda García López", carnet: "1890-21-9420", fechaSolicitud: "25-02-2024" }
  ];

  // State hooks for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [catedraticosPerPage, setCatedraticosPerPage] = useState(5);  // Default to 5 items per page
  const [maxPageButtons, setMaxPageButtons] = useState(10);  // Default to 10 page buttons
  const [searchCarnet, setSearchCarnet] = useState(''); // Search input for student carnet
  const [filteredEstudiantes, setFilteredEstudiantes] = useState(estudiantes); // To store filtered students

  // Handle search
  const handleSearch = () => {
    setFilteredEstudiantes(estudiantes.filter(estudiante =>
      estudiante.carnet.includes(searchCarnet)
    ));
    setCurrentPage(1); // Reset to first page after search
  };

  // Pagination logic
  const indexOfLastEstudiante = currentPage * catedraticosPerPage;
  const indexOfFirstEstudiante = indexOfLastEstudiante - catedraticosPerPage;
  const currentEstudiantes = filteredEstudiantes.slice(indexOfFirstEstudiante, indexOfLastEstudiante);

  const totalPages = Math.ceil(filteredEstudiantes.length / catedraticosPerPage);

  const handleVerDetalle = () => {
    navigate(`/cordinador/revision-estudiante`);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Effect hook to handle window resize and adjust page settings accordingly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCatedraticosPerPage(8);
        setMaxPageButtons(5);
      } else {
        setCatedraticosPerPage(5);
        setMaxPageButtons(10);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Breadcrumb pageName="Nuevas solicitudes de revisión" />
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar por Carnet"
            value={searchCarnet}
            onChange={(e) => setSearchCarnet(e.target.value)}
            className="w-72 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Buscar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white">No.</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white">Nombre</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Carnet</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Fec. Solicitud</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentEstudiantes.map((estudiante) => (
                <tr key={estudiante.no} className="border border-gray-300 dark:border-gray-700">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-900 dark:text-white">{estudiante.no}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-900 dark:text-white">{estudiante.nombre}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-900 dark:text-white hidden sm:table-cell">{estudiante.carnet}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-900 dark:text-white hidden sm:table-cell">{estudiante.fechaSolicitud}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-900 dark:text-white">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                      onClick={handleVerDetalle}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592;
          </button>
          {[...Array(Math.min(totalPages, maxPageButtons))].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8594;
          </button>
        </div>
      </div>
    </>
  );
};

export default SolicitudRevisiones;
