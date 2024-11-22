import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import withReactContent from 'sweetalert2-react-content'; // Extensión para React
import umgLogo from '../images/Login/logo3.png';
import ofiLogo from '../images/Login/sistemas1_11zon.png';
import { updatePassword } from '../ts/Generales/UpdatePassword.ts'; // Función de servicio

const MySwal = withReactContent(Swal); // Configuramos SweetAlert2 para usar con React

const CambiaContra: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Función para obtener el token de autenticación
  const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken'); // Recuperamos el token del localStorage
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log('Iniciando el proceso de cambio de contraseña.');

    // Validación de contraseñas
    if (newPassword !== confirmPassword) {
      console.log('Las contraseñas no coinciden.');
      setLoading(false);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Obtener el token de autenticación
    const token = getAuthToken();
    if (!token) {
      console.log('Token no encontrado.');
      setLoading(false);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró un token de autenticación.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Llamamos a la función de servicio pasando el token
    try {
      console.log('Llamando a la función `updatePassword`...');
      const message = await updatePassword(oldPassword, newPassword); // Ahora pasamos el token
      console.log('Respuesta del servicio `updatePassword`:', message);

      setLoading(false);
      MySwal.fire({
        icon: 'success',
        title: 'Éxito',
        text: message,
        confirmButtonColor: '#3085d6',
      }).then(() => {
        console.log('Redirigiendo al login...');
        navigate('/login'); // Redirigimos después de cerrar la alerta
      });
    } catch (error: any) {
      console.error('Error en el servicio `updatePassword`:', error);

      const errorMessage =
        error?.message ||
        (error.response && error.response.data) ||
        'Error desconocido al cambiar la contraseña.';

      console.log('Mensaje de error procesado:', errorMessage);

      setLoading(false);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
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
          <h1 className="my-3 text-xl font-semibold text-gray-700">Cambia tu Contraseña</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contraseña actual */}
          <div className="space-y-1">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu contraseña actual"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock />
              </span>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nueva contraseña"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock />
              </span>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirmar nueva contraseña"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock />
              </span>
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className={`w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiaContra;
