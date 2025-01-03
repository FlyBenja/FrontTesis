import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

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

//Links Generales
import Profile from './pages/Generales/Profile';
import Settings from './pages/Generales/Settings';

//Links de Estudiante
import Inicio from './pages/Estudiantes/Inicio';
import Propuesta from './pages/Estudiantes/Propuesta';
import Cursos from './pages/Estudiantes/Cursos';
import InfoCurso from './pages/Estudiantes/InfoCurso';
import InfoCapitulo from './pages/Estudiantes/InfoCapitulo';

//Links de Secretario
import CreaSedes from './pages/Secretario/CrearSedes';
import CreaAdmin from './pages/Secretario/CrearAdmin';
import AsignaPG from './pages/Secretario/AsignarPG';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
          confirmButton: 'bg-red-600 text-white',
        },
      }).then(() => {
        navigate('/'); // Redirigir a la página de inicio después de hacer clic en OK
      });
    }
  }, [navigate]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    null
  ) : (
    <DefaultLayout>
      <Routes>
        {/* Links para administrador */}
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

        {/* Links Generales */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        {/* Links para Estudiantes */}
        <Route path="inicio" element={<Inicio />} />
        <Route path="propuesta" element={<Propuesta />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="info-curso" element={<InfoCurso />} />
        <Route path="info-capitulo" element={<InfoCapitulo />} />

        {/* Links para Secretario */}
        <Route path="crea-sedes" element={<CreaSedes />} />
        <Route path="crea-admin" element={<CreaAdmin />} />
        <Route path="asignapg" element={<AsignaPG />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
