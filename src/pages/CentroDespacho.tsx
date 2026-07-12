import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import mockData from '../data/MockData.json';
import { VEHICULOS } from '../data/MockDataVehiculos';
import { Transporte } from '../domain/transporte/Transporte';
import { crearEstrategia } from '../domain/transporte/FactoryTransporte';
import { envioService } from '../domain/envio/EnvioService';
import { cargaService, ItemCargado, CargaState, TipoContenedor } from '../domain/carga/CargaService';

type VehiculoKey = keyof typeof VEHICULOS;

const ETIQUETA_CONTENEDOR: Record<TipoContenedor, string> = {
  pallet: 'Pallet',
  caja: 'Caja',
  sobre: 'Sobre'
};

const CentroDespacho: React.FC = () => {

  const [itemExpandido, setItemExpandido] = useState<string | null>(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<VehiculoKey | null>(null);

  const [modalEstado, setModalEstado] = useState<'oculto' | 'visible' | 'saliendo'>('oculto');
  const modalTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Carga compartida: ya no se arma acá, se lee de lo que hiciste en Gestor de Carga ──
  const [itemsCarga, setItemsCarga] = useState<ItemCargado[]>(() => cargaService.getItems());
  const [rutaId, setRutaId] = useState<string>(() => cargaService.getRutaId());
  const [tipoContenedor, setTipoContenedor] = useState<TipoContenedor>(() => cargaService.getTipoContenedor());

  useEffect(() => {
    const actualizarObservador = (estado: CargaState) => {
      setItemsCarga(estado.items);
      setRutaId(estado.rutaId);
      setTipoContenedor(estado.tipoContenedor);
    };
    cargaService.suscribir(actualizarObservador);
    return () => cargaService.desuscribir(actualizarObservador);
  }, []);

  // La ruta ya no se elige aquí — solo se muestra la que se fijó en Gestor de Carga.
  const ruta = mockData.rutas.find(r => r.id === rutaId) ?? mockData.rutas[0];

  const volumenTotal = itemsCarga.reduce((acc, i) => acc + i.volumen, 0);

  // El tipo de contenedor (Pallet/Caja) ahora SÍ entra al cálculo de qué vehículo puede llevarla,
  // igual que los tipos de los ítems (Sobre/Caja). Por eso un Pallet, aunque vaya casi vacío,
  // queda filtrado a solo Camión (es el único con 'Pallet' en tiposPermitidos).
  const tiposEnCarga = [...new Set([ETIQUETA_CONTENEDOR[tipoContenedor], ...itemsCarga.map(i => i.tipo)])];

  const toggleItem = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  const vehiculoDisponible = (key: VehiculoKey) => {
    const v = VEHICULOS[key];
    if (volumenTotal > v.capacidadMax) return false;
    return tiposEnCarga.every(t => v.tiposPermitidos.includes(t as any));
  };

  // Recomienda el vehículo más pequeño/económico que sea capaz de llevar la carga completa.
  const vehiculoRecomendado = (): VehiculoKey | null => {
    const orden: VehiculoKey[] = ['dron', 'moto', 'camion'];
    return orden.find(key => vehiculoDisponible(key)) ?? null;
  };

  const calcularCostoVehiculo = (key: VehiculoKey) => {
    const estrategia = crearEstrategia(key);
    const miTransporte = new Transporte(key, key, estrategia);
    return miTransporte.obtenerCostoEnvio(ruta.distanciaKm);
  };

  const handleEliminarItem = (index: number) => {
    cargaService.eliminarItem(index);
  };

  const handleDespachar = () => {
    if (!vehiculoSeleccionado) return;

    envioService.crearEnvio(ruta.origen, ruta.destino, vehiculoSeleccionado);

    // La carga ya se convirtió en un Envío: se vacía para el próximo despacho.
    cargaService.vaciar();
    setVehiculoSeleccionado(null);

    if (modalTimer.current) clearTimeout(modalTimer.current);
    setModalEstado('visible');
    modalTimer.current = setTimeout(() => {
      setModalEstado('saliendo');
      setTimeout(() => setModalEstado('oculto'), 280);
    }, 2800);
  };

  const costoVehiculo = vehiculoSeleccionado ? calcularCostoVehiculo(vehiculoSeleccionado) : 0;
  const recomendado = vehiculoRecomendado();

  return (
    <Layout>

      {/* MODAL */}
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
              style={{ width: 68, height: 68, backgroundColor: 'rgba(255,255,255,0.25)', animation: 'circleGrow 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" style={{ overflow: 'visible' }}>
                <polyline points="5,15 12,22 25,8" stroke="white" strokeWidth="3" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ strokeDasharray: 60, strokeDashoffset: 0, animation: 'checkDraw 0.4s 0.25s ease forwards' }} />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-0.5" style={{ animation: 'textUp 0.3s 0.3s ease both' }}>
              <p className="font-bold uppercase tracking-widest text-white text-sm m-0">Despacho</p>
              <p className="font-bold uppercase tracking-widest text-white text-sm m-0">Confirmado</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full min-h-screen flex flex-col text-gray-800">

        {/* TÍTULO */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold uppercase tracking-wide">Centro de Despacho</h1>
        </div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12">

          {/* LADO IZQUIERDO */}
          <div className="lg:col-span-5 border-r border-gray-200 flex flex-col h-full">

            <div className="p-6 pb-2">
              {/* Ruta — de solo lectura, ya fijada en Gestor de Carga */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">Ruta de despacho</label>
                <div className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-md shadow-sm flex items-center justify-between">
                  <span>{ruta.origen} → {ruta.destino}</span>
                  <span className="text-xs text-gray-500">{ruta.distanciaKm} km</span>
                </div>
                <span className="text-[11px] text-gray-400">Se elige en Gestor de Carga.</span>
              </div>

              {/* Tipo de contenedor — de solo lectura, ya fijado en Gestor de Carga */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-gray-800 text-sm">Tipo de contenedor</label>
                <div className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-md shadow-sm">
                  {ETIQUETA_CONTENEDOR[tipoContenedor]}
                </div>
              </div>
            </div>

            {/* LISTA DE ÍTEMS — solo lectura */}
            <div className="px-6 pb-6 flex-grow flex flex-col overflow-hidden">
              <h3 className="font-bold text-gray-800 text-sm mb-2">Ítems a despachar</h3>
              <div className="flex-grow overflow-y-auto pr-1">
                <div className="border border-gray-200 bg-white p-2 rounded-lg shadow-sm">
                  {itemsCarga.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm italic">
                      Sin ítems.<br />Agrega desde Gestor de Carga.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                      {itemsCarga.map((item) => (
                        <div key={item.id} className="flex flex-col">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="text-left font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 py-1.5 px-2 rounded-md transition border border-gray-200 flex justify-between items-center"
                          >
                            {item.descripcion}
                            <span className="text-xl text-gray-500 font-normal">
                              {itemExpandido === item.id ? '-' : '+'}
                            </span>
                          </button>

                          {itemExpandido === item.id && (
                            <div className="border-t-2 border-b-2 border-black py-4 mt-2 px-2">
                              <div className="flex gap-4 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                                <p>Tipo: <span className="text-gray-800">{item.tipo}</span></p>
                                <p>Peso: <span className="text-gray-800">{item.pesoKg} kg</span></p>
                                <p>Volumen: <span className="text-gray-800">{item.volumen} m³</span></p>
                              </div>
                              <div className="flex justify-center mt-2">
                                <button
                                  onClick={() => handleEliminarItem(itemsCarga.indexOf(item))}
                                  className="border border-black text-black font-bold text-xs py-1.5 px-6 rounded-md uppercase tracking-wide hover:bg-gray-100 transition"
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* LADO DERECHO */}
          <div className="lg:col-span-7 p-6 flex flex-col self-start">

            {/* TABLA DE ÍTEMS */}
            <div className="bg-[#FFAEC1] p-5 rounded-xl min-h-[220px] flex flex-col mb-6">
              <div className="grid grid-cols-5 gap-2 bg-white/40 p-2.5 rounded-lg text-center font-bold text-gray-700 text-xs mb-3 shadow-sm uppercase tracking-wider">
                <div>Código</div>
                <div>Tipo</div>
                <div>Peso</div>
                <div>Volumen</div>
                <div></div>
              </div>
              <div className="flex-grow overflow-y-auto max-h-[200px] pr-1">
                {itemsCarga.length === 0 ? (
                  <div className="bg-white/70 min-h-[120px] border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center text-gray-500 text-sm italic p-4 text-center">
                    Sin ítems. Agrega desde Gestor de Carga.
                  </div>
                ) : (
                  <div className="bg-white/90 rounded-lg p-2 shadow-sm divide-y divide-gray-100">
                    {itemsCarga.map((item, index) => (
                      <div key={item.id + "-" + index} className="grid grid-cols-5 gap-2 py-3 text-center text-xs items-center hover:bg-gray-50/50 transition-colors">
                        <div className="font-bold text-gray-800">{item.id}</div>
                        <div className="font-bold text-gray-800">{item.tipo}</div>
                        <div className="font-bold text-gray-800">{item.pesoKg} kg</div>
                        <div className="font-bold text-gray-800">{item.volumen} m³</div>
                        <div className="flex justify-center">
                          <button onClick={() => handleEliminarItem(index)} className="text-gray-400 hover:text-red-500 transition-colors font-bold text-base leading-none">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SELECCIÓN DE VEHÍCULO */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Vehículo de despacho</h3>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(VEHICULOS) as VehiculoKey[]).map(key => {
                  const v = VEHICULOS[key];
                  const { Icon } = v;
                  const disponible = vehiculoDisponible(key);
                  const esRecomendado = itemsCarga.length > 0 && recomendado === key;
                  const seleccionado = vehiculoSeleccionado === key;
                  const costo = calcularCostoVehiculo(key);

                  return (
                    <button
                      key={key}
                      disabled={!disponible}
                      onClick={() => setVehiculoSeleccionado(key)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center
                        ${seleccionado ? 'border-[#D4537E] bg-[#fff0f4] shadow-md' : 'border-gray-200 bg-white hover:border-pink-300'}
                        ${!disponible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {esRecomendado && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#D4537E] text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap">
                          Recomendado
                        </span>
                      )}

                      {/* ÍCONO */}
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 48, height: 48,
                          backgroundColor: seleccionado ? '#FFAEC1' : '#f3f4f6',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <Icon size={24} color={seleccionado ? '#993556' : '#6b7280'} strokeWidth={1.8} />
                      </div>

                      <span className="font-bold text-gray-800 text-sm">{v.nombre}</span>
                      <span className="text-[10px] text-gray-600">{v.descripcion}</span>
                      <div className="text-xs text-gray-600 mt-1 flex flex-col gap-0.5">
                        <span>Base: <span className="font-bold">${v.costoBase.toLocaleString('es-CL')}</span></span>
                        <span>+${v.costoPorKm.toLocaleString('es-CL')}/km</span>
                        <span className="text-[#D4537E] font-bold mt-1">
                          Total: ${costo.toLocaleString('es-CL')}
                        </span>
                      </div>
                      {!disponible && (
                        <span className="text-[10px] text-red-500 font-bold mt-1">No compatible con esta carga</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ZONA INFERIOR */}
            <div className="flex gap-4 flex-wrap mb-4">

              {/* Volumen total */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 w-52 flex flex-col gap-2 shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Volumen total</span>
                <span className="text-2xl font-bold text-gray-800">{volumenTotal.toFixed(2)} m³</span>
                {vehiculoSeleccionado && (
                  <>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${Math.min(100, (volumenTotal / VEHICULOS[vehiculoSeleccionado].capacidadMax) * 100)}%`,
                          backgroundColor:
                            volumenTotal / VEHICULOS[vehiculoSeleccionado].capacidadMax < 0.5 ? '#FFAEC1'
                            : volumenTotal / VEHICULOS[vehiculoSeleccionado].capacidadMax < 0.85 ? '#ED93B1'
                            : '#993556',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {((volumenTotal / VEHICULOS[vehiculoSeleccionado].capacidadMax) * 100).toFixed(0)}% del {VEHICULOS[vehiculoSeleccionado].nombre}
                    </span>
                  </>
                )}
              </div>

              {/* Resumen de costos */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex-grow flex flex-col gap-3 shadow-sm">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Resumen de costos</span>
                {vehiculoSeleccionado ? (
                  <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Vehículo ({VEHICULOS[vehiculoSeleccionado].nombre})</span>
                      <span className="font-bold text-gray-800">${VEHICULOS[vehiculoSeleccionado].costoBase.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distancia ({ruta.distanciaKm} km × ${VEHICULOS[vehiculoSeleccionado].costoPorKm.toLocaleString('es-CL')})</span>
                      <span className="font-bold text-gray-800">${(VEHICULOS[vehiculoSeleccionado].costoPorKm * ruta.distanciaKm).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-1 pt-2 flex justify-between">
                      <span className="font-bold text-gray-700 uppercase tracking-wide">Total despacho</span>
                      <span className="font-bold text-[#D4537E] text-sm">${costoVehiculo.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Selecciona un vehículo para ver el costo.</p>
                )}
              </div>

            </div>

            {/* BOTÓN DESPACHAR */}
            <button
              onClick={handleDespachar}
              disabled={!vehiculoSeleccionado || itemsCarga.length === 0}
              className="bg-[#D4537E] text-white py-2 px-8 rounded-lg font-bold uppercase tracking-widest shadow hover:bg-[#993556] transition-colors text-sm w-fit disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Despachar
            </button>

          </div>

        </div>

      </div>

      {/*ANIMACIONES*/}
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
        @keyframes modalOut { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.88); } }
        @keyframes circleGrow { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }
        @keyframes checkDraw { from { stroke-dashoffset:60; } to { stroke-dashoffset:0; } }
        @keyframes textUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

    </Layout>
  );
};

export default CentroDespacho;
