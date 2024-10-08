import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import ECommerce from './pages/Inicio/Graficas';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Bitacora from './pages/Inicio/Bitacora';
import Catedratico from './pages/Catedratico';

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
        <Route path="calendar" element={<Calendar />} />
        <Route path="catedratico" element={<Catedratico />} />
        <Route path="profile" element={<Profile />} />
        <Route path="forms/form-elements" element={<FormElements />} />
        <Route path="forms/form-layout" element={<FormLayout />} />
        <Route path="settings" element={<Settings />} />
        <Route path="ui/alerts" element={<Alerts />} />
        <Route path="ui/buttons" element={<Buttons />} />
        <Route path="auth/signin" element={<SignIn />} />
        <Route path="auth/signup" element={<SignUp />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
