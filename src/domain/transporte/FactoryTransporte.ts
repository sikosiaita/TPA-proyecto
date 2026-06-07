import { Camion } from './vehiculos/Camion';
import { Moto } from './vehiculos/Moto';
import { Drone } from './vehiculos/Drone';
import { EstrategiaTransporte } from './EstrategiaTransporte';

const registros: Record<string, () => EstrategiaTransporte> = {
  camion: () => new Camion(),
  moto: () => new Moto(),
  dron: () => new Drone(),
};

export const crearEstrategia = (key: string): EstrategiaTransporte => {
  const creador = registros[key];
  if (!creador) throw new Error(`Transporte ${key} no soportado`);
  return creador();
};