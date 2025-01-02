import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getYears } from '../../../ts/Generales/GetYears';
import { getEstudiantes } from '../../../ts/Admin/GetEstudiantes';
import { getCursos } from '../../../ts/Generales/GetCursos';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { getEstudiantePorCarnet } from '../../../ts/Admin/GetEstudianteCarnet';
import generaPDFGeneral from '../../../components/Pdfs/generaPDFGeneral';

interface Estudiante {
  id: number;
  userName: string;
  carnet: string;
  curso: string;
  año: number;
  fotoPerfil: string;
}

interface Curso {
  course_id: number;
  courseName: string;
}

const ListarEstudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedAño, setSelectedAño] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<string>('');
  const [searchCarnet, setSearchCarnet] = useState<string>('');
  const [estudiantesPerPage, setEstudiantesPerPage] = useState(4);
  const [maxPageButtons, setMaxPageButtons] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const perfil = await getDatosPerfil();
      const yearsRecuperados = await getYears();
      setYears(yearsRecuperados.map((yearObj) => yearObj.year));

      const currentYear = new Date().getFullYear().toString();
      if (yearsRecuperados.map((yearObj) => yearObj.year.toString()).includes(currentYear)) {
        setSelectedAño(currentYear);
      }

      const currentMonth = new Date().getMonth();
      const initialCourseId = currentMonth >= 6 ? '2' : '1';
      setSelectedCurso(initialCourseId);

      if (perfil.sede && currentYear) {
        fetchEstudiantes(perfil.sede, initialCourseId, currentYear);
        fetchCursos(perfil.sede);
      }
    };

    fetchInitialData();
  }, []);

  const fetchEstudiantes = async (sedeId: number, courseId: string, nameYear: string) => {
    try {
      const estudiantesRecuperados = await getEstudiantes(sedeId, parseInt(courseId), parseInt(nameYear));
      setEstudiantes(Array.isArray(estudiantesRecuperados) ? estudiantesRecuperados : []);
    } catch {
      setEstudiantes([]);
    }
  };

  const fetchCursos = async (sedeId: number) => {
    try {
      const cursosRecuperados = await getCursos(sedeId);
      setCursos(Array.isArray(cursosRecuperados) ? cursosRecuperados : []);
    } catch {
      setCursos([]);
    }
  };

  const handleAñoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const añoSeleccionado = e.target.value;
    setSelectedAño(añoSeleccionado);
    const perfil = await getDatosPerfil();
    if (perfil.sede && añoSeleccionado && selectedCurso) {
      fetchEstudiantes(perfil.sede, selectedCurso, añoSeleccionado);
    }
  };

  const handleCursoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurso(e.target.value);
    const perfil = await getDatosPerfil();
    if (perfil.sede && selectedAño && e.target.value) {
      fetchEstudiantes(perfil.sede, e.target.value, selectedAño);
    }
  };

  const handleStudentClick = (estudiante: Estudiante) => {
    navigate(`/admin/time-line`, {
      state: {
        estudiante,
        selectedAño,
        selectedCurso,
      },
    });
  };

  const handlePrintPDF = (selectedAño: number, selectedCurso: number) => {
    generaPDFGeneral(selectedAño, selectedCurso);
  };

  const handleSearchClick = async () => {
    setEstudiantes([]);
    if (!searchCarnet) {
      const perfil = await getDatosPerfil();
      if (perfil.sede && selectedCurso && selectedAño) {
        fetchEstudiantes(perfil.sede, selectedCurso, selectedAño);
      }
      return;
    }
    try {
      const perfil = await getDatosPerfil();
      const estudianteEncontrado = await getEstudiantePorCarnet(perfil.sede, parseInt(selectedAño), searchCarnet);
      setEstudiantes(estudianteEncontrado ? [estudianteEncontrado] : []);
    } catch (error) {
      console.error('Error al buscar el estudiante:', error);
    }
  };

  const indexOfLastEstudiante = currentPage * estudiantesPerPage;
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage;
  const currentEstudiantes = estudiantes.slice(indexOfFirstEstudiante, indexOfLastEstudiante);
  const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageRange = () => {
    const range: number[] = [];
    const totalPages = Math.ceil(estudiantes.length / estudiantesPerPage);
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const renderProfilePhoto = (profilePhoto: string, userName: string) => {
    if (profilePhoto) {
      return <img src={profilePhoto} alt={userName} className="w-10 h-10 rounded-full mx-auto" />;
    } else {
      const initial = userName.charAt(0).toUpperCase();
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
          {initial}
        </div>
      );
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEstudiantesPerPage(8);
        setMaxPageButtons(5);
      } else {
        setEstudiantesPerPage(4);
        setMaxPageButtons(10);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Breadcrumb pageName="Listar Estudiantes" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex flex-wrap items-center justify-between space-x-2">
          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por Carnet de Estudiante"
              value={searchCarnet}
              onChange={(e) => setSearchCarnet(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
              onClick={handleSearchClick}
            >
              Buscar
            </button>
          </div>
          <div className="flex">
            <button
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
              onClick={() => handlePrintPDF(Number(selectedAño), Number(selectedCurso))}
            >
              Imprimir PDF
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select
            value={selectedAño}
            onChange={handleAñoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedCurso}
            onChange={handleCursoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.course_id} value={curso.course_id.toString()}>
                {curso.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">Foto</th>
                <th className="py-2 px-4 text-center">Nombre Estudiante</th>
                <th className="py-2 px-4 text-center">Carnet</th>
              </tr>
            </thead>
            <tbody>
              {currentEstudiantes.length > 0 ? (
                currentEstudiantes.map((est) => (
                  <tr
                    key={est.id}
                    onClick={() => handleStudentClick(est)}
                    className="border-t border-gray-200 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 relative group"
                  >
                    <td className="py-2 px-4 text-center">
                      {renderProfilePhoto(est.fotoPerfil, est.userName)}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white relative group">
                      {est.userName}
                      <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-lg px-1 py-1 -top-10 left-[60%] transform -translate-x-1/2 w-40 dark:bg-white dark:text-gray-800">
                        Ir Hacia TimeLine Estudiante
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{est.carnet}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                    No Se Encontrarón Estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592;
          </button>
          {getPageRange().map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`mx-1 px-3 py-1 rounded-md border ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white'
                }`}
            >
              {page}
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

export default ListarEstudiantes;
