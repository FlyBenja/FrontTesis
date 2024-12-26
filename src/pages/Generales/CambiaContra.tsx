import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import umgLogo from '../../images/Login/logo3.png';
import ofiLogo from '../../images/Login/sistemas1_11zon.png';
import { updatePassword } from '../../ts/Generales/UpdatePassword.ts';

const MySwal = withReactContent(Swal);

const CambiaContra: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setLoading(false);
      MySwal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor, asegúrate de que la nueva contraseña y la confirmación sean idénticas.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      MySwal.fire({
        icon: 'error',
        title: 'Autenticación requerida',
        text: 'No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    try {
      // Llamada al servicio para cambiar la contraseña
      const response: any = await updatePassword(oldPassword, newPassword);
      const successMessage = response?.message || 'Contraseña cambiada exitosamente.';

      // Eliminar datos del localStorage y redirigir al inicio
      localStorage.clear();
      setLoading(false);
      MySwal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: successMessage,
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/');
      });
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        (error.response && error.response.data?.message) ||
        'Ocurrió un error inesperado al intentar cambiar la contraseña.';

      setLoading(false);
      MySwal.fire({
        icon: 'error',
        title: 'Error al cambiar la contraseña',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
    }
  };

  // Redirección forzada si el usuario intenta regresar
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      navigate('/');
    });
  }

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
          <button
            type="submit"
            className={`w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
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
