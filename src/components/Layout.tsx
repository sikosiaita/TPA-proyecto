import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../logo-tpa-1.PNG';
import userAvatar from '../logo-user.png';
import { Home, Truck, Drone, Bike } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'INICIO', path: '/dashboard', icon: <Home size={20} className="stroke-[2.5]" /> },
    { label: 'GESTOR DE CARGA', path: '/gestor-carga', icon: <Truck size={20} className="stroke-[2.5]" /> },
    { label: 'CENTRO DE DESPACHO', path: '/centro-despacho', icon: <Drone size={20} className="stroke-[2.5]" /> },
    { label: 'ESTADOS DE ENTREGAS', path: '/estados-entregas', icon: <Bike size={20} className="stroke-[2.5]" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* NAVBAR SUPERIOR */}
      <nav className="w-full bg-[#FF9EAF] flex items-center justify-between px-6 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <img src={logo} alt="PinkBox Logo" className="w-10 h-10 object-contain" />
          <span className="text-white font-bold text-sm">PinkBox</span>
        </div>
        <img
          src={userAvatar}
          alt="Usuario"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      </nav>

      <div className="flex flex-1">

        {/* BARRA LATERAL */}
        <aside className="w-64 bg-[#FFC0C3] flex flex-col py-6 gap-2 shadow-lg">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 mx-4 px-6 py-3 text-sm font-bold transition-colors text-left rounded-full
                  ${isActive 
                    ? 'bg-[#FF8FA9] text-white shadow-sm' 
                    : 'text-white hover:bg-[#f79eb3]'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;