import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getSedes } from '../../ts/GeneralCoordinator/GetHeadquarters';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-icon.svg';
import DarkModeSwitcher from './DarkModeSwitcher';

/**
 * Header component
 * 
 */
const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  // Extract role from localStorage
  const role = localStorage.getItem('userRole');

  const [sedes, setSedes] = useState<{ sede_id: number; nameSede: string; address: string }[]>([]);
  const hasFetched = useRef(false);
  const [selectedSede, setSelectedSede] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  // Define role-based routes
  const roleRoutes: { [key: string]: string } = {
    '1': '/estudiantes/inicio',
    '2': '/catedratico/graficas',
    '3': '/administrador/graficas',
    '4': '/coordinadorsede/graficas',
    '5': '/coordinadorgeneral/graficas',
    '6': '/coordinadortesis/graficas',
    '7': '/revisortesis/graficas',
  };

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        setSedes(data);
        hasFetched.current = true; // We mark that the request has already been made
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };

    if (!hasFetched.current) {
      fetchSedes();
    }
  }, []);

  useEffect(() => {
    if (sedes.length > 0) {
      const storedSede = localStorage.getItem('selectedSedeId');
      if (storedSede && sedes.some(s => s.sede_id.toString() === storedSede)) {
        setSelectedSede(storedSede);
      } else {
        setSelectedSede(sedes[0].sede_id.toString());
        localStorage.setItem('selectedSedeId', sedes[0].sede_id.toString());
      }
    }
  }, [sedes]);

  // In the onChange of the select:
  const handleSedeChange = (value: string) => {
    setSelectedSede(value);
    localStorage.setItem('selectedSedeId', value);

    if (location.pathname === '/coordinadorgeneral/graficas') {
      // Reload the current page
      window.location.reload();
    } else {
      // Navigate to the desired page
      navigate('/coordinadorgeneral/graficas');
    }
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300'}`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full'}`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500'}`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-[0]'}`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-200'}`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          {/* <!-- Logo --> */}
          <Link className="block flex-shrink-0 lg:hidden ml-[-25px]" to={roleRoutes[role || '1']}>
            <img src={LogoIcon || "/placeholder.svg"} alt="Logo" width={120} />
          </Link>
          {/* <!-- Logo --> */}
        </div>

        {/* <!-- Sede selector for role 5 (Coordinador General) --> */}
        {role === '5' && (
          <div
            className="flex-1 max-w-xs mx-auto sm:mx-7 sm:max-w-sm md:max-w-md"
            style={{
              position: 'relative',
              left: window.innerWidth <= 640 ? '-8px' : '-10px',  // move 20px to the left on mobile
              top: window.innerWidth <= 640 ? '-7.5px' : '1px',   // go up 10px on mobile
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <label
                htmlFor="sede"
                className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap"
              >
                Seleccione sede:
              </label>
              <select
                id="sede"
                className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                value={selectedSede}
                onChange={(e) => handleSedeChange(e.target.value)}
              >
                {sedes.map((sede) => (
                  <option key={sede.sede_id} value={sede.sede_id}>
                    {sede.nameSede}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* <!-- Spacer when role is not 5 --> */}
        {role !== '5' && <div className="hidden sm:block flex-1"></div>}

        {/* <!-- Right side items --> */}
        <div className="flex items-center gap-2 2xsm:gap-4 md:gap-3">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Switcher --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Switcher --> */}

            {/* <!-- Notification Dropdown (only for Estudiante and Administrador) --> */}
            {(role === '1' || role === '3') && <DropdownNotification />}
            {/* <!-- Notification Dropdown --> */}
          </ul>

          {/* <!-- User Menu --> */}
          <DropdownUser />
          {/* <!-- User Menu --> */}
        </div>
        {/* <!-- Right side items --> */}
      </div>
    </header>
  );
};

export default Header;