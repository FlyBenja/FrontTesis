import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../images/logo/logo.svg';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/coordinadortesis/graficas">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">

              {/* <!-- Menu Item Graficas --> */}
              <li>
                <NavLink
                  to="/coordinadortesis/graficas"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadortesis/graficas' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
                      fill="currentColor"
                    />
                  </svg>
                  Inicio
                </NavLink>
              </li>
              {/* <!-- Menu Item Graficas --> */}

              {/* <!-- Menu Item Mis Asignaciones --> */}
              <li>
                <NavLink
                  to="/coordinadortesis/mis-asignaciones"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadortesis/mis-asignaciones' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2C5.45 2 5 2.45 5 3V21C5 21.55 5.45 22 6 22H18C18.55 22 19 21.55 19 21V3C19 2.45 18.55 2 18 2H6ZM6 3H18V21H6V3ZM10 6H14V8H10V6ZM10 10H14V12H10V10ZM10 14H14V16H10V14ZM7 18L9 16L11 18L13 16L15 18"
                      fill="currentColor"
                    />
                  </svg>
                  Mis Asignaciones
                </NavLink>
              </li>
              {/* <!-- Menu Item Mis Asignaciones --> */}

              {/* <!-- Menu Item Solicitudes de Revisión --> */}
              <li>
                <NavLink
                  to="/coordinadortesis/solicitud-revisiones"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadortesis/solicitud-revisiones' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 2H15L20 7V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H9ZM14 3.5V8H18.5L14 3.5ZM12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12ZM12 14C9.79 14 8 15.79 8 18C8 18.71 8.19 19.38 8.51 19.98L7.11 21.39C6.6 21.9 6.93 23 7.7 23H16.3C17.07 23 17.4 21.9 16.89 21.39L15.49 19.98C15.81 19.38 16 18.71 16 18C16 15.79 14.21 14 12 14Z"
                      fill="currentColor"
                    />
                  </svg>
                  Solicitudes de Revisión
                </NavLink>
              </li>
              {/* <!-- Menu Item Solicitudes de Revisión --> */}

              {/* <!-- Menu Item Asignaciones Activas --> */}
              <li>
                <NavLink
                  to="/coordinadortesis/asignaciones"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadortesis/asignaciones' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4H14L20 10V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4ZM14 3.5V9H19.5L14 3.5ZM10.293 14.293L8.586 12.586C8.195 12.195 7.562 12.195 7.171 12.586C6.781 12.976 6.781 13.609 7.171 14L9.586 16.414C9.976 16.805 10.609 16.805 11 16.414L16.829 10.586C17.219 10.195 17.219 9.562 16.829 9.171C16.438 8.781 15.805 8.781 15.414 9.171L10.293 14.293Z"
                      fill="currentColor"
                    />
                  </svg>
                  Asignaciones
                </NavLink>
              </li>
              {/* <!-- Menu Item Asignaciones Activas --> */}

              {/* <!-- Menu Item Revisores --> */}
              <li>
                <NavLink
                  to="/coordinadortesis/revisores"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadortesis/revisores' && 'bg-graydark dark:bg-meta-4'}`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C8.13 14 4 15.34 4 17V18H20V17C20 15.34 15.87 14 12 14ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6Z"
                      fill="currentColor"
                    />
                  </svg>
                  Revisores
                </NavLink>
              </li>
              {/* <!-- Menu Item Revisores --> */}

              {/* <!-- Menu Item Historial --> */}
              <li>
                <NavLink
                  to="/coordinadortesis/historial"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadortesis/historial' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h6v-2h-4z"
                      fill="currentColor"
                    />
                  </svg>
                  Historial
                </NavLink>
              </li>
              {/* <!-- Menu Item Historial --> */}

            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
