import React, { useState } from 'react';

const LoginScreen: React.FC = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', rut, password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FF8EBD] p-4">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[30px] overflow-hidden shadow-2xl min-h-[500px]">
        
        {/* LADO IZQUIERDO (ROSADO) */}
        <div className="hidden md:block md:w-5/12 bg-[#FFC5C5]" />

        {/* LADO DERECHO (FORMULARIO) */}
        <div className="w-full md:w-7/12 flex flex-col items-center justify-center p-8 md:p-16">
          
          {/* LOGO Y TÍTULO */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 mb-2">
              {/* Aquí va tu SVG o Imagen de PinkBox */}
              <img src="/logo-pinkbox.png" alt="PinkBox Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-[#FF8EBD] font-semibold text-sm mb-4">PinkBox</span>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-3 border-2 border-black rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8EBD] transition-all text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFA0A0] hover:bg-[#FF8EBD] text-white font-bold py-3 rounded-full transition-colors mt-6 shadow-md"
            >
              Continuar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;