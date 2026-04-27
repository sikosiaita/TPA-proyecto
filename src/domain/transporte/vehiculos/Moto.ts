import { EstrategiaTransporte } from '../EstrategiaTransporte'; // (../) <- ESTO ES PARA CUANDO EL ARCHIVO ESTÁ FUERA DEL ACTUAL

export class Moto implements EstrategiaTransporte {
  calcularCosto(distanciaKm: number, pesoKg: number): number {
    return 2000 + (distanciaKm * 100) + (pesoKg * 100);
    //FÓRMULA COSTO TOTAL MOTO = COSTO FIJO: $2.000 + $100*DISTANCIA + $100*PESO
  }
  calcularTiempoEstimado(distanciaKm: number): string {
    return `${Math.ceil(distanciaKm / 60)} hrs`;
                //.ceil() REDONDEA EL NÚMERO HACIA ARRIBA AL NÚMERO MÁS CERCANO
  }
}