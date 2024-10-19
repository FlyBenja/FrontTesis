import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Calendar from './pages/Admin/Calendar';
import CrearTareas from './pages/Admin/CrearTareas';
import Graficas from './pages/Admin/Inicio/Graficas';
import Profile from './pages/Admin/DatosPerfil/Profile';
import Settings from './pages/Admin/DatosPerfil/Settings';
import DefaultLayout from './layout/DefaultLayout';
import Bitacora from './pages/Admin/Inicio/Bitacora';
import SubirEstudiantes from './pages/Admin/Estudiantes/SubirEstudiantes';
import ListarEstudiantes from './pages/Admin/Estudiantes/ListarEstudiantes';
import TimeLine from './pages/Admin/Estudiantes/TimeLine';
import TareasEstudiante from './pages/Admin/Estudiantes/TareasEstudiante';
import Propuestas from './pages/Admin/Estudiantes/Propuestas';
import Capitulos from './pages/Admin/Estudiantes/Capitulos';
import SubirCatedraticos from './pages/Admin/Catedraticos/SubirCatedraticos';
import ListarCatedraticos from './pages/Admin/Catedraticos/ListarCatedraticos';
import CrearCatedraticos from './pages/Admin/Catedraticos/CrearCatedraticos';
import CrearTernas from './pages/Admin/Ternas/CrearTernas';
import AsignarTernas from './pages/Admin/AsignarTernas';
import ListarTernas from './pages/Admin/Ternas/ListarTernas';
import ListarAlumAsig from './pages/Admin/Ternas/ListarAlumAsig';
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
        <Route index element={<Graficas />} />
        <Route path="Bitacora" element={<Bitacora />} />
        <Route path="subir-estudiantes" element={<SubirEstudiantes />} />
        <Route path="listado-estudiantes" element={<ListarEstudiantes />} />
        <Route path="time-line" element={<TimeLine />} />
        <Route path="tareas-estudiante" element={<TareasEstudiante />} />
        <Route path="propuestas" element={<Propuestas />} />
        <Route path="capitulo" element={<Capitulos />} />
        <Route path="subir-catedraticos" element={<SubirCatedraticos />} />
        <Route path="listado-catedraticos" element={<ListarCatedraticos />} />
        <Route path="crear-catedraticos" element={<CrearCatedraticos />} />
        <Route path="crear-ternas" element={<CrearTernas />} />
        <Route path="asignar-ternas" element={<AsignarTernas />} />
        <Route path="listado-ternas" element={<ListarTernas />} />
        <Route path="listado-alumno-terna" element={<ListarAlumAsig />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="crear-tareas" element={<CrearTareas />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
