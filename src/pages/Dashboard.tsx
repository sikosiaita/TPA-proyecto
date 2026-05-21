import React from 'react';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-700">Bienvenido</h1>
      <p className="text-gray-500 mt-2">Selecciona una opción del menú</p>
    </Layout>
  );
};

export default Dashboard;