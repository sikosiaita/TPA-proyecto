export interface EstrategiaTransporte {
  calcularCosto(distanciaKm: number): number;
  calcularTiempoEstimado(distanciaKm: number): string;
}