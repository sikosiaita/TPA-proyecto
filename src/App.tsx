import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InicioSesion from './pages/InicioSesion';
import Dashboard from './pages/Dashboard';
import GestorCarga from './pages/GestorCarga';
import CentroDespacho from './pages/CentroDespacho';
import EstadoEntrega from './pages/EstadoEntrega';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gestor-carga" element={<GestorCarga />} />
        <Route path="/centro-despacho" element={<CentroDespacho />} />
        <Route path="/estados-entregas" element={<EstadoEntrega />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;