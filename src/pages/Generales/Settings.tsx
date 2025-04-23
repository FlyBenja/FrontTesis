import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { updatePassword } from '../../ts/Generales/UpdatePassword';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

// SweetAlert wrapper for React
const MySwal = withReactContent(Swal);

const Settings = () => {
  // State to manage the form fields and loading state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Hook for navigation
  const navigate = useNavigate();  

  // Handler for updating the password
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Password validation
    if (newPassword !== confirmPassword) {
      setLoading(false);
      // Display SweetAlert for password mismatch
      MySwal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden', // "Passwords do not match"
        text: 'Por favor, asegúrate de que la nueva contraseña y la confirmación sean idénticas.', // "Please ensure that the new password and confirmation are identical."
        confirmButtonColor: '#d33',
      });
      return;
    }

    try {
      // Attempt to update the password
      await updatePassword(currentPassword, newPassword);
      // Display SweetAlert for successful password change
      MySwal.fire({
        icon: 'success',
        title: 'Contraseña actualizada', // "Password updated"
        text: 'Contraseña cambiada exitosamente.', // "Password changed successfully."
        confirmButtonColor: '#28a745',
      }).then(() => {
        setLoading(false);
        // Clear localStorage after successful password change
        localStorage.clear();
        // Reload the page
        window.location.reload();
        // Redirect to home
        navigate('/');
      });
    } catch (error: any) {
      setLoading(false);
      // Display SweetAlert for error in password change
      MySwal.fire({
        icon: 'error',
        title: 'Error al cambiar la contraseña', // "Error changing password"
        text: error.message || 'Ocurrió un error inesperado.', // "An unexpected error occurred."
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <>
      <Breadcrumb pageName="Contraseña" /> {/* "Settings" */}
      <div className="mx-auto max-w-5xl px-4 py-1">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-stretch">

          {/* Change Password Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark self-stretch h-full flex flex-col">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Cambiar Contraseña</h3> {/* "Change Password" */}
            </div>
            <div className="p-4 flex-1">
              <form onSubmit={handlePasswordUpdate} className="h-full flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-black dark:text-white">Contraseña Actual</label> {/* "Current Password" */}
                    <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" placeholder="********" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-black dark:text-white">Nueva Contraseña</label> {/* "New Password" */}
                    <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" placeholder="********" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-black dark:text-white">Repetir Contraseña</label> {/* "Repeat Password" */}
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" placeholder="********" />
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button type="submit" disabled={loading} className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
                    {loading ? 'Cargando...' : 'Guardar'} {/* "Saving..." if loading, "Save" otherwise */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
