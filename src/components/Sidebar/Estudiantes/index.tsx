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
        <NavLink to="/estudiantes/inicio">
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

              {/* <!-- Menu Item Time Line --> */}
              <li>
                <NavLink
                  to="/estudiantes/inicio"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/admin/calendar' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
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
              {/* <!-- Menu Item Time Line --> */}

              {/* <!-- Menu Item Propuestas --> */}
              <li>
                <NavLink
                  to="/estudiantes/propuesta"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/admin/calendar' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13ZM6 4H12V10H18V20H6V4ZM8 12H16V14H8V12ZM8 16H14V18H8V16Z"
                      fill="currentColor"
                    />
                  </svg>
                  Propuestas
                </NavLink>
              </li>
              {/* <!-- Menu Item Propuestas --> */}

              {/* <!-- Menu Item Cursos --> */}
              <li>
                <NavLink
                  to="/estudiantes/cursos"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-xl text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/admin/calendar' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.89 19.1 2 18 2ZM6 4H18V20H6V4ZM8 6H16V8H8V6ZM8 10H16V12H8V10ZM8 14H13V16H8V14Z"
                      fill="currentColor"
                    />
                  </svg>
                  Cursos
                </NavLink>
              </li>
              {/* <!-- Menu Item Cursos --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
