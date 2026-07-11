import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MapaDespacho from '../components/MapaInicio';
import mockData from '../data/MockData.json';
import { Envio } from '../domain/envio/Envio';
import { envioService } from '../domain/envio/EnvioService';
import { EstadoEnvio } from '../domain/envio/EstadoEnvio';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

// ── Estadísticas de inventario (catálogo general, MockData) ──────
const totalItems = mockData.item.length;
const pesoTotal = mockData.item.reduce((acc: number, i: any) => acc + i.pesoKg, 0);
const volumenTotal = mockData.item.reduce((acc: number, i: any) => acc + i.volumen, 0);

export default function Dashboard() {
  // ── Envíos REALES, sincronizados con el mismo EnvioService (Observer) que EstadoEntrega.tsx ──
  const [listaEnvios, setListaEnvios] = useState<Envio[]>(() => envioService.getEnvios());

  useEffect(() => {
    const actualizarObservador = (enviosActualizados: Envio[]) => {
      setListaEnvios(enviosActualizados);
    };
    envioService.suscribir(actualizarObservador);
    return () => envioService.desuscribir(actualizarObservador);
  }, []);

  // ── Derivados desde los envíos reales, ya no desde mockData.rutas ──
  const transportesActivos = listaEnvios.filter((e) => e.estaActivo()).length;
  const enTransito = listaEnvios.filter((e) => e.estado === EstadoEnvio.EN_TRANSITO).length;
  const entregados = listaEnvios.filter((e) => e.estado === EstadoEnvio.ENTREGADO).length;
  const enviosActivos = listaEnvios.filter((e) => e.estaActivo());

  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* Tarjetas de estadísticas — orden y textos calcados del mockup */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Package className="text-blue-500" size={28} />
            <div>
              <p className="text-xs text-gray-700">Inventario Total</p>
              <p className="text-xl font-bold">{totalItems}</p>
              <p className="text-xs text-gray-600">{pesoTotal.toFixed(1)}kg / {volumenTotal.toFixed(1)}m³</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Truck className="text-purple-500" size={28} />
            <div>
              <p className="text-xs text-gray-700">Transportes Activos</p>
              <p className="text-xl font-bold">{transportesActivos}</p>
              <p className="text-xs text-gray-600">{enTransito} en tránsito</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500" size={28} />
            <div>
              <p className="text-xs text-gray-700">Entregados</p>
              <p className="text-xl font-bold">{entregados}</p>
              <p className="text-xs text-gray-600">Completados</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Clock className="text-orange-400" size={28} />
            <div>
              <p className="text-xs text-gray-700">En Tránsito</p>
              <p className="text-xl font-bold">{enTransito}</p>
              <p className="text-xs text-gray-600">Activos ahora</p>
            </div>
          </div>
        </div>

        {/* Mapa + panel de envíos activos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MapaDespacho />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Envíos Activos</h2>
            {enviosActivos.length === 0 ? (
              <p className="text-sm text-gray-600">No hay envíos activos</p>
            ) : (
              <ul className="space-y-3">
                {enviosActivos.map((envio) => (
                  <li key={envio.id} className="text-sm border-b pb-2 last:border-0">
                    <p className="font-mono">{envio.id}</p>
                    <p className="text-gray-700">{envio.origen} → {envio.destino}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      {envio.estado}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
