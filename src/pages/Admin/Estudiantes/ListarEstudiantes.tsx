import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Estudiante {
  id: number;
  nombre: string;
  carnet: string;
  curso: string;
  año: number;
  fotoPerfil: string;
}

const ListarEstudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([]);
  const [searchCarnet, setSearchCarnet] = useState('');
  const [selectedAño, setSelectedAño] = useState<string>('');
  const [selectedCurso, setSelectedCurso] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const estudiantesPerPage = 5;
  const [maxPageButtons] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const datosEstudiantes: Estudiante[] = [
      { id: 1, nombre: 'Luis Alvarado', carnet: '1234-12-1234', curso: 'Matemáticas', año: 2023, fotoPerfil: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: 2, nombre: 'María García', carnet: '2345-12-2345', curso: 'Ciencias', año: 2022, fotoPerfil: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { id: 3, nombre: 'Carlos Sánchez', carnet: '3456-12-3456', curso: 'Historia', año: 2021, fotoPerfil: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { id: 4, nombre: 'Ana López', carnet: '4567-12-4567', curso: 'Matemáticas', año: 2023, fotoPerfil: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 5, nombre: 'Pedro Gómez', carnet: '5678-12-5678', curso: 'Historia', año: 2022, fotoPerfil: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 6, nombre: 'Claudia Hernández', carnet: '6789-12-6789', curso: 'Ciencias', año: 2021, fotoPerfil: 'https://randomuser.me/api/portraits/women/3.jpg' },
    ];
    setEstudiantes(datosEstudiantes);
    setFilteredEstudiantes(datosEstudiantes);
  }, []);

  const handleSearchCarnet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCarnet(e.target.value);
  };

  const handleAñoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAño(e.target.value);
  };

  const handleCursoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
  };

  useEffect(() => {
    let estudiantesFiltrados = estudiantes;

    if (searchCarnet) {
      estudiantesFiltrados = estudiantesFiltrados.filter(est =>
        est.carnet.toLowerCase().includes(searchCarnet.toLowerCase())
      );
    }

    if (selectedAño) {
      estudiantesFiltrados = estudiantesFiltrados.filter(est => est.año === parseInt(selectedAño));
    }

    if (selectedCurso) {
      estudiantesFiltrados = estudiantesFiltrados.filter(est => est.curso === selectedCurso);
    }

    setFilteredEstudiantes(estudiantesFiltrados);
  }, [searchCarnet, selectedAño, selectedCurso, estudiantes]);

  const indexOfLastEstudiante = currentPage * estudiantesPerPage;
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage;
  const currentEstudiantes = filteredEstudiantes.slice(indexOfFirstEstudiante, indexOfLastEstudiante);

  const totalPages = Math.ceil(filteredEstudiantes.length / estudiantesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const handleStudentClick = (estudiante: Estudiante) => {
    navigate(`/admin/time-line`, { state: { estudiante } });
  };

  return (
    <>
      <Breadcrumb pageName="Listar Estudiantes" />
      <div className="mx-auto max-w-5xl px-1 py-1">

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por carnet"
            value={searchCarnet}
            onChange={handleSearchCarnet}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          />
        </div>

        <div className="mb-4 flex gap-4">
          <select
            value={selectedAño}
            onChange={handleAñoChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar año</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>

          <select
            value={selectedCurso}
            onChange={handleCursoChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar curso</option>
            <option value="Matemáticas">Matemáticas</option>
            <option value="Ciencias">Ciencias</option>
            <option value="Historia">Historia</option>
          </select>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 dark:bg-meta-4 dark:text-white">
                <th className="py-2 px-4 text-center">Foto</th>
                <th className="py-2 px-4 text-center">Nombre</th>
                <th className="py-2 px-4 text-center">Carnet</th>
              </tr>
            </thead>
            <tbody>
              {currentEstudiantes.length > 0 ? (
                currentEstudiantes.map(estudiante => (
                  <tr
                    key={estudiante.id}
                    className="border-t border-gray-200 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 relative group"
                    onClick={() => handleStudentClick(estudiante)}
                  >
                    <td className="py-2 px-4 text-center">
                      <img src={estudiante.fotoPerfil} alt={estudiante.nombre} className="w-10 h-10 rounded-full mx-auto" />
                    </td>
                    <td className="py-2 px-4 text-center relative group">
                      {estudiante.nombre}
                      <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-lg px-1 py-1 -top-10 left-[60%] transform -translate-x-1/2 w-40 dark:bg-white dark:text-gray-800">
                        Ir Hacia TimeLine Estudiante
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">{estudiante.carnet}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

export default ListarEstudiantes;
