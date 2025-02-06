import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import userSix from '../../images/user/user-06.png'; // Imagen por defecto
import ofiLogo from '../../images/Login/sistemas1_11zon.png';
import { FaCamera } from 'react-icons/fa'; // Ícono de la cámara
import { getDatosPerfil, PerfilData } from '../../ts/Generales/GetDatsPerfil'; // Asumiendo que la API está en la carpeta api
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { updateProfilePhoto } from '../../ts/Generales/PutPhotoProfile'; // Importar la función para actualizar la foto de perfil

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string>(userSix); // Estado para la imagen de perfil
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null); // Estado para los datos del perfil

  useEffect(() => {
    // Función para obtener los datos del perfil
    const fetchProfileData = async () => {
      try {
        const data = await getDatosPerfil(); // Llamar a la API para obtener los datos del perfil
        setPerfilData(data); // Actualizar el estado con los datos obtenidos
        if (data.profilePhoto) {
          setProfileImage(data.profilePhoto); // Si hay foto de perfil, usarla
        } else {
          setProfileImage(`${data.userName.charAt(0).toUpperCase()}`); // Si no tiene foto, usar la primera inicial del nombre
        }
      } catch (error) {
        console.error('Error al obtener los datos del perfil', error);
      }
    };

    fetchProfileData(); // Llamar a la función para obtener los datos cuando se monta el componente
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl); // Cambiar la imagen de perfil mientras se sube
  
      try {
        // Llamar a la API para actualizar la foto de perfil
        const result = await updateProfilePhoto(file);
        console.log(result); // Si necesitas hacer algo con la respuesta de la API
  
        // Alerta de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: 'La foto de perfil se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745', // Fondo verde
          background: '#f4f4f4',
        });
      } catch (error: any) {
        // En caso de error, restaurar la foto de perfil original
        const errorMessage = error?.message || 'Hubo un problema al actualizar la foto de perfil.';
        
        // Restaurar la imagen original de la API si la actualización falla
        setProfileImage(perfilData?.profilePhoto || userSix);
  
        // Alerta de error
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545', // Fondo rojo
          background: '#f4f4f4',
        });
      }
    }
  };  

  return (
    <>
      <Breadcrumb pageName="Mi Perfil" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-32 md:h-48">
          <img
            src={ofiLogo}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-1 text-center lg:pb-3 xl:pb-4">
          <div className="relative z-30 mx-auto -mt-16 h-24 w-24 sm:h-36 sm:w-36 sm:-mt-20 rounded-full bg-white/20 p-1 backdrop-blur sm:p-2">
            {perfilData?.profilePhoto ? (
              <img src={profileImage} alt="profile" className="w-full h-full rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xl">
                {perfilData?.userName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Botón de la cámara */}
            <div className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer">
              <label htmlFor="fileInput">
                <FaCamera className="text-lg" />
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="mt-1">
            {perfilData ? (
              <>
                <h3 className="mb-1 text-xl font-semibold text-black dark:text-white">
                  {perfilData.userName} {/* Mostrar el nombre del usuario */}
                </h3>
                <p className="font-medium">{perfilData.email}</p> {/* Mostrar el correo electrónico */}
                <div className="mx-auto mt-2 mb-2 grid max-w-lg grid-cols-3 rounded-md border border-stroke py-2 dark:border-strokedark dark:bg-[#37404F]">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-2 dark:border-strokedark">
                    <span className="font-semibold text-black dark:text-white">
                      {perfilData.roleName} {/* Mostrar el nombre del rol */}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-2 dark:border-strokedark">
                    <span className="font-semibold text-black dark:text-white">
                      {perfilData.carnet} {/* Mostrar el carnet */}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-2">
                    <span className="font-semibold text-black dark:text-white">
                      {perfilData.NombreSede} {/* Mostrar la sede */}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p>Cargando datos del perfil...</p> // Mensaje mientras se cargan los datos
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
