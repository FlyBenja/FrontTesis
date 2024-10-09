import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import Calendar from './pages/Calendar';
import ECommerce from './pages/Inicio/Graficas';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import DefaultLayout from './layout/DefaultLayout';
import Bitacora from './pages/Inicio/Bitacora';
import SubirCatedraticos from './pages/Catedraticos/SubirCatedraticos';
import ListarCatedraticos from './pages/Catedraticos/ListarCatedraticos';
import CrearCatedraticos from './pages/Catedraticos/CrearCatedraticos';

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
        <Route index element={<ECommerce />} />
        <Route path="Bitacora" element={<Bitacora />} />
        <Route path="subir-catedraticos" element={<SubirCatedraticos />} />
        <Route path="listado-catedraticos" element={<ListarCatedraticos />} />
        <Route path="crear-catedraticos" element={<CrearCatedraticos />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="ui/alerts" element={<Alerts />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
