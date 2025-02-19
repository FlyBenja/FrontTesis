import { useEffect, useState } from 'react';  
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';  
import Swal from 'sweetalert2';

// Importing pages and components for different sections of the app
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

// General Links
import Profile from './pages/Generales/Profile';
import Settings from './pages/Generales/Settings';

// Student Links
import Inicio from './pages/Estudiantes/Inicio';
import Propuesta from './pages/Estudiantes/Propuesta';
import Cursos from './pages/Estudiantes/Cursos';
import InfoCurso from './pages/Estudiantes/InfoCurso';
import InfoCapitulo from './pages/Estudiantes/InfoCapitulo';

// Secretary Links
import CreaSedes from './pages/Secretario/CrearSedes';
import CreaAdmin from './pages/Secretario/CrearAdmin';
import AsignaPG from './pages/Secretario/AsignarPG';

// Cordinador Links
import Grafica from './pages/Cordinador/Graficas';
import SolicitudRevisiones from './pages/Cordinador/SolicitudRevisiones';
import RevisionEstudiante from './pages/Cordinador/RevisionEstudiante';
import Revisores from './pages/Cordinador/Revisores';

function App() {
  // State variable for managing the loading state of the app
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();  // Hook to get the current pathname from the URL
  const navigate = useNavigate();  // Hook for navigation

  // Effect that runs every time the pathname changes, it scrolls the page to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Effect that checks if the localStorage is empty. If so, it shows an alert using SweetAlert2.
  useEffect(() => {
    // Verificar si el localStorage está vacío
    if (localStorage.length === 0) {
      // Mostrar alerta usando SweetAlert2
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Favor de iniciar sesión para continuar.',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'bg-red-600 text-white',  // Custom styling for the button
        },
      }).then(() => {
        navigate('/'); // Redirigir a la página de inicio después de hacer clic en OK
      });
    }
  }, [navigate]);

  // Effect to simulate loading time by setting loading state to false after 1 second
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Return loading state until loading is complete, then display the layout and routes
  return loading ? (
    null
  ) : (
    <DefaultLayout>
      <Routes>
        {/* Routes for the Admin section */}
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
        <Route path="calendar" element={<Calendar />} />
        <Route path="crear-tareas" element={<CrearTareas />} />
        <Route path="enviar-revisión" element={<EnviaRevision />} />

        {/* General Links */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        {/* Routes for the Student section */}
        <Route path="inicio" element={<Inicio />} />
        <Route path="propuesta" element={<Propuesta />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="info-curso" element={<InfoCurso />} />
        <Route path="info-capitulo" element={<InfoCapitulo />} />

        {/* Routes for the Secretary section */}
        <Route path="crea-sedes" element={<CreaSedes />} />
        <Route path="crea-admin" element={<CreaAdmin />} />
        <Route path="asignapg" element={<AsignaPG />} />

        {/* Routes for the Cordinador section */}
        <Route path="grafica" element={<Grafica />} />
        <Route path="solicitud-revisiones" element={<SolicitudRevisiones />} />
        <Route path="revision-estudiante" element={<RevisionEstudiante />} />
        <Route path="revisores" element={<Revisores />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
