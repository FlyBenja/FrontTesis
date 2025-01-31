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

// Creating a root element to render the React app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Protected route for changing the password, checking if the user is logged in
const ProtectedRouteCambiaContra = () => {
  const navigate = useNavigate();  // Hook to navigate between routes

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
          confirmButton: 'bg-red-600 text-white',  // Custom styling for the confirm button
        },
      }).then(() => {
        navigate('/');  // Redirect to the homepage after the alert
      });
    }
  }, [navigate]);

  return <CambiaContra />;  // Render the CambiaContra component if the user is authenticated
};

// Rendering the application to the DOM
root.render(
  <React.StrictMode>
    <Router>  // Set up the router for handling navigation
      <Routes>
        <Route path="/" element={<Login />} />  // Route for the login page
        <Route path="/admin/*" element={<App />} />  // Route for the admin section
        <Route path="/estudiantes/*" element={<App />} />  // Route for the student section
        <Route path="/secretario/*" element={<App />} />  // Route for the secretary section
        <Route path="/cambia/contraseña" element={<ProtectedRouteCambiaContra />} />  // Protected route for changing the password
      </Routes>
    </Router>
  </React.StrictMode>,
);
