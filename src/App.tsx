import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Calendar from './pages/Admin/Calendar';

import CrearTareas from './pages/Admin/CrearTareas';
import Graficas from './pages/Admin/Inicio/Graficas';
import Profile from './pages/DatosPerfil/Profile';
import Settings from './pages/DatosPerfil/Settings';
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
import CrearComisiones from './pages/Admin/Ternas/CrearComision';
import ListarComision from './pages/Admin/Ternas/ListarComision';

//Links de Estudiante
import Inicio from './pages/Estudiantes/Inicio';
import Propuesta from './pages/Estudiantes/Propuesta';
import Cursos from './pages/Estudiantes/Cursos';
import InfoCurso from './pages/Estudiantes/InfoCurso';
import InfoCapitulo from './pages/Estudiantes/InfoCapitulo';

//Links de Secretario
import CreaSedes from './pages/Secretario/CreasSedes';
import CreaAdmin from './pages/Secretario/CrearAdmin';
import AsignaPG from './pages/Secretario/AsignarPG';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    null
  ) : (
    <DefaultLayout>
      <Routes>
        //Links para administrador
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

        //Links Generales
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        //Links para Estudiantes
        <Route path="inicio" element={<Inicio />} />
        <Route path="propuesta" element={<Propuesta />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="info-curso" element={<InfoCurso />} />
        <Route path="info-capitulo" element={<InfoCapitulo />} />

        //Links para Secretario
        <Route path="crea-sedes" element={<CreaSedes />} />
        <Route path="crea-admin" element={<CreaAdmin />} />
        <Route path="asignapg" element={<AsignaPG />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
