import { EstrategiaTransporte } from '../EstrategiaTransporte'; // (../) <- ESTO ES PARA CUANDO EL ARCHIVO ESTÁ FUERA DEL ACTUAL

export class Drone implements EstrategiaTransporte {
  calcularCosto(distanciaKm: number, pesoKg: number): number {
    return 15000 + (distanciaKm * 300) + (pesoKg * 500);
    //FÓRMULA COSTO TOTAL DRONE = COSTO FIJO: $15.000 + $300*DISTANCIA + $500*PESO
  }
  calcularTiempoEstimado(distanciaKm: number): string {
    return `${Math.max(1, Math.ceil(distanciaKm / 120))} hrs`; // LAS COMILLAS INVERTIDAS (``) PERMITEN MEZCLAR TEXTO CON VARIABLES
                //.max() ASEGURA QUE AUNQUE EL CÁLCULO DE TIEMPO SEA MENOR A UNA HORA, SIEMPRE ENTREGUE COMO MÍNIMO DEL TIEMPO ESTIMADO 1HR
  }
}