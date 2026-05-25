import React, { useState } from 'react';
import Layout from '../components/Layout';
import mockData from '../data/MockData.json';

const GestorCarga: React.FC = () => {

  // Estado para guardar el 'id' del ítem que está expandido
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  // Función para abrir/cerrar la lista
  const toggleItem = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  return (
    <Layout>
      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white w-full h-full min-h-screen flex flex-col text-gray-800">

        {/* CONTENEDOR SUPERIOR: TÍTULO */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Crear Carga
          </h1>
        </div>

        {/* CONTENEDOR INFERIOR */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12">

          {/* LADO IZQUIERDO  */}
          <div className="lg:col-span-5 border-r border-gray-200 flex flex-col h-full">
            
            {/* Mitad superior izquierda: Selectores */}
            <div className="p-6 pb-2">
              {/* SELECTOR 1: CENTRO DE DISTRIBUCIÓN SALIDA */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">
                  Centro de distribución - Salida
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                  defaultValue="pto-montt"
                >
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pto-montt">Centro - Pto. Montt</option>
                  <option value="castro">Centro - Castro</option>
                  <option value="osorno">Centro - Osorno</option>
                </select>
              </div>

              {/* SELECTOR 2: CENTRO DE DISTRIBUCIÓN DESTINO */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">
                  Centro de distribución - Destino
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                  defaultValue="castro"
                >
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pto-montt">Centro - Pto. Montt</option>
                  <option value="castro">Centro - Castro</option>
                  <option value="osorno">Centro - Osorno</option>
                </select>
              </div>

              {/* SELECTOR 3: TIPO DE CONTENEDOR */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">
                  Tipo de contenedor
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                  defaultValue="pallet"
                >
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pallet">Pallet</option>
                  <option value="caja">Caja</option>
                </select>
              </div>
            </div>

            {/* Mitad inferior izquierda: Ítems */}
            <div className="px-6 pb-6 flex-grow flex flex-col overflow-hidden">
              <h3 className="font-bold text-gray-800 text-sm mb-2">Items</h3>
              
              {/* SI LA CANTIDAD DE ITEMS SOBREPASA EL TAMAÑO DE LA CAJA, HABILITA LA BARRA DE DESPLAZAMIENTO */}
              <div className="flex-grow overflow-y-auto pr-1">
                
                {/* CAJA CONTENEDORA */}
                <div className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col gap-2">
                    
                    {/* RECORRE EL ARCHIVO MOCKDATA */}
                    {mockData.item.map((item) => (
                      <div key={item.id} className="flex flex-col">
                        
                        {/* Botón principal con la descripción del ítem */}
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className="text-left font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 p-3 rounded-md transition border border-gray-200 flex justify-between items-center"
                        >
                          {item.descripcion}
                          <span className="text-xl text-gray-500 font-normal">
                            {itemExpandido === item.id ? '-' : '+'}
                          </span>
                        </button>

                        {/* DETALLES QUE SE ABREN AL SELECCIONAR */}
                        {itemExpandido === item.id && (
                          <div className="border-t-2 border-b-2 border-black py-4 mt-2 px-2 animate-fade-in">
                            
                            {/* TIPO Y PESO DEL JSON */}
                            <div className="flex gap-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                              <p>Tipo: <span className="text-gray-800">{item.tipo}</span></p>
                              <p>Peso: <span className="text-gray-800">{item.pesoKg} kg</span></p>
                            </div>

                            {/* SECCIÓN DE OPCIONES: COSTOS ADICIONALES */}
                            <div className="mb-5 pl-2">
                              <p className="font-bold text-sm text-gray-800 mb-2">Costo adicional</p>
                              
                              <div className="flex flex-col gap-1.5 w-3/4">
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center gap-2 transition">
                                  <input type="checkbox" className="accent-pink-500 w-3.5 h-3.5" />
                                  Seguro
                                </label>
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center gap-2 transition">
                                  <input type="checkbox" className="accent-pink-500 w-3.5 h-3.5" />
                                  Manejo Frágil
                                </label>
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center gap-2 transition">
                                  <input type="checkbox" className="accent-pink-500 w-3.5 h-3.5" />
                                  Impuesto Territorial
                                </label>
                              </div>
                            </div>

                            {/* BOTÓN "AGREGAR" */}
                            <div className="flex justify-center mt-2">
                              <button className="border border-black text-black font-bold text-xs py-1.5 px-6 rounded-md uppercase tracking-wide hover:bg-gray-100 transition">
                                Agregar
                              </button>
                            </div>
                            
                          </div>
                        )}
                        
                      </div>
                    ))}
                  </div>
                </div>

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
                <div className="w-40 border-2 border-dashed border-gray-300 h-10 rounded flex items-center justify-center text-gray-400 text-xs font-bold uppercase cursor-pointer hover:bg-gray-50 transition">
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