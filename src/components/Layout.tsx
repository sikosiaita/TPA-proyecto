import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Logo-PINBOX.png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'INICIO', path: '/dashboard', icon: '🏠' },
    { label: 'GESTOR DE CARGA', path: '/gestor-carga', icon: '🚛' },
    { label: 'CENTRO DE DESPACHO', path: '/centro-despacho', icon: '✂️' },
    { label: 'ESTADOS DE ENTREGAS', path: '/estados-entregas', icon: '🚴' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* NAVBAR SUPERIOR */}
      <nav className="w-full bg-[#FFC5C5] flex items-center justify-between px-6 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <img src={logo} alt="PinkBox Logo" className="w-10 h-10 object-contain" />
          <span className="text-white font-bold text-sm">PinkBox</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </nav>

      <div className="flex flex-1">

        {/* BARRA LATERAL */}
        <aside className="w-64 bg-[#FFB3C6] flex flex-col py-6 gap-2 shadow-lg">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors text-left
                  ${isActive
                    ? 'bg-[#FF8EBD] text-white'
                    : 'text-white hover:bg-[#FF8EBD]/60'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;