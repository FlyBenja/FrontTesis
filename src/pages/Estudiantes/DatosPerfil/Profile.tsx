import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import userSix from '../../../images/user/user-06.png'; // Imagen por defecto
import ofiLogo from '../../../images/Login/sistemas1_11zon.png';
import { FaCamera } from 'react-icons/fa'; // Ícono de la cámara

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string>(userSix); // Estado para la imagen de perfil

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl); // Cambiar la imagen de perfil
    }
  };

  return (
    <>
      <Breadcrumb pageName="Profile" />
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
            <img src={profileImage} alt="profile" className="w-full h-full rounded-full" />
            
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
            <h3 className="mb-1 text-xl font-semibold text-black dark:text-white">
              Danish Heilium
            </h3>
            <p className="font-medium">Correo Electrónico</p>
            <div className="mx-auto mt-2 mb-2 grid max-w-lg grid-cols-3 rounded-md border border-stroke py-2 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-2 dark:border-strokedark">
                <span className="font-semibold text-black dark:text-white">
                  Administrador
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-2 dark:border-strokedark">
                <span className="font-semibold text-black dark:text-white">
                  xxxx-xx-xxxxx
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-2">
                <span className="font-semibold text-black dark:text-white">
                  Guastatoya
                </span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">About Me</h4>
              <p className="mt-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque posuere fermentum urna, eu condimentum mauris
                tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                pharetra ligula sed, aliquam lacus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
