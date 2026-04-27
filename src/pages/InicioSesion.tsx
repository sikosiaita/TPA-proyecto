import React, { useState } from 'react';

export const Login = () => {
  // 1. Los "Estados" (La memoria temporal del componente)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. La función que se ejecuta al presionar el botón de "Ingresar"
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault(); // ¡Súper importante! Evita que la página parpadee o se recargue

    // 3. Validación básica
    if (email === '' || password === '') {
      setError('Por favor, completa todos los campos.');
      return; // Detiene la función aquí para no seguir avanzando
    }

    // 4. Simulación de éxito (Aquí después conectaremos tu base de datos o JSON)
    setError('');
    console.log('Enviando datos al servidor:', { email, password });
    alert('¡Login exitoso! (Esto es una simulación)');
    
    // TODO: Aquí pondremos el código para llevar al usuario a la pantalla principal
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Iniciar Sesión</h2>
      
      {/* Si hay un error, mostramos este mensaje en rojo */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={manejarEnvio}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@empresa.cl"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
};