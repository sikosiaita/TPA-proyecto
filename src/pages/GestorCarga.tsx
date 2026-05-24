import React from 'react';
import Layout from '../components/Layout';

const GestorCarga: React.FC = () => {
  return (
    <Layout>
      {/* CONTENEDOR MAESTRO: 
        Se eliminó el margen (m-6) y el borde redondeado (rounded-md).
        Ahora abarca el 100% del ancho y alto disponible. 
      */}
      <div className="bg-white w-full h-full min-h-screen flex flex-col text-gray-800">

        {/* =========================================================
            1. TÍTULO SUPERIOR
           ========================================================= */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Crear Carga
          </h1>
        </div>

        {/* =========================================================
            2. ZONA DE TRABAJO INFERIOR
           ========================================================= */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12">

          {/* --- PANEL IZQUIERDO (Ocupa 5/12) --- */}
          <div className="lg:col-span-5 border-r border-gray-200 flex flex-col">
            
            {/* Mitad superior izquierda: Selectores */}
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 h-40 rounded flex items-center justify-center text-gray-400 text-sm font-bold text-center">
                1. Selectores de Centros y Contenedor
              </div>
            </div>

            {/* Línea gris horizontal que divide Selectores de los Ítems */}
            <hr className="border-gray-200" />

            {/* Mitad inferior izquierda: Ítems */}
            <div className="p-6 flex-grow">
              <div className="border-2 border-dashed border-gray-300 h-full min-h-[250px] rounded flex items-center justify-center text-gray-400 text-sm font-bold text-center p-4">
                2. Ingreso de Items y Costos
              </div>
            </div>

          </div>

          {/* --- PANEL DERECHO (Ocupa 7/12) --- */}
          <div className="lg:col-span-7 p-6 flex flex-col">

            {/* Bloque Rosado de la Tabla */}
            <div className="bg-pink-100 p-5 rounded-xl flex-grow min-h-[350px] flex flex-col mb-6">
              <div className="border-2 border-dashed border-pink-300 bg-white/70 h-full rounded flex items-center justify-center text-pink-400 font-bold text-center p-4">
                3. Tabla de Contenidos (Fondo rosado)
              </div>
            </div>

            {/* Zona Inferior: Capacidad y Botón Guardar */}
            <div className="h-32 flex flex-col justify-between">
              
              {/* Capacidad Restante */}
              <div className="w-48 border-2 border-dashed border-gray-300 h-16 rounded flex items-center justify-center text-gray-400 text-xs font-bold">
                4. Capacidad Restante
              </div>
              
              {/* Botón Guardar (Centrado abajo) */}
              <div className="flex justify-center mt-4">
                <div className="w-40 border-2 border-dashed border-gray-300 h-10 rounded flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                  Botón Guardar
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
};

export default GestorCarga;