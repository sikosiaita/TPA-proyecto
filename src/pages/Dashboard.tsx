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

const MarcadorSVG: React.FC<MarcadorSVGProps> = ({ x1, y1, x2, y2, color }) => {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const inicioRef = useRef<number | null>(null);
  const duracion = 4000;

  useEffect(() => {
    const animar = (timestamp: number) => {
      if (!inicioRef.current) inicioRef.current = timestamp;
      const elapsed = timestamp - inicioRef.current;
      const progress = Math.min(elapsed / duracion, 1);
      setT(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animar);
      } else {
        setTimeout(() => {
          inicioRef.current = null;
          setT(0);
          rafRef.current = requestAnimationFrame(animar);
        }, 1000);
      }
    };
    rafRef.current = requestAnimationFrame(animar);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [x1, y1, x2, y2]);

  const cx = x1 + (x2 - x1) * t;
  const cy = y1 + (y2 - y1) * t;

  return (
    <circle cx={cx} cy={cy} r={6} fill={color} stroke="white" strokeWidth={2}>
      <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
    </circle>
  );
};

