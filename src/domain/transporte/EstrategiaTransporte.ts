export interface EstrategiaTransporte {
  calcularCosto(distanciaKm: number, pesoKg: number): number;
  calcularTiempoEstimado(distanciaKm: number): string;
}