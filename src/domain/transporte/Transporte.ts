import { EstrategiaTransporte } from './EstrategiaTransporte';

export class Transporte {
  public id: string;
  public tipo: string;
  private estrategia: EstrategiaTransporte; 

  constructor(id: string, tipo: string, estrategia: EstrategiaTransporte) {
    this.id = id;
    this.tipo = tipo;
    this.estrategia = estrategia;
  }


  public obtenerCostoEnvio(distanciaKm: number, pesoKg: number): number {
    return this.estrategia.calcularCosto(distanciaKm, pesoKg);
  }

  public obtenerTiempoEnvio(distanciaKm: number): string {
    return this.estrategia.calcularTiempoEstimado(distanciaKm);
  }
}