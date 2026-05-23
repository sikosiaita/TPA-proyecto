import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo-tpa-1.PNG';

const InicioSesion: React.FC = () => {
  const [rut, setRut] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');  // ← redirige al hacer submit
    
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FF8EBD] p-4">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[30px] overflow-hidden shadow-2xl min-h-[500px]">
        
        {/* LADO IZQUIERDO (ROSADO) */}
        <div className="hidden md:flex md:w-5/12 bg-[#FFC5C5] items-center justify-center">
            <div className="w-60 h-60 mb-1">
              <img src={logo} alt="PinkBox Logo" className="w-full h-full object-contain" />
            </div>
        </div>
        

        {/* LADO DERECHO (FORMULARIO) */}
        <div className="w-full md:w-7/12 flex flex-col items-center justify-center p-6 md:p-10">
          
          {/* LOGO Y TÍTULO */}
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-2xl font-bold text-black mb-1">Iniciar sesión</h1>
            <p className="text-gray-600 text-sm">Mediante RUT</p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <div>
              <input
                type="text"
                placeholder="Ingrese RUT"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full px-6 py-3 border-2 border-black rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8EBD] transition-all text-center"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Ingrese contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full px-6 py-3 border-2 border-black rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8EBD] transition-all text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFA0A0] hover:bg-[#FF8EBD] text-white font-bold py-3 rounded-full transition-colors mt-6 shadow-md"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;