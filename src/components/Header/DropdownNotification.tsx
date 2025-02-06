import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { getDatosPerfil, PerfilData } from '../../ts/Generales/GetDatsPerfil';
import { getNotificationsAdmin } from '../../ts/Admin/GetNotificationsAdmin';
import { getNotificationsUser } from '../../ts/Estudiantes/GetNotificationsUser';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [role, setRole] = useState<number | null>(null);
  const [sedeId, setSedeId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<{ notification_text: string; notification_date: string }[]>([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(Number(storedRole));
    }

    const fetchProfileData = async () => {
      try {
        const perfilData: PerfilData = await getDatosPerfil();
        setSedeId(perfilData.sede);
        setUserId(perfilData.user_id);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (role === 3 && sedeId) {
          const notificationsData = await getNotificationsAdmin(sedeId);
          setNotifications(notificationsData);
        } else if (role === 1 && userId) {
          const notificationsData = await getNotificationsUser(userId);
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if ((role === 3 && sedeId) || (role === 1 && userId)) {
      fetchNotifications();
    }
  }, [role, sedeId, userId]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {notifying && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}

          <svg className="fill-current duration-300 ease-in-out" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">Notificaciones</h5>
            </div>
            <ul className="flex h-auto flex-col overflow-y-auto">
              {notifications.map((notification, index) => (
                <li key={index}>
                  <Link className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4" to="#">
                    <p className="text-sm text-black dark:text-white">{notification.notification_text}</p>
                    <p className="text-xs">{notification.notification_date}</p>
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
