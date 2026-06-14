import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Envio } from '../domain/envio/Envio'; 
import { EstadoEnvio } from '../domain/envio/EstadoEnvio'; 

// Datos mockeados para visualizar la interfaz.
const MOCK_ENVIOS: Envio[] = [
  new Envio('ENV-001', 'Centro Pto. Montt', 'Castro', 'Camión', EstadoEnvio.EN_PREPARACION, '2 Días'),
  new Envio('ENV-002', 'Centro Osorno', 'Pto. Varas', 'Dron', EstadoEnvio.EN_TRANSITO, '3 Horas'),
  new Envio('ENV-003', 'Centro Castro', 'Chonchi', 'Moto', EstadoEnvio.ENTREGADO, null),
  new Envio('ENV-004', 'Centro Pto. Montt', 'Ancud', 'Camión', EstadoEnvio.FALLIDO, null),
  new Envio('ENV-005', 'Centro Castro', 'Quellón', 'Camión', EstadoEnvio.EN_TRANSITO, '5 Horas'),
];

// Helper para los colores de los puntos de estado según el mockup
const obtenerColorPunto = (estado: EstadoEnvio | string) => {
  switch (estado) {
    case EstadoEnvio.EN_TRANSITO: return '#3b82f6'; // Azul
    case EstadoEnvio.EN_PREPARACION: return '#f97316'; // Naranja
    case EstadoEnvio.ENTREGADO: return '#22c55e'; // Verde
    case EstadoEnvio.FALLIDO: return '#ef4444'; // Rojo
    default: return '#9ca3af'; // Gris
  }
};

const EstadoEntrega: React.FC = () => {
  const [busquedaId, setBusquedaId] = useState<string>('');
  
  // Filtrado de envíos básico (solo para la demostración del buscador)
  const enviosFiltrados = useMemo(() => {
    return MOCK_ENVIOS.filter((envio) => {
      return envio.id.toLowerCase().includes(busquedaId.toLowerCase());
    });
  }, [busquedaId]);

  return (
    <Layout>
      <div className="w-full h-full min-h-screen flex flex-col bg-[#F3F4F6] text-gray-800">
        
        {/* TÍTULO */}
        <div className="px-8 py-5 border-b border-gray-200 bg-[#F3F4F6]">
          <h1 className="text-xl font-bold uppercase tracking-wide">Estados de Entregas</h1>
        </div>

        {/* CONTROLES: Buscador y Filtros */}
        <div className="flex justify-center items-center gap-8 py-8 bg-[#F3F4F6]">
          
          {/* Input Búsqueda */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="ID de Envío"
              className="w-full bg-white border border-gray-400 text-gray-800 py-2 px-4 rounded-md shadow-sm focus:outline-none focus:border-pink-400 text-center text-sm"
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Botón Filtros */}
          <button className="relative w-64 bg-white border border-gray-400 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 flex items-center justify-center text-sm transition-colors">
            <span className="flex-grow text-center">Filtros</span>
            <div className="absolute right-3 text-gray-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </div>
          </button>
        </div>

        {/* CONTENEDOR TABLA */}
        <div className="px-8 pb-8 flex-grow flex flex-col bg-[#F3F4F6]">
          <div className="bg-[#FFAEC1] p-6 rounded-xl flex-grow shadow-sm flex flex-col">
            
            {/* Cabecera de la Tabla */}
            <div className="grid grid-cols-7 gap-2 bg-[#ffc1d1] p-3 rounded-t-xl text-center text-gray-800 text-sm border-b border-pink-200">
              <div>ID de Envío</div>
              <div>Origen</div>
              <div>Destino</div>
              <div>Transporte</div>
              <div>Estado</div>
              <div className="leading-tight">Tiempo aprox<br/>entrega</div>
              <div>Acción</div>
            </div>

            {/* Cuerpo de la Tabla */}
            <div className="bg-white rounded-b-xl shadow-sm flex-grow">
              {enviosFiltrados.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  No se encontraron resultados.
                </div>
              ) : (
                <div className="flex flex-col">
                  {enviosFiltrados.map((envio, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 gap-2 py-4 text-center text-gray-700 text-sm items-center border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
                    >
                      <div>{envio.id}</div>
                      <div>{envio.origen}</div>
                      <div>{envio.destino}</div>
                      <div>{envio.transporte}</div>
                      
                      {/* Estado con punto de color */}
                      <div className="flex items-center justify-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: obtenerColorPunto(envio.estado) }}
                        ></span>
                        <span>{envio.estado}</span>
                      </div>
                      
                      <div>{envio.tiempoEstimado || '-'}</div>
                      
                      {/* Acción (Lupa) */}
                      <div className="flex justify-center">
                        <button className="text-gray-500 hover:text-[#D4537E] transition-colors">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Espacio en blanco simulando el resto de la tabla vacía como en el mockup */}
                  <div className="h-40 bg-white rounded-b-xl"></div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default EstadoEntrega;