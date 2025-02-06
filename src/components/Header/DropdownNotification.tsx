import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside'; 
import { getDatosPerfil, PerfilData } from '../../ts/Generales/GetDatsPerfil';
import { getNotificationsAdmin } from '../../ts/Admin/GetNotificationsAdmin'; 
import { getNotificationsUser } from '../../ts/Estudiantes/GetNotificationsUser'; 

// Dropdown component to show notifications
const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown visibility
  const [notifying, setNotifying] = useState(true); // State to track if there are new notifications
  const [role, setRole] = useState<number | null>(null); // State to store the user's role
  const [sedeId, setSedeId] = useState<number | null>(null); // State to store the sede ID
  const [userId, setUserId] = useState<number | null>(null); // State to store the user ID
  const [notifications, setNotifications] = useState<{ notification_text: string; notification_date: string }[]>([]); // State to store the list of notifications

  // Fetch user profile data when component is mounted
  useEffect(() => {
    // Retrieve the stored user role from localStorage
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(Number(storedRole)); // Set the user role state
    }

    // Function to fetch profile data
    const fetchProfileData = async () => {
      try {
        const perfilData: PerfilData = await getDatosPerfil(); // Fetch the profile data
        setSedeId(perfilData.sede); // Set the sede ID
        setUserId(perfilData.user_id); // Set the user ID
      } catch (error) {
        // Handle error when fetching profile data
        // Error handling was omitted as per instructions
      }
    };

    fetchProfileData(); // Call the function to fetch profile data
  }, []); // Empty dependency array means this effect runs once when the component is mounted

  // Fetch notifications when role, sedeId, or userId changes
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // If role is 3 (admin) and sedeId is available, fetch admin notifications
        if (role === 3 && sedeId) {
          const notificationsData = await getNotificationsAdmin(sedeId);
          setNotifications(notificationsData); // Set the notifications state
        }
        // If role is 1 (user) and userId is available, fetch user notifications
        else if (role === 1 && userId) {
          const notificationsData = await getNotificationsUser(userId);
          setNotifications(notificationsData); // Set the notifications state
        }
      } catch (error) {
        // Handle error when fetching notifications
        // Error handling was omitted as per instructions
      }
    };

    // Only fetch notifications if role and necessary IDs are available
    if ((role === 3 && sedeId) || (role === 1 && userId)) {
      fetchNotifications(); // Call the function to fetch notifications
    }
  }, [role, sedeId, userId]); // Dependencies: effect runs whenever role, sedeId, or userId changes

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative"> {/* Component to handle clicking outside to close the dropdown */}
      <li>
        <Link
          onClick={() => {
            setNotifying(false); // Stop showing the notification indicator when clicked
            setDropdownOpen(!dropdownOpen); // Toggle the dropdown visibility
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {/* Display notification indicator if there are new notifications */}
          {notifying && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}

          {/* Notification icon */}
          <svg className="fill-current duration-300 ease-in-out" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343Z"
              fill="" // Path for the notification icon
            />
          </svg>
        </Link>

        {/* Dropdown menu for notifications */}
        {dropdownOpen && (
          <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">Notificaciones</h5> {/* Section title for notifications */}
            </div>
            <ul className="flex h-auto flex-col overflow-y-auto">
              {/* Iterate over the notifications array to display each notification */}
              {notifications.map((notification, index) => (
                <li key={index}>
                  <Link className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4" to="#">
                    {/* Display notification text */}
                    <p className="text-sm text-black dark:text-white">{notification.notification_text}</p>
                    {/* Display the formatted notification date and time */}
                    <p className="text-xs">
                      {new Date(notification.notification_date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}{' '}
                      / {new Date(notification.notification_date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      / {new Date(notification.notification_date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
