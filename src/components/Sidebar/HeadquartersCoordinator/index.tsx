import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from '../SidebarLinkGroup';
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
  const [sidebarExpanded, setSidebarExpanded] = useState(
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
        <NavLink to="/coordinadorsede/graficas">
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

              {/* <!-- Menu Item Inicio --> */}
              <SidebarLinkGroup
                activeCondition={pathname === '/coordinadorsede/ui' || pathname.includes('ui')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-bold text-lg text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/coordinadorsede/ui' || pathname.includes('ui')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        <span style={{ marginLeft: '6px' }}>Inicio</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/coordinadorsede/graficas"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                              onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                            >
                              Graficas
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/coordinadorsede/bitacora"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                              onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                            >
                              Bitacora
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Inicio --> */}

              {/* <!-- Menu Item Catedraticos --> */}
              <SidebarLinkGroup
                activeCondition={pathname === '/coordinadorsede/ui' || pathname.includes('ui')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-bold text-lg text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/coordinadorsede/ui' || pathname.includes('ui')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_130_9807)">
                            <path
                              d="M19 2H13C11.9 2 11 2.9 11 4V14C11 15.1 11.9 16 13 16H19C20.1 16 21 15.1 21 14V4C21 2.9 20.1 2 19 2ZM19 14H13V4H19V14ZM5 6C6.1 6 7 5.1 7 4C7 2.9 6.1 2 5 2C3.9 2 3 2.9 3 4C3 5.1 3.9 6 5 6ZM10 8H0V10H10V8ZM10 12H0V14H10V12Z"
                              fill="currentColor"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9807">
                              <rect
                                width="24"
                                height="24"
                                fill="white"
                                transform="translate(0 0.052124)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Catedraticos
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/coordinadorsede/Subir-catedraticos"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                              onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                            >
                              Subir Catedraticos
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/coordinadorsede/listado-catedraticos"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                              onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                            >
                              Listar Catedraticos
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/coordinadorsede/crear-catedraticos"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                              onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                            >
                              Crear Catedraticos
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Catedraticos --> */}

              {/* <!-- Menu Item Comisiones --> */}
              {/* {(new Date().getMonth() + 1) >= 7 && (new Date().getMonth() + 1) <= 12 && (
                <SidebarLinkGroup activeCondition={pathname === '/coordinadorsede/ui' || pathname.includes('ui')}>
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-bold text-lg text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/coordinadorsede/ui' || pathname.includes('ui')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_130_9807)">
                              <path
                                d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8ZM6 9.5C4.067 9.5 2.5 11.067 2.5 13V14H9.5V13C9.5 11.067 7.933 9.5 6 9.5ZM13 8C14.1046 8 15 7.10457 15 6C15 4.89543 14.1046 4 13 4C11.8954 4 11 4.89543 11 6C11 7.10457 11.8954 8 13 8ZM17.5 14H17V13C17 11.067 15.433 9.5 13.5 9.5C13.0355 9.5 12.5895 9.58086 12.1794 9.72135C12.7219 10.3553 13.5 11.5689 13.5 13V14H17.5Z"
                                fill="currentColor"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_130_9807">
                                <rect
                                  width="18"
                                  height="18"
                                  fill="white"
                                  transform="translate(0 0.052124)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          Comisiones
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                        >
                          <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/coordinadorsede/crear-comision"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                                onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                              >
                                Crear Comision
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/coordinadorsede/listado-comision"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sm text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                                onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                              >
                                Listar Comision
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )} */}
              {/* <!-- Menu Item Comisiones --> */}

              {/* <!-- Menu Item Crear Administradores --> */}
              <li>
                <NavLink
                  to="/coordinadorsede/crea-admin"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-lg text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadorsede/crea-admin' &&
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
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      fill="currentColor"
                    />
                  </svg>
                  Crear Admin
                </NavLink>
              </li>
              {/* <!-- Menu Item Crear Administradores --> */}

              {/* <!-- Menu Item Asignar PG1 y PG2 --> */}
              <li>
                <NavLink
                  to="/coordinadorsede/asignapg"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-bold text-lg text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/coordinadorsede/asignapg' &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Cerrar sidebar
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V6C2 4.9 2.9 4 4 4ZM20 8H4V20H20V8ZM9 12H15C15.55 12 16 12.45 16 13C16 13.55 15.55 14 15 14H9C8.45 14 8 13.55 8 13C8 12.45 8.45 12 9 12ZM9 16H12C12.55 16 13 16.45 13 17C13 17.55 12.55 18 12 18H9C8.45 18 8 17.55 8 17C8 16.45 8.45 16 9 16Z"
                      fill="currentColor"
                    />
                  </svg>
                  Asignar PG
                </NavLink>
              </li>
              {/* <!-- Menu Item Asignar PG1 y PG2 --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
