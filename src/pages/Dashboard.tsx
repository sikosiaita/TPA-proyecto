import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import mockData from '../data/MockData.json';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

// ── Estadísticas derivadas del MockData ──────────────────────────
const totalItems = mockData.item.length;
const pesoTotal = mockData.item.reduce((acc: number, i: any) => acc + i.pesoKg, 0);
const volumenTotal = mockData.item.reduce((acc: number, i: any) => acc + i.volumen, 0);
const totalRutas = mockData.rutas.length;

const ENVIOS_ACTIVOS = mockData.rutas.map((r: any, idx: number) => ({
  id: `ENV-00${idx + 1}`,
  ruta: r,
  estado: idx === 0 ? 'En tránsito' : 'Completado',
  vehiculo: idx === 0 ? 'Camión' : 'Moto',
}));

const enTransito = ENVIOS_ACTIVOS.filter((e: any) => e.estado === 'En tránsito').length;
const completados = ENVIOS_ACTIVOS.filter((e: any) => e.estado === 'Completado').length;

// ── Coordenadas en el SVG del mapa (posiciones relativas) ─────────
const NODOS: Record<string, { x: number; y: number; label: string }> = {
  'Pto. Montt':   { x: 200, y: 80,  label: 'Pto. Montt' },
  'Puerto Montt': { x: 200, y: 80,  label: 'Pto. Montt' },
  'Osorno':       { x: 220, y: 40,  label: 'Osorno' },
  'Castro':       { x: 160, y: 180, label: 'Castro' },
  'Santiago':     { x: 260, y: 320, label: 'Santiago' },
};

// ── Componente marcador animado sobre SVG ─────────────────────────
interface MarcadorSVGProps {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
}

// ── pega esto al final de Dashboard.tsx, después de la línea 38 ──

function MarcadorSVG({ x1, y1, x2, y2, color }: MarcadorSVGProps) {
  return (
    <circle r="6" fill={color} opacity="0.9">
      <animateMotion dur="3s" repeatCount="indefinite">
        <mpath xlinkHref="#ruta-linea" />
      </animateMotion>
    </circle>
  );
}

export default function Dashboard() {
  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Package className="text-pink-500" size={28} />
            <div>
              <p className="text-xs text-gray-500">Total ítems</p>
              <p className="text-xl font-bold">{totalItems}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Truck className="text-orange-400" size={28} />
            <div>
              <p className="text-xs text-gray-500">En tránsito</p>
              <p className="text-xl font-bold">{enTransito}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500" size={28} />
            <div>
              <p className="text-xs text-gray-500">Completados</p>
              <p className="text-xl font-bold">{completados}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Clock className="text-blue-400" size={28} />
            <div>
              <p className="text-xs text-gray-500">Rutas totales</p>
              <p className="text-xl font-bold">{totalRutas}</p>
            </div>
          </div>
        </div>

        {/* Tabla de envíos */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Envíos activos</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">ID</th>
                <th className="pb-2">Origen → Destino</th>
                <th className="pb-2">Vehículo</th>
                <th className="pb-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ENVIOS_ACTIVOS.map((envio) => (
                <tr key={envio.id} className="border-b last:border-0">
                  <td className="py-2 font-mono">{envio.id}</td>
                  <td className="py-2">{envio.ruta.origen} → {envio.ruta.destino}</td>
                  <td className="py-2">{envio.vehiculo}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      envio.estado === 'En tránsito'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {envio.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats extras */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">Peso total cargado</p>
            <p className="text-2xl font-bold">{pesoTotal} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">Volumen total</p>
            <p className="text-2xl font-bold">{volumenTotal} <span className="text-sm font-normal text-gray-400">m³</span></p>
          </div>
        </div>

      </div>
    </Layout>
  );
}