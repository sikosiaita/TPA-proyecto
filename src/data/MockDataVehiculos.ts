//SE DEJA EL MOCKDATA DE VEHICULOS EN ARCHIVO TYPESCRIPT PARA IMPORTAR LOS ÍCONOS.
import { Truck, Bike, Wind } from 'lucide-react';

export const VEHICULOS = {
  dron: {
    nombre: 'Dron',
    descripcion: 'Sobres y documentos livianos',
    costoBase: 2000,
    costoPorKm: 150,
    capacidadMax: 0.05,
    tiposPermitidos: ['Sobre'],
    Icon: Wind,
  },
  moto: {
    nombre: 'Moto',
    descripcion: 'Cajas medianas y sobres',
    costoBase: 3500,
    costoPorKm: 250,
    capacidadMax: 0.5,
    tiposPermitidos: ['Sobre', 'Caja'],
    Icon: Bike,
  },
  camion: {
    nombre: 'Camión',
    descripcion: 'Pallets y cargas grandes',
    costoBase: 15000,
    costoPorKm: 800,
    capacidadMax: 10,
    tiposPermitidos: ['Sobre', 'Caja', 'Pallet'],
    Icon: Truck,
  },
} as const;
