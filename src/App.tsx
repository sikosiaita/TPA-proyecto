import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InicioSesion from './pages/InicioSesion';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;