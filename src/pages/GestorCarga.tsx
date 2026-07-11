import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import mockData from '../data/MockData.json';
import { cargaService, CAPACIDAD_MAX, ItemCargado } from '../domain/carga/CargaService';

const TARIFA_KG = 300;
const COSTO_SEGURO = 1000;
const COSTO_FRAGIL = 1000;
const COSTO_IMPUESTO = 300;

const GestorCarga: React.FC = () => {

  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  // ── Carga compartida (Observer), en vez de estado local aislado ──
  const [listaItems, setListaItems] = useState<ItemCargado[]>(() => cargaService.getItems());

  useEffect(() => {
    const actualizarObservador = (itemsActualizados: ItemCargado[]) => {
      setListaItems(itemsActualizados);
    };
    cargaService.suscribir(actualizarObservador);
    return () => cargaService.desuscribir(actualizarObservador);
  }, []);

  const volumenTotal = listaItems.reduce((acc, i) => acc + i.volumen, 0);
  const capacidadRestante = CAPACIDAD_MAX - volumenTotal;

  // Costos adicionales por ítem expandido
  const [costosSeleccionados, setCostosSeleccionados] = useState<{
    [id: string]: { seguro: boolean; fragil: boolean; impuesto: boolean }
  }>({});

  // Estado para el modal de confirmación
  const [modalEstado, setModalEstado] = useState<'oculto' | 'visible' | 'saliendo'>('oculto');
  const modalTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleItem = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  const toggleCosto = (itemId: string, costo: 'seguro' | 'fragil' | 'impuesto') => {
    setCostosSeleccionados(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] ?? { seguro: false, fragil: false, impuesto: false }),
        [costo]: !(prev[itemId]?.[costo] ?? false),
      }
    }));
  };

  const calcularCostoAdicional = (itemId: string) => {
    const sel = costosSeleccionados[itemId];
    if (!sel) return 0;
    return (sel.seguro ? COSTO_SEGURO : 0)
      + (sel.fragil ? COSTO_FRAGIL : 0)
      + (sel.impuesto ? COSTO_IMPUESTO : 0);
  };

  const handleAgregarAlContenedor = (itemJson: any) => {
    const precioBase = Math.round(itemJson.pesoKg * TARIFA_KG);
    const costoAdicional = calcularCostoAdicional(itemJson.id);

    const agregado = cargaService.agregarItem(itemJson, precioBase, costoAdicional);

    if (!agregado) {
      alert(`¡El ítem es muy grande! Solo queda ${capacidadRestante.toFixed(2)}m³ de capacidad.`);
      return;
    }

    console.log(`Ítem agregado. Precio base: $${precioBase}, Costo adicional: $${costoAdicional}`);
  };

  const handleEliminarItem = (index: number) => {
    cargaService.eliminarItem(index);
  };

  const handleGuardar = () => {
    if (modalTimer.current) clearTimeout(modalTimer.current);
    setModalEstado('visible');
    modalTimer.current = setTimeout(() => {
      setModalEstado('saliendo');
      setTimeout(() => setModalEstado('oculto'), 280);
    }, 2800);
  };

  // Totales calculados
  const totalPrecioBase = listaItems.reduce((acc, i) => acc + i.precioBase, 0);
  const totalCostoAdicional = listaItems.reduce((acc, i) => acc + i.costoAdicional, 0);
  const totalGeneral = listaItems.reduce((acc, i) => acc + i.total, 0);

  return (
    <Layout>

      {/* MODAL DE CONFIRMACIÓN */}
      {modalEstado !== 'oculto' && (
        <div
          className="flex items-center justify-center"
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
        >
          <div
            className="flex flex-col items-center gap-4 rounded-2xl px-12 py-10"
            style={{
              backgroundColor: '#D4537E',
              width: 240,
              pointerEvents: 'auto',
              animation: modalEstado === 'visible'
                ? 'modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1) forwards'
                : 'modalOut 0.28s ease forwards',
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 68, height: 68,
                backgroundColor: 'rgba(255,255,255,0.25)',
                animation: 'circleGrow 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" style={{ overflow: 'visible' }}>
                <polyline
                  points="5,15 12,22 25,8"
                  stroke="white" strokeWidth="3" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ strokeDasharray: 60, strokeDashoffset: 0, animation: 'checkDraw 0.4s 0.25s ease forwards' }}
                />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-0.5" style={{ animation: 'textUp 0.3s 0.3s ease both' }}>
              <p className="font-bold uppercase tracking-widest text-white text-sm m-0">Carga</p>
              <p className="font-bold uppercase tracking-widest text-white text-sm m-0">Guardada</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full min-h-screen flex flex-col text-gray-800">

        {/* TÍTULO */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold uppercase tracking-wide">Crear Carga</h1>
        </div>

        {/* CONTENEDOR INFERIOR */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12">

          {/* LADO IZQUIERDO */}
          <div className="lg:col-span-5 border-r border-gray-200 flex flex-col h-full">

            <div className="p-6 pb-2">
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">Centro de distribución - Salida</label>
                <select className="w-full bg-white border border-gray-200 text-gray-800 py-1.5 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer" defaultValue="pto-montt">
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pto-montt">Centro - Pto. Montt</option>
                  <option value="castro">Centro - Castro</option>
                  <option value="osorno">Centro - Osorno</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">Centro de distribución - Destino</label>
                <select className="w-full bg-white border border-gray-200 text-gray-800 py-1.5 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer" defaultValue="castro">
                  <option value="" disabled>Seleccione un centro...</option>
                  <option value="pto-montt">Centro - Pto. Montt</option>
                  <option value="castro">Centro - Castro</option>
                  <option value="osorno">Centro - Osorno</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">Tipo de contenedor</label>
                <select className="w-full bg-white border border-gray-200 text-gray-800 py-1.5 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer" defaultValue="pallet">
                  <option value="" disabled>Seleccione un tipo de contenedor...</option>
                  <option value="pallet">Pallet</option>
                  <option value="caja">Caja</option>
                </select>
              </div>
            </div>

            <div className="px-6 pb-6 flex-grow flex flex-col overflow-hidden">
              <h3 className="font-bold text-gray-800 text-sm mb-2">Items</h3>
              <div className="flex-grow overflow-y-auto pr-1">
                <div className="border border-gray-200 bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {mockData.item.map((item) => (
                      <div key={item.id} className="flex flex-col">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="text-left font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 py-1.3 px-2 rounded-md transition border border-gray-200 flex justify-between items-center"
                        >
                          {item.descripcion}
                          <span className="text-xl text-gray-500 font-normal">
                            {itemExpandido === item.id ? '-' : '+'}
                          </span>
                        </button>

                        {itemExpandido === item.id && (
                          <div className="border-t-2 border-b-2 border-black py-4 mt-2 px-2 animate-fade-in">
                            <div className="flex gap-4 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                              <p>Tipo: <span className="text-gray-800">{item.tipo}</span></p>
                              <p>Peso: <span className="text-gray-800">{item.pesoKg} kg</span></p>
                              <p>Volumen: <span className="text-gray-800">{item.volumen} m³</span></p>
                            </div>

                            {/* Precio base calculado */}
                            <div className="mb-3 pl-2">
                              <p className="text-xs text-gray-700">
                                Precio base: <span className="font-bold text-gray-800">${Math.round(item.pesoKg * TARIFA_KG).toLocaleString('es-CL')}</span>
                                <span className="text-gray-600 ml-1">({item.pesoKg} kg × ${TARIFA_KG})</span>
                              </p>
                            </div>

                            <div className="mb-5 pl-2">
                              <p className="font-bold text-sm text-gray-800 mb-2">Costo adicional</p>
                              <div className="flex flex-col gap-1.5 w-3/4">
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center justify-between gap-2 transition">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="accent-pink-500 w-3.5 h-3.5"
                                      checked={!!costosSeleccionados[item.id]?.seguro}
                                      onChange={() => toggleCosto(item.id, 'seguro')}
                                    />
                                    Seguro
                                  </div>
                                  <span className="text-xs text-gray-600">+${COSTO_SEGURO.toLocaleString('es-CL')}</span>
                                </label>
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center justify-between gap-2 transition">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="accent-pink-500 w-3.5 h-3.5"
                                      checked={!!costosSeleccionados[item.id]?.fragil}
                                      onChange={() => toggleCosto(item.id, 'fragil')}
                                    />
                                    Manejo Frágil
                                  </div>
                                  <span className="text-xs text-gray-600">+${COSTO_FRAGIL.toLocaleString('es-CL')}</span>
                                </label>
                                <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1 rounded text-sm text-gray-700 flex items-center justify-between gap-2 transition">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="accent-pink-500 w-3.5 h-3.5"
                                      checked={!!costosSeleccionados[item.id]?.impuesto}
                                      onChange={() => toggleCosto(item.id, 'impuesto')}
                                    />
                                    Impuesto Territorial
                                  </div>
                                  <span className="text-xs text-gray-600">+${COSTO_IMPUESTO.toLocaleString('es-CL')}</span>
                                </label>
                              </div>
                            </div>

                            <div className="flex justify-center mt-2">
                              <button
                                onClick={() => handleAgregarAlContenedor(item)}
                                className="border border-black text-black font-bold text-xs py-1.5 px-6 rounded-md uppercase tracking-wide hover:bg-gray-100 transition"
                              >
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

          {/* LADO DERECHO */}
          <div className="lg:col-span-7 p-6 flex flex-col self-start">

            {/* TABLA */}
            <div className="bg-[#FFAEC1] p-5 rounded-xl flex-grow min-h-[350px] flex flex-col mb-6">
              <div className="grid grid-cols-7 gap-2 bg-white/40 p-2.5 rounded-lg text-center font-bold text-gray-800 text-xs mb-3 shadow-sm uppercase tracking-wider">
                <div>Código</div>
                <div>Tipo</div>
                <div>Volumen</div>
                <div>Precio B.</div>
                <div>Costo A.</div>
                <div>Total</div>
                <div></div>
              </div>

              <div className="flex-grow space-y-2 overflow-y-auto max-h-[350px] pr-1">
                {listaItems.length === 0 ? (
                  <div className="bg-white/70 h-full min-h-[200px] border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center text-gray-500 text-sm italic p-4 text-center">
                    El contenedor está vacío. <br /> Agrega ítems desde el panel izquierdo.
                  </div>
                ) : (
                  <div className="bg-white/90 flex-grow min-h-[220px] rounded-lg p-2 shadow-sm divide-y divide-gray-100">
                    {listaItems.map((item, index) => (
                      <div
                        key={item.id + "-" + index}
                        className="grid grid-cols-7 gap-2 py-3 text-center text-gray-600 text-xs items-center hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="font-bold text-gray-800">{item.id}</div>
                        <div className="font-bold text-gray-800">{item.tipo}</div>
                        <div className="font-bold text-gray-800">{item.volumen}</div>
                        <div className="font-bold text-gray-800">${item.precioBase.toLocaleString('es-CL')}</div>
                        <div className="font-bold text-gray-800">${item.costoAdicional.toLocaleString('es-CL')}</div>
                        <div className="font-bold text-gray-800">${item.total.toLocaleString('es-CL')}</div>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleEliminarItem(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors font-bold text-base leading-none"
                            title="Eliminar ítem"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ZONA INFERIOR */}
            <div className="flex flex-col gap-4 mt-2">

              {/* Fila: Capacidad + Resumen de costos */}
              <div className="flex gap-4 flex-wrap">

                {/* Capacidad restante */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 w-56 flex flex-col gap-2 shadow-sm">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Capacidad restante</span>
                  <span className="text-2xl font-bold text-gray-800">{capacidadRestante.toFixed(2)} m³</span>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${(capacidadRestante / CAPACIDAD_MAX) * 100}%`,
                        backgroundColor:
                          capacidadRestante > 0.5 ? '#FFAEC1'
                          : capacidadRestante > 0.2 ? '#ED93B1'
                          : '#993556',
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {((capacidadRestante / CAPACIDAD_MAX) * 100).toFixed(0)}% disponible
                  </span>
                </div>

                {/* Resumen de costos */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex-grow flex flex-col gap-3 shadow-sm">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Resumen de costos</span>

                  <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Precio base</span>
                      <span className="font-bold text-gray-800">${totalPrecioBase.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costos adicionales</span>
                      <span className="font-bold text-gray-800">${totalCostoAdicional.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-1 pt-2 flex justify-between">
                      <span className="font-bold text-gray-700 uppercase tracking-wide">Total</span>
                      <span className="font-bold text-[#D4537E] text-sm">${totalGeneral.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Botón Guardar */}
              <button
                onClick={handleGuardar}
                disabled={listaItems.length === 0}
                className="bg-[#D4537E] text-white py-2 px-8 rounded-lg font-bold uppercase tracking-widest shadow hover:bg-[#993556] transition-colors text-sm w-fit disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.88); }
        }
        @keyframes circleGrow {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes textUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </Layout>
  );
};

export default GestorCarga;
