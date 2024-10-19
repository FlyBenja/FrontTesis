import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import React, { useState, useEffect } from 'react';
import SwitcherFour from '../../../components/Switchers/SwitcherFour'; // Asegúrate de que esta ruta sea correcta

// Definir el tipo de datos para los catedráticos
interface Catedratico {
  id: number;
  name: string;
  carnet: string;
  profilePicture: string;
  isActive: boolean; // Para manejar el estado del toggle switch
}

// Componente Listar Catedraticos
const ListarCatedraticos: React.FC = () => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const catedraticosPerPage = 7; // Definir cuántos catedráticos mostrar por página
  const [maxPageButtons, setMaxPageButtons] = useState(10); // Estado para manejar cuántos botones de paginación mostrar

  // Escuchar el tamaño de la pantalla y ajustar la cantidad de botones
  const updateMaxButtons = () => {
    if (window.innerWidth < 640) {
      setMaxPageButtons(4); // Mostrar solo 4 botones en pantallas pequeñas
    } else {
      setMaxPageButtons(10); // Mostrar 10 botones en pantallas más grandes
    }
  };

  useEffect(() => {
    updateMaxButtons(); // Establecer el número inicial de botones
    window.addEventListener('resize', updateMaxButtons); // Escuchar cambios en el tamaño de la pantalla

    return () => {
      window.removeEventListener('resize', updateMaxButtons); // Limpiar el listener al desmontar el componente
    };
  }, []);

  // Generar datos de catedráticos con foto, nombre y carnet
  useEffect(() => {
    const generateCatedraticos = (): Catedratico[] => {
      const names = ['Juan Pérez', 'María López', 'Pedro González', 'Ana Méndez', 'Carlos Rivera'];
      const profilePictures = [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/women/1.jpg',
        'https://randomuser.me/api/portraits/men/2.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg',
      ];

      const catedraticosArray: Catedratico[] = [];
      for (let i = 1; i <= 50; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomPicture = profilePictures[Math.floor(Math.random() * profilePictures.length)];
        const carnet = `${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`; // Generar carnet

        catedraticosArray.push({
          id: i,
          name: randomName,
          carnet,
          profilePicture: randomPicture,
          isActive: Math.random() < 0.5, // Aleatoriamente activo o inactivo
        });
      }
      return catedraticosArray;
    };

    const catedraticosData = generateCatedraticos();
    setCatedraticos(catedraticosData);
  }, []);

  // Función para manejar el estado del toggle switch
  const handleToggleSwitch = (id: number) => {
    setCatedraticos((prevCatedraticos) =>
      prevCatedraticos.map((catedratico) =>
        catedratico.id === id ? { ...catedratico, isActive: !catedratico.isActive } : catedratico
      )
    );
  };

  // Calcular los catedráticos para la página actual
  const indexOfLastCatedratico = currentPage * catedraticosPerPage;
  const indexOfFirstCatedratico = indexOfLastCatedratico - catedraticosPerPage;
  const currentCatedraticos = catedraticos.slice(indexOfFirstCatedratico, indexOfLastCatedratico);

  // Número total de páginas
  const totalPages = Math.ceil(catedraticos.length / catedraticosPerPage);

  // Función para cambiar de página
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
      <Breadcrumb pageName="Lista de Catedráticos" /> {/* Añadido el Breadcrumb */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

        {/* Modo teléfono: mostrar como cards */}
        <div className="block sm:hidden">
          {currentCatedraticos.map((catedratico) => (
            <div key={catedratico.id} className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg dark:bg-boxdark dark:border-strokedark">
              <div className="flex items-center">
                <img src={catedratico.profilePicture} alt={catedratico.name} className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <p className="text-lg font-bold text-black dark:text-white">{catedratico.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{catedratico.carnet}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <SwitcherFour
                  enabled={catedratico.isActive}
                  onChange={() => handleToggleSwitch(catedratico.id)}
                  uniqueId={String(catedratico.id)}
                />
                <button
                  onClick={() => setCatedraticos((prev) => prev.filter((item) => item.id !== catedratico.id))}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modo escritorio: mostrar como tabla */}
        <div className="hidden sm:block max-w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 dark:bg-meta-4 dark:text-white">
                <th className="py-2 px-4">Foto</th>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Carnet</th>
                <th className="py-2 px-4">Activo</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCatedraticos.map((catedratico) => (
                <tr key={catedratico.id} className="border-t border-gray-200 dark:border-strokedark">
                  <td className="py-2 px-4 text-black dark:text-white">
                    <img src={catedratico.profilePicture} alt={catedratico.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">{catedratico.name}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{catedratico.carnet}</td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    <SwitcherFour
                      enabled={catedratico.isActive}
                      onChange={() => handleToggleSwitch(catedratico.id)}
                      uniqueId={String(catedratico.id)} // Pasamos un uniqueId basado en el id del catedrático
                    />
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    <button
                      onClick={() => setCatedraticos((prev) => prev.filter((item) => item.id !== catedratico.id))}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
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

export default ListarCatedraticos;
