import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import App from './App';
import Login from './pages/Generales/Login';
import CambiaContra from './pages/Generales/CambiaContra';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import Swal from 'sweetalert2';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const ProtectedRouteCambiaContra = () => {
  const navigate = useNavigate();

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

  return <CambiaContra />;
};

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<App />} />
        <Route path="/estudiantes/*" element={<App />} />
        <Route path="/secretario/*" element={<App />} />
        <Route path="/cambia/contraseña" element={<ProtectedRouteCambiaContra />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
