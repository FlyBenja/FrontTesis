import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Calendar from './pages/Generales/Calendar';
import CrearTareas from './pages/Admin/CrearTareas';
import Graficas from './pages/Admin/Inicio/Graficas';
import DefaultLayout from './layout/DefaultLayout';
import Bitacora from './pages/Admin/Inicio/Bitacora';
import SubirEstudiantes from './pages/Admin/Estudiantes/SubirEstudiantes';
import ListarEstudiantes from './pages/Admin/Estudiantes/ListarEstudiantes';
import TimeLineAdmin from './pages/Admin/Estudiantes/TimeLine';
import TareasEstudiante from './pages/Admin/Estudiantes/TareasEstudiante';
import Propuestas from './pages/Admin/Estudiantes/Propuestas';
import Capitulos from './pages/Admin/Estudiantes/Capitulos';
import SubirCatedraticos from './pages/Admin/Catedraticos/SubirCatedraticos';
import ListarCatedraticos from './pages/Admin/Catedraticos/ListarCatedraticos';
import CrearCatedraticos from './pages/Admin/Catedraticos/CrearCatedraticos';
import CrearComisiones from './pages/Admin/Comisiones/CrearComision';
import ListarComision from './pages/Admin/Comisiones/ListarComision';
import EnviaRevision from './pages/Admin/EnviaRevision';

import Profile from './pages/Generales/Profile';
import Settings from './pages/Generales/Settings';

import Inicio from './pages/Estudiantes/Inicio';
import Propuesta from './pages/Estudiantes/Propuesta';
import Cursos from './pages/Estudiantes/Cursos';
import InfoCurso from './pages/Estudiantes/InfoCurso';
import InfoCapitulo from './pages/Estudiantes/InfoCapitulo';

import CreaSedes from './pages/Secretario/CrearSedes';
import CreaAdmin from './pages/Secretario/CrearAdmin';
import AsignaPG from './pages/Secretario/AsignarPG';

import Grafica from './pages/Cordinador/Graficas';
import MisAsignaciones from './pages/Cordinador/MisAsignaciones';
import MisAsignacionesDetalle from './pages/Cordinador/RevisionEstudianteComentarios';
import SolicitudRevisiones from './pages/Cordinador/SolicitudRevisiones';
import RevisionEstudiante from './pages/Cordinador/RevisionEstudiante';
import Revisores from './pages/Cordinador/Revisores';
import Asignaciones from './pages/Cordinador/Asignaciones';
import AsignacionesDetalle from './pages/Cordinador/RevisionEstudianteComentarios';
import Historial from './pages/Cordinador/Historial';
import HistorialDetalle from './pages/Cordinador/RevisionEstudianteComentarios';

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
            <Route path="graficas" element={<Graficas />} />
            <Route path="bitacora" element={<Bitacora />} />
            <Route path="subir-estudiantes" element={<SubirEstudiantes />} />
            <Route path="listado-estudiantes" element={<ListarEstudiantes />} />
            <Route path="time-line" element={<TimeLineAdmin />} />
            <Route path="tareas-estudiante" element={<TareasEstudiante />} />
            <Route path="propuestas" element={<Propuestas />} />
            <Route path="capitulo" element={<Capitulos />} />
            <Route path="subir-catedraticos" element={<SubirCatedraticos />} />
            <Route path="listado-catedraticos" element={<ListarCatedraticos />} />
            <Route path="crear-catedraticos" element={<CrearCatedraticos />} />
            <Route path="crear-comision" element={<CrearComisiones />} />
            <Route path="listado-comision" element={<ListarComision />} />
            <Route path="crear-tareas" element={<CrearTareas />} />
            <Route path="enviar-revisión" element={<EnviaRevision />} />
          </>
        )}

        {role === 4 && (  // Secretario
          <>
            <Route path="crea-sedes" element={<CreaSedes />} />
            <Route path="crea-admin" element={<CreaAdmin />} />
            <Route path="asignapg" element={<AsignaPG />} />
          </>
        )}

        {role === 5 && (  // Decano
          <>
            <Route path="grafica" element={<Grafica />} />
            <Route path="mis-asignaciones" element={<MisAsignaciones />} />
            <Route path="mis-asignaciones/detalle" element={<MisAsignacionesDetalle />} />
            <Route path="solicitud-revisiones" element={<SolicitudRevisiones />} />
          </>
        )}

        {role === 6 && (  // Cordinador de tesis
          <>
            <Route path="graficas" element={<Grafica />} />
            <Route path="mis-asignaciones" element={<MisAsignaciones />} />
            <Route path="mis-asignaciones/detalle" element={<MisAsignacionesDetalle />} />
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
            <Route path="revision-estudiante" element={<RevisionEstudiante />} />
          </>
        )}

        {/* General Links */}
        <Route path="perfil" element={<Profile />} />
        <Route path="configuracion" element={<Settings />} />
        <Route path="calendario" element={<Calendar />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
