import type React from "react"
import { useState, useEffect } from "react"
import { getDatosPerfil, type PerfilData } from "../../ts/General/GetProfileData"
import { updateProfilePhoto } from "../../ts/General/PutPhotoProfile"
import { FaCamera } from "react-icons/fa"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import ofiLogo from "../../images/Login/sistemas1_11zon.png"
import Swal from "sweetalert2"

/**
 * Profile component for displaying and updating user profile information
 */
const Profile = () => {
  const [profileImage, setProfileImage] = useState<string>() // State for profile image
  const [profileData, setProfileData] = useState<PerfilData | null>(null) // State for profile data

  /**
   * Effect hook to fetch profile data when component mounts
   */
  useEffect(() => {
    // Function to fetch profile data
    const fetchProfileData = async () => {
      try {
        const data = await getDatosPerfil() // API call to get profile data
        setProfileData(data) // Update state with retrieved data

        // Set profile image if available, otherwise use the first letter of username
        if (data.profilePhoto) {
          setProfileImage(data.profilePhoto)
        } else {
          setProfileImage(`${data.userName.charAt(0).toUpperCase()}`)
        }
      } catch (error) {
        // Error handling is empty in the original code
      }
    }

    fetchProfileData() // Call function when component mounts
  }, [])

  /**
   * Handles profile image change and uploads it to the server
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl) // Temporarily update profile image while uploading

      try {
        // API call to update profile picture
        await updateProfilePhoto(file)

        // Success alert
        Swal.fire({
          title: "¡Éxito!",
          text: "La foto de perfil se ha actualizado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745", // Green background
          background: "#f4f4f4",
        }).then(() => {
          window.location.reload() // Reload the page after closing the alert
        })
      } catch (error: any) {
        const errorMessage = error?.message || "Hubo un problema al actualizar la foto de perfil."

        // Restore original profile image if update fails
        setProfileImage(profileData?.profilePhoto || " ")

        // Error alert
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc3545", // Red background
          background: "#f4f4f4",
        })
      }
    }
  }

  return (
    <>
      <Breadcrumb pageName="Mi Perfil" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-32 md:h-48">
          <img
            src={ofiLogo || "/placeholder.svg"}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-1 text-center lg:pb-3 xl:pb-4">
          <div className="relative z-30 mx-auto -mt-16 h-24 w-24 sm:h-36 sm:w-36 sm:-mt-20 rounded-full bg-white/20 p-1 backdrop-blur sm:p-2">
            {profileData?.profilePhoto ? (
              <img src={profileImage || "/placeholder.svg"} alt="profile" className="w-full h-full rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xl">
                {profileData?.userName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Camera button */}
            <div className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer">
              <label htmlFor="fileInput">
                <FaCamera className="text-lg" />
              </label>
              <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>
          <div className="mt-1">
            {profileData ? (
              <>
                <h3 className="mb-1 text-xl font-semibold text-black dark:text-white">
                  {profileData.userName} {/* Display username */}
                </h3>
                <p className="font-medium">{profileData.email}</p> {/* Display email */}
                <div className="mx-auto mt-2 mb-2 grid max-w-lg grid-cols-3 rounded-md border border-stroke py-2 dark:border-strokedark dark:bg-[#37404F]">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-2 dark:border-strokedark">
                    <span className="font-semibold text-black dark:text-white">
                      {profileData.roleName} {/* Display role name */}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-2 dark:border-strokedark">
                    <span className="font-semibold text-black dark:text-white">
                      {profileData.carnet} {/* Display ID card */}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-2">
                    <span className="font-semibold text-black dark:text-white">
                      {profileData.NombreSede} {/* Display campus name */}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p>Cargando datos del perfil...</p> // Loading message while fetching data
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
