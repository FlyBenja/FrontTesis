import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import Calendar from './pages/Calendar';
import CrearTareas from './pages/CrearTareas';
import Graficas from './pages/Inicio/Graficas';
import Profile from './pages/DatosPerfil/Profile';
import Settings from './pages/DatosPerfil/Settings';
import DefaultLayout from './layout/DefaultLayout';
import Bitacora from './pages/Inicio/Bitacora';
import SubirEstudiantes from './pages/Estudiantes/SubirEstudiantes';
import ListarEstudiantes from './pages/Estudiantes/ListarEstudiantes';
import TimeLine from './pages/Estudiantes/TimeLine';
import TareasEstudiante from './pages/Estudiantes/TareasEstudiante';
import SubirCatedraticos from './pages/Catedraticos/SubirCatedraticos';
import ListarCatedraticos from './pages/Catedraticos/ListarCatedraticos';
import CrearCatedraticos from './pages/Catedraticos/CrearCatedraticos';
import CrearTernas from './pages/Ternas/CrearTernas';
import ListarTernas from './pages/Ternas/ListarTernas';

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
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route index element={<Graficas />} />
        <Route path="Bitacora" element={<Bitacora />} />
        <Route path="subir-estudiantes" element={<SubirEstudiantes />} />
        <Route path="listado-estudiantes" element={<ListarEstudiantes />} />
        <Route path="time-line" element={<TimeLine />} />
        <Route path="tareas-estudiante" element={<TareasEstudiante />} />
        <Route path="subir-catedraticos" element={<SubirCatedraticos />} />
        <Route path="listado-catedraticos" element={<ListarCatedraticos />} />
        <Route path="crear-catedraticos" element={<CrearCatedraticos />} />
        <Route path="crear-ternas" element={<CrearTernas />} />
        <Route path="listado-ternas" element={<ListarTernas />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="crear-tareas" element={<CrearTareas />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
