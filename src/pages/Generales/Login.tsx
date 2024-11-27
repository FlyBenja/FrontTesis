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
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });

      // Guardar el token y rol en el localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.rol);

      // Mapear roles a rutas
      const rolePaths: { [key: number]: string } = {
        3: "/admin/graficas",
        4: "/secretario/crea-sedes",
        1: "/estudiantes/inicio",
      };

      // Verificar si la contraseña debe actualizarse
      if (response.data.passwordUpdate === false) {
        Swal.fire({
          icon: 'warning',
          title: 'Cambio de contraseña requerido',
          text: 'Primero favor de cambiar contraseña temporal.',
          confirmButtonColor: '#ffc107', // Color amarillo
        }).then(() => {
          navigate("/cambia/contraseña");
        });
      } else {
        // Mostrar alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          // Verificar si el rol tiene una ruta válida
          const validRoles = [1, 3, 4];
          const rolePath = validRoles.includes(response.data.rol)
            ? rolePaths[response.data.rol]
            : "/"; // Ruta predeterminada en caso de rol desconocido

          navigate(rolePath);
        });
      }
    } catch (error: any) {
      // Manejo de errores con alertas
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error?.response?.data?.message || 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
        confirmButtonColor: '#d33',
      });
      setErrorMessage(error?.response?.data?.message || 'Error desconocido al iniciar sesión');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${ofiLogo})` }}
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <img src={umgLogo} alt="UMG Logo" className="w-24 mx-auto" />
          <h1 className="my-3 text-xl font-semibold text-gray-700">Gestor de tesis</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Correo"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaEnvelope />
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contraseña"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock />
              </span>
            </div>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
