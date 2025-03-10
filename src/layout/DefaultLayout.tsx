import React, { useState, ReactNode, useEffect } from 'react';
import Header from '../components/Header/index';
import SidebarAdmin from '../components/Sidebar/Admin';
import SidebarSecretario from '../components/Sidebar/Secretario';
import SidebarEstudiante from '../components/Sidebar/Estudiantes';
import SidebarCordinador from '../components/Sidebar/Cordinador';
import SidebarRevisor from '../components/Sidebar/Revisor';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<number | null>(null);

  // Recuperar el rol del localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(Number(storedRole));
    }
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {role === 1 ? (
          <SidebarEstudiante sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : role === 3 ? (
          <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : role === 4 ? (
          <SidebarSecretario sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : role === 6 ? (
          <SidebarCordinador sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : role === 7 ? (
          <SidebarRevisor sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : null}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
