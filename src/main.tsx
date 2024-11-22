import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import CambiaContra from './pages/CambiaContra';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<App />} />
        <Route path="/estudiantes/*" element={<App />} />
        <Route path="/secretario/*" element={<App />} />
        <Route path="/cambia/contraseña" element={<CambiaContra />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
