import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface CentroDistribucion {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

const CENTROS: CentroDistribucion[] = [
  { id: 'pmt', nombre: 'Puerto Montt', lat: -41.4693, lng: -72.9424 },
  { id: 'oso', nombre: 'Osorno',       lat: -40.5739, lng: -73.1197 },
  { id: 'cas', nombre: 'Castro',       lat: -42.4821, lng: -73.7616 },
  { id: 'stg', nombre: 'Santiago',     lat: -33.4489, lng: -70.6693 },
];

// Icono personalizado con paleta rosada
const iconoCentro = new L.DivIcon({
  className: '',
  html: `<div style="
    width: 18px; height: 18px; border-radius: 50%;
    background: #FF8EBD; border: 3px solid white;
    box-shadow: 0 0 0 2px #FF8EBD;
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});


function AjustarVista({ centros }: { centros: CentroDistribucion[] }) {
  const map = useMap();
  useEffect(() => {
    if (centros.length === 0) return;
    const bounds = L.latLngBounds(centros.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [centros, map]);
  return null;
}


interface TransportePos {
  lat: number;
  lng: number;
}

function useSimulacionTransporte(origen: CentroDistribucion, destino: CentroDistribucion, duracionMs = 8000) {
  const [pos, setPos] = useState<TransportePos>({ lat: origen.lat, lng: origen.lng });
  const rafRef = useRef<number | null>(null);
  const inicioRef = useRef<number | null>(null);

  useEffect(() => {
    const animar = (timestamp: number) => {
      if (!inicioRef.current) inicioRef.current = timestamp;
      const elapsed = timestamp - inicioRef.current;
      const t = Math.min(elapsed / duracionMs, 1);
      setPos({
        lat: origen.lat + (destino.lat - origen.lat) * t,
        lng: origen.lng + (destino.lng - origen.lng) * t,
      });
      if (t < 1) rafRef.current = requestAnimationFrame(animar);
    };
    rafRef.current = requestAnimationFrame(animar);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [origen, destino, duracionMs]);

  return pos;
}

const iconoTransporte = new L.DivIcon({
  className: '',
  html: `<div style="
    width: 14px; height: 14px; border-radius: 50%;
    background: #FFA500; border: 2px solid white;
    box-shadow: 0 0 6px 2px rgba(255,165,0,0.6);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ── Componente principal del mapa ──
export default function MapaDespacho() {
  const posTransporte = useSimulacionTransporte(CENTROS[0], CENTROS[2]); // Pto Montt → Castro

  return (
    <div className="rounded-xl overflow-hidden shadow" style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={[-41.4693, -72.9424]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AjustarVista centros={CENTROS} />

        {CENTROS.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={iconoCentro}>
            <Popup>{c.nombre}</Popup>
          </Marker>
        ))}

        <Marker position={[posTransporte.lat, posTransporte.lng]} icon={iconoTransporte}>
          <Popup>Transporte en tránsito</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
