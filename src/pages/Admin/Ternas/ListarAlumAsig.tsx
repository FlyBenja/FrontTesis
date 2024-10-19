import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Persona {
  alumno1: string;
  alumno2: string;
  alumno3: string;
}

const ListarAlumAsig: React.FC = () => {
  // Datos simulados de las ternas
  const ternas: Persona[] = [
    { alumno1: 'Juan Pérez', alumno2: 'María López', alumno3: 'Carlos Sánchez' },
    { alumno1: 'Ana Méndez', alumno2: 'Pedro González', alumno3: 'Luis García' },
    { alumno1: 'Gabriela Ruiz', alumno2: 'David Hernández', alumno3: 'Elena Gómez' },
    { alumno1: 'Jorge Martínez', alumno2: 'Clara Castillo', alumno3: 'Daniel Flores' },
    { alumno1: 'Marcos Díaz', alumno2: 'Silvia Peña', alumno3: 'Fernando Torres' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ternasPerPage = 7;
  const [maxPageButtons] = useState(10);

  const indexOfLastTerna = currentPage * ternasPerPage;
  const indexOfFirstTerna = indexOfLastTerna - ternasPerPage;
  const currentTernas = ternas.slice(indexOfFirstTerna, indexOfLastTerna);

  // Número total de páginas
  const totalPages = Math.ceil(ternas.length / ternasPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generar botones de paginación
  const renderPaginationButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white dark:bg-boxdark text-blue-500 dark:text-white'}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Breadcrumb pageName="Listar Alumnos Asignados" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="hidden sm:block max-w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 dark:bg-meta-4 dark:text-white">
                <th className="py-2 px-4">No. Terna</th>
                <th className="py-2 px-4">Alumno 1</th>
                <th className="py-2 px-4">Alumno 2</th>
                <th className="py-2 px-4">Alumno 3</th>
              </tr>
            </thead>
            <tbody>
              {currentTernas.map((terna, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-strokedark">
                  <td className="py-2 px-4 text-black dark:text-white">{indexOfFirstTerna + index + 1}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{terna.alumno1}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{terna.alumno2}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{terna.alumno3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
            disabled={currentPage === 1}
          >
            &#8592;
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => paginate(currentPage + 1)}
            className="mx-1 px-3 py-1 rounded-md border bg-white dark:bg-boxdark text-blue-500 dark:text-white"
            disabled={currentPage === totalPages}
          >
            &#8594;
          </button>
        </div>
      </div>
    </>
  );
};

export default ListarAlumAsig;
