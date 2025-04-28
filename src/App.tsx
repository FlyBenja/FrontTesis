import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Administrador
import CrearTareas from './pages/Administrador/CrearTareas';
import SubirEstudiantes from './pages/Administrador/Estudiantes/SubirEstudiantes';
import ListarEstudiantes from './pages/Administrador/Estudiantes/ListarEstudiantes';
import TimeLineAdmin from './pages/Administrador/Estudiantes/TimeLine';
import TareasEstudiante from './pages/Administrador/Estudiantes/TareasEstudiante';
import Propuestas from './pages/Administrador/Estudiantes/Propuestas';
import Capitulos from './pages/Administrador/Estudiantes/Capitulos';
import EnviaRevision from './pages/Administrador/EnviaRevision';

// CoordinadorGeneral
import CrearSede from './pages/CoordinadorGeneral/CrearSedes';
import CrearCoordinador from './pages/CoordinadorGeneral/CrearCoordinador';
import CrearTareasCor from './pages/CoordinadorGeneral/CrearTareas';
import ListarEstudiantesCor from './pages/CoordinadorGeneral/Estudiantes/ListarEstudiantes';
import TimeLineAdminCor from './pages/CoordinadorGeneral/Estudiantes/TimeLine';
import TareasEstudianteCor from './pages/CoordinadorGeneral/Estudiantes/TareasEstudiante';
import PropuestasCor from './pages/CoordinadorGeneral/Estudiantes/Propuestas';
import CapitulosCor from './pages/CoordinadorGeneral/Estudiantes/Capitulos';

// Generales
import Graficas from './pages/Administrador/Inicio/Graficas';
import Bitacora from './pages/Administrador/Inicio/Bitacora';
import Profile from './pages/Generales/Profile';
import Settings from './pages/Generales/Contraseña';
import Calendar from './pages/Generales/Calendar';
import DefaultLayout from './layout/DefaultLayout';

// Estudiantes
import Inicio from './pages/Estudiantes/Inicio';
import Propuesta from './pages/Estudiantes/Propuesta';
import Cursos from './pages/Estudiantes/Cursos';
import InfoCurso from './pages/Estudiantes/InfoCurso';
import InfoCapitulo from './pages/Estudiantes/InfoCapitulo';

// CoordinadorSede
import SubirCatedraticos from './pages/CoordinadorSede/Catedraticos/SubirCatedraticos';
import ListarCatedraticos from './pages/CoordinadorSede/Catedraticos/ListarCatedraticos';
import CrearCatedraticos from './pages/CoordinadorSede/Catedraticos/CrearCatedraticos';
import CrearComisiones from './pages/CoordinadorSede/Comisiones/CrearComision';
import ListarComision from './pages/CoordinadorSede/Comisiones/ListarComision';
import CreaAdmin from './pages/CoordinadorSede/CrearAdmin';
import AsignaPG from './pages/CoordinadorSede/AsignarPG';

// CoordinadorTesis
import Grafica from './pages/CoordinadorTesis/Graficas';
import MisAsignaciones from './pages/CoordinadorTesis/MisAsignaciones';
import MisAsignacionesDetalle from './pages/Generales/RevisionEstudianteGetComentarios';
import MisAsignacionesDetalleComentarios from './pages/Generales/RevisionEstudianteCreaComentarios';
import SolicitudRevisiones from './pages/CoordinadorTesis/SolicitudRevisiones';
import RevisionEstudiante from './pages/CoordinadorTesis/RevisionEstudiante';
import Revisores from './pages/CoordinadorTesis/Revisores';
import Asignaciones from './pages/CoordinadorTesis/Asignaciones';
import AsignacionesDetalle from './pages/Generales/RevisionEstudianteGetComentarios';
import Historial from './pages/CoordinadorTesis/Historial';
import HistorialDetalle from './pages/Generales/RevisionEstudianteGetComentarios';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<number | null>(null); // Estado para guardar el rol
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Verificar si el localStorage está vacío
    if (localStorage.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Favor de iniciar sesión para continuar.',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'bg-red-600 text-white',
        },
      }).then(() => {
        navigate('/');
      });
    } else {
      // Asignar el rol desde el localStorage o estado global
      const storedRole = localStorage.getItem('userRole');
      setRole(storedRole ? parseInt(storedRole) : null);
    }
  }, [navigate]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return null;

  return (
    <DefaultLayout>
      <Routes>
        {role === 1 && (  // Estudiante
          <>
            <Route path="time-line" element={<Inicio />} />
            <Route path="propuestas" element={<Propuesta />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="info-curso" element={<InfoCurso />} />
            <Route path="info-capitulo" element={<InfoCapitulo />} />
          </>
        )}

        {role === 2 && (  // Catedrático
          <>
            <Route path="propuestas" element={<Propuestas />} />
            <Route path="capitulo" element={<Capitulos />} />
          </>
        )}

        {role === 3 && (  // Administrador
          <>
            <Route path="subir-estudiantes" element={<SubirEstudiantes />} />
            <Route path="listado-estudiantes" element={<ListarEstudiantes />} />
            <Route path="time-line" element={<TimeLineAdmin />} />
            <Route path="tareas-estudiante" element={<TareasEstudiante />} />
            <Route path="propuestas" element={<Propuestas />} />
            <Route path="capitulo" element={<Capitulos />} />
            <Route path="crear-tareas" element={<CrearTareas />} />
            <Route path="enviar-revisión" element={<EnviaRevision />} />
          </>
        )}

        {role === 4 && (  // CoordinadorSede
          <>
            <Route path="subir-catedraticos" element={<SubirCatedraticos />} />
            <Route path="listado-catedraticos" element={<ListarCatedraticos />} />
            <Route path="crear-catedraticos" element={<CrearCatedraticos />} />
            <Route path="crear-comision" element={<CrearComisiones />} />
            <Route path="listado-comision" element={<ListarComision />} />
            <Route path="crea-admin" element={<CreaAdmin />} />
            <Route path="asignapg" element={<AsignaPG />} />
          </>
        )}

        {role === 5 && (  // CoordinadorGeneral
          <>
            <Route path="crear-sedes" element={<CrearSede />} />
            <Route path="crear-coordinador" element={<CrearCoordinador />} />
            <Route path="listado-estudiantes" element={<ListarEstudiantesCor />} />
            <Route path="time-line" element={<TimeLineAdminCor />} />
            <Route path="tareas-estudiante" element={<TareasEstudianteCor />} />
            <Route path="propuestas" element={<PropuestasCor />} />
            <Route path="capitulo" element={<CapitulosCor />} />
            <Route path="crear-tareas" element={<CrearTareasCor  />} />
            <Route path="historial" element={<Historial />} />
          </>
        )}

        {role === 6 && (  // CoordinadorTesis
          <>
            <Route path="graficas" element={<Grafica />} />
            <Route path="mis-asignaciones" element={<MisAsignaciones />} />
            <Route path="mis-asignaciones/detalle" element={<MisAsignacionesDetalle />} />
            <Route path="mis-asignaciones/detalle-comentario" element={<MisAsignacionesDetalleComentarios />} />
            <Route path="solicitud-revisiones" element={<SolicitudRevisiones />} />
            <Route path="revision-estudiante" element={<RevisionEstudiante />} />
            <Route path="revisores" element={<Revisores />} />
            <Route path="asignaciones" element={<Asignaciones />} />
            <Route path="asignaciones/detalle" element={<AsignacionesDetalle />} />
            <Route path="historial" element={<Historial />} />
            <Route path="historial/detalle" element={<HistorialDetalle />} />
          </>
        )}

        {role === 7 && (  // Revisor
          <>
            <Route path="mis-asignaciones" element={<MisAsignaciones />} />
            <Route path="mis-asignaciones/detalle" element={<MisAsignacionesDetalle />} />
            <Route path="mis-asignaciones/detalle-comentario" element={<MisAsignacionesDetalleComentarios />} />
            <Route path="historial" element={<Historial />} />
            <Route path="historial/detalle" element={<HistorialDetalle />} />
          </>
        )}

        {/* General Links */}
        <Route path="graficas" element={<Graficas />} />
        <Route path="bitacora" element={<Bitacora />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="contraseña" element={<Settings />} />
        <Route path="calendario" element={<Calendar />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
