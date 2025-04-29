import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import umgLogo from '../../images/Login/logo3.png';
import ofiLogo from '../../images/Login/sistemas1_11zon.png';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, complete todos los campos.',
        confirmButtonColor: '#ffc107',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Ingrese un correo electrónico válido.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (password.length < 4) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener al menos 4 caracteres.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.rol);

      const rolePaths: { [key: number]: string } = {
        7: "/revisortesis/mis-asignaciones",
        6: "/coordinadortesis/graficas",
        5: "/coordinadorgeneral/graficas",
        4: "/coordinadorsede/graficas",
        3: "/administrador/graficas",
        1: "/estudiantes/time-line",
      };

      if (response.data.passwordUpdate === false) {
        Swal.fire({
          icon: 'warning',
          title: 'Cambio de contraseña requerido',
          text: 'Primero favor de cambiar contraseña temporal.',
          confirmButtonColor: '#ffc107',
        }).then(() => {
          navigate("/cambia/contraseña");
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso.',
          confirmButtonColor: '#28a745',
        }).then(() => {
          const validRoles = [1, 3, 4, 5, 6, 7];
          const rolePath = validRoles.includes(response.data.rol)
            ? rolePaths[response.data.rol]
            : "/";

          navigate(rolePath);
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error?.response?.data?.message || 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover" style={{ backgroundImage: `url(${ofiLogo})` }}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <img src={umgLogo} alt="UMG Logo" className="w-60 mx-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
            <div className="relative">
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Correo" />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaEnvelope />
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contraseña" />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock />
              </span>
            </div>
          </div>
          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Ingresar
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/recuperar-contraseña" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;