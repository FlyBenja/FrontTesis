import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import Calendar from './pages/Calendar';
import TimeLine from './pages/Estudiantes/TimeLine';
import Graficas from './pages/Inicio/Graficas';
import Profile from './pages/DatosPerfil/Profile';
import Settings from './pages/DatosPerfil/Settings';
import Alerts from './pages/UiElements/Alerts';
import DefaultLayout from './layout/DefaultLayout';
import Bitacora from './pages/Inicio/Bitacora';
import SubirEstudiantes from './pages/Estudiantes/SubirEstudiantes';
import ListarEstudiantes from './pages/Estudiantes/ListarEstudiantes';
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
        <Route path="listado-estudiantes" element={<ListarEstudiantes />} />
        <Route path="subir-estudiantes" element={<SubirEstudiantes />} />
        <Route path="subir-catedraticos" element={<SubirCatedraticos />} />
        <Route path="listado-catedraticos" element={<ListarCatedraticos />} />
        <Route path="crear-catedraticos" element={<CrearCatedraticos />} />
        <Route path="crear-ternas" element={<CrearTernas />} />
        <Route path="listado-ternas" element={<ListarTernas />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="time-line" element={<TimeLine />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="ui/alerts" element={<Alerts />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
