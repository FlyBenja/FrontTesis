import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';  // Icono para el correo electrónico
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import umgLogo from '../../images/Login/logo3.png';
import ofiLogo from '../../images/Login/sistemas1_11zon.png';
import { recuperaContraCorreo } from '../../ts/Generales/RecuperaContraCorreo';

// Initialize SweetAlert with React content
const MySwal = withReactContent(Swal);

const RecuperarContra: React.FC = () => {
  // State variables to handle the form data and loading status
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');  // State for email
  const [loading, setLoading] = useState<boolean>(false);  // State for loading status

  // Function to validate the email format
  const validateEmail = (email: string) => {
    // Regular expression to validate email format and domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@miumg\.edu\.gt$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevent default form submission behavior
  
    // Validate the email before proceeding
    if (!validateEmail(email)) {
      MySwal.fire({
        icon: 'error',
        title: 'Correo no válido',  // Alert for invalid email
        text: 'Por favor, ingresa un correo electrónico válido con el dominio @miumg.edu.gt',
        confirmButtonColor: '#d33',
      });
      return;
    }
  
    setLoading(true);  // Set loading to true while processing the form
  
    try {
      // Llamada a la API para enviar el correo de recuperación
      const successMessage = await recuperaContraCorreo(email);  // Llamada a la API
      
      setLoading(false);  // Reset loading state
      MySwal.fire({
        icon: 'success',
        title: 'Correo enviado',  // Alert for successful email sending
        text: successMessage,  // Usar el mensaje de éxito de la API
        confirmButtonColor: '#28a745',
      }).then(() => {
        navigate('/');  // Redirect to homepage after success
      });
    } catch (error: any) {
      // Handle errors if the email submission fails
      const errorMessage =
        error?.message ||
        (error.response && error.response.data?.message) ||
        'Ocurrió un error inesperado al intentar recuperar la contraseña.';  // Default error message
  
      setLoading(false);  // Reset loading state
      MySwal.fire({
        icon: 'error',
        title: 'Error al recuperar contraseña',  // Alert for error during password recovery
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
    }
  };  

  // Handle the "Regresar" button action
  const handleGoBack = () => {
    navigate(-1);  // Go back to the previous page
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${ofiLogo})` }}  // Background image for the page
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md relative">
        {/* "Regresar" button inside the logo container */}
        <button
          onClick={handleGoBack}  // Navigate back when the button is clicked
          className="absolute top-4 left-4 text-blue-600 font-medium hover:text-blue-800"
        >
          <span className="mr-2">←</span>Regresar
        </button>

        <div className="mb-4 text-center">
          <img src={umgLogo} alt="UMG Logo" className="w-24 mx-auto" />  {/* Logo for the page */}
          <h1 className="my-3 text-xl font-semibold text-gray-700">Recuperar Contraseña</h1>  {/* Page heading */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Al momento de enviar al correo electrónico se enviará una nueva contraseña temporal.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico  {/* Label for email field */}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  // Handle email change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu correo electrónico"  // Placeholder text
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaEnvelope />  {/* Envelope icon for email field */}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}  // Disable button if loading
          >
            {loading ? 'Enviando...' : 'Enviar'}  {/* Button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarContra;
