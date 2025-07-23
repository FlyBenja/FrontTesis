import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './pages/General/Login';
import CambiaContra from './pages/General/ChangePassword';
import RecuperarContra from './pages/General/RecoverPassword';
import './css/style.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import Swal from 'sweetalert2';
import { SedeProvider } from './components/ReloadPages/HeadquartersContext'; // Asegúrate de tener la ruta correcta aquí

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const ProtectedRouteCambiaContra = () => {
    const navigate = useNavigate();

    useEffect(() => {
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
        }
    }, [navigate]);

    return <CambiaContra />;
};

root.render(
    <React.StrictMode>
        <SedeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/estudiantes/*" element={<App />} />
                    <Route path="/administrador/*" element={<App />} />
                    <Route path="/coordinadorsede/*" element={<App />} />
                    <Route path="/coordinadortesis/*" element={<App />} />
                    <Route path="/coordinadorgeneral/*" element={<App />} />
                    <Route path="/revisortesis/*" element={<App />} />
                    <Route path="/cambia/contraseña" element={<ProtectedRouteCambiaContra />} />
                    <Route path="/recuperar-contraseña" element={<RecuperarContra />} />
                </Routes>
            </Router>
        </SedeProvider>
    </React.StrictMode>,
);
