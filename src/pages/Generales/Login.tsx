import { useNavigate } from "react-router-dom"; 
import { FaEnvelope, FaLock } from "react-icons/fa"; 
import { useState } from "react"; 
import Swal from "sweetalert2"; 
import umgLogo from '../../images/Login/logo3.png';
import ofiLogo from '../../images/Login/sistemas1_11zon.png'; 
import axios from 'axios'; 

const Login: React.FC = () => {
  const navigate = useNavigate(); // useNavigate hook for routing
  const [email, setEmail] = useState(''); // State for managing email input
  const [password, setPassword] = useState(''); // State for managing password input
  const [errorMessage, setErrorMessage] = useState(''); // State for storing error messages

  // Handle form submission when the user tries to log in
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents default form submission

    try {
      // Sending POST request to the backend for login
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });

      // Storing the authentication token and user role in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.rol);

      // Mapping user roles to routes
      const rolePaths: { [key: number]: string } = {
        3: "/admin/graficas", // Admin role
        4: "/secretario/crea-sedes", // Secretary role
        1: "/estudiantes/inicio", // Student role
      };

      // Checking if the password needs to be updated
      if (response.data.passwordUpdate === false) {
        // If the password needs to be updated, show a warning and redirect to password change page
        Swal.fire({
          icon: 'warning',
          title: 'Cambio de contraseña requerido', // Message in Spanish
          text: 'Primero favor de cambiar contraseña temporal.', // Message in Spanish
          confirmButtonColor: '#ffc107', // Yellow color for the button
        }).then(() => {
          navigate("/cambia/contraseña"); // Redirect to password change page
        });
      } else {
        // If the login is successful, show a success alert
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido', // Message in Spanish
          text: 'Inicio de sesión exitoso.', // Message in Spanish
          confirmButtonColor: '#3085d6', // Blue color for the button
        }).then(() => {
          // Checking if the user's role has a valid route
          const validRoles = [1, 3, 4]; // Valid roles for navigation
          const rolePath = validRoles.includes(response.data.rol)
            ? rolePaths[response.data.rol] // Route based on the user's role
            : "/"; // Default route for unknown roles

          navigate(rolePath); // Redirecting based on the user's role
        });
      }
    } catch (error: any) {
      // Handling errors by showing an error alert
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión', // Message in Spanish
        text: error?.response?.data?.message || 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.', // Message in Spanish
        confirmButtonColor: '#d33', // Red color for the button
      });
      setErrorMessage(error?.response?.data?.message || 'Error desconocido al iniciar sesión'); // Setting the error message state
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${ofiLogo})` }} // Setting background image
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <img src={umgLogo} alt="UMG Logo" className="w-24 mx-auto" /> {/* UMG logo */}
          <h1 className="my-3 text-xl font-semibold text-gray-700">Gestor de tesis</h1> {/* Title of the login page */}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Login form */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label> {/* Email input label */}
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Updating email state on input change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Correo" // Placeholder text in Spanish
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaEnvelope /> {/* Envelope icon */}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label> {/* Password input label */}
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Updating password state on input change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contraseña" // Placeholder text in Spanish
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaLock /> {/* Lock icon */}
              </span>
            </div>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} {/* Displaying error message */}
          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Ingresar {/* Submit button text in Spanish */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; // Exporting the Login component
