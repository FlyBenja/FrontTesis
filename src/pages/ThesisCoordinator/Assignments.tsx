import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRevisionesEnRevision } from "../../ts/ThesisCoordinatorandReviewer/GetReviewsInReview";
import { getDatosPerfil, PerfilData } from "../../ts/General/GetProfileData";
import type React from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Asignaciones: React.FC = () => {
  const navigate = useNavigate();

  const [revisiones, setRevisiones] = useState<any[]>([]);
  const [searchCarnet, setSearchCarnet] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filteredRevisiones, setFilteredRevisiones] = useState(revisiones);
  const [isCarnetSearch, setIsCarnetSearch] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [revisionesPerPage, setRevisionesPerPage] = useState(5);
  const [maxPageButtons, setMaxPageButtons] = useState(10);

  // Obtener el perfil del usuario
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfil: PerfilData = await getDatosPerfil();
        setUserId(perfil.user_id);
      } catch (error) {
        console.error("Error al obtener los datos del perfil", error);
      }
    };
    fetchPerfil();
  }, []);

  // Obtener las revisiones desde la API
  const fetchRevisiones = useCallback(async (order: 'asc' | 'desc', carnet: string) => {
    try {
      const revisiones = await getRevisionesEnRevision(order, carnet);
      if (userId) {
        const revisionesFiltradas = revisiones.filter(revision =>
          !revision.assignedReviews.some(assignedReview => assignedReview.user_id === userId)
        );
        setRevisiones(revisionesFiltradas);
        setFilteredRevisiones(revisionesFiltradas);
      }
      setIsCarnetSearch(carnet.length >= 10);
    } catch (error) {
      console.error(error);
      setRevisiones([]);
      setFilteredRevisiones([]);
      setIsCarnetSearch(carnet.length >= 10);
    }
  }, [userId]);

  // Efecto para cargar las revisiones cuando cambia el carnet o el orden
  useEffect(() => {
    const carnetValue = searchCarnet.length >= 10 ? searchCarnet : '';
    fetchRevisiones(order, carnetValue);
  }, [order, searchCarnet, fetchRevisiones]);

  // Paginación
  const indexOfLastRevision = currentPage * revisionesPerPage;
  const indexOfFirstRevision = indexOfLastRevision - revisionesPerPage;
  const currentRevisiones = filteredRevisiones.slice(indexOfFirstRevision, indexOfLastRevision);

  const totalPages = Math.ceil(filteredRevisiones.length / revisionesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Cambiar el orden de las revisiones
  const handleChangeOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Formatear la fecha
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleVerDetalle = (userId: number) => {
    navigate(`/coordinadortesis/asignaciones/detalle`, { state: { userId } });
  };

  const handleChangeSearchCarnet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCarnet(e.target.value);
  };

  // Ajustar la configuración de la página en función del tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRevisionesPerPage(8);
        setMaxPageButtons(5);
      } else {
        setRevisionesPerPage(5);
        setMaxPageButtons(10);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Breadcrumb pageName="Revisiones en revisión" />
      <div className="mx-auto max-w-5xl px-1 py-1">
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar por Carnet"
            value={searchCarnet}
            onChange={handleChangeSearchCarnet}
            className="w-72 px-4 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
          />
          <button onClick={handleChangeOrder} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Cambiar Orden ({order === "asc" ? "Ascendente" : "Descendente"})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg dark:bg-boxdark dark:border-strokedark">
            <thead className="bg-gray-100 text-sm dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="py-2 px-4 text-left">No.</th>
                <th className="py-2 px-4 text-center">Nombre</th>
                {/* Estas columnas se ocultan en pantallas pequeñas */}
                <th className="py-2 px-4 text-center hidden md:table-cell">Carnet</th>
                <th className="py-2 px-4 text-center hidden md:table-cell">Fec. Solicitud</th>
                <th className="py-2 px-4 text-center hidden md:table-cell">Estado</th>
                <th className="py-2 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentRevisiones.length > 0 ? (
                currentRevisiones.map((revision) => (
                  <tr key={revision.revision_thesis_id} className="border-t border-gray-200 dark:border-strokedark">
                    <td className="py-2 px-4 text-center text-black dark:text-white">{revision.revision_thesis_id}</td>
                    <td className="py-2 px-4 text-center text-black dark:text-white">{revision.user.name}</td>
                    {/* Estas columnas se ocultan en pantallas pequeñas */}
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden md:table-cell">
                      {revision.user.carnet}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white hidden md:table-cell">
                      {formatDate(revision.date_revision)}
                    </td>
                    <td className="py-2 px-4 text-center text-black dark:text-white bg-yellow-300 dark:bg-yellow-500 font-semibold hidden md:table-cell">
                      {revision.approvalThesis.status}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => handleVerDetalle(revision.user.user_id)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    {isCarnetSearch && searchCarnet.length >= 10
                      ? "No existe carnet del Estudiante"
                      : "No hay solicitudes de revisión"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
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
              className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
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

export default Asignaciones;
