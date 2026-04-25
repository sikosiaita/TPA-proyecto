import { EstrategiaTransporte } from '../EstrategiaTransporte'; // (../) <- ESTO ES PARA CUANDO EL ARCHIVO ESTÁ FUERA DEL ACTUAL

export class Camion implements EstrategiaTransporte {
  calcularCosto(distanciaKm: number, pesoKg: number): number {
    return 5000 + (distanciaKm * 150) + (pesoKg * 50); 
    //FÓRMULA COSTO TOTAL CAMIÓN= COSTO FIJO: $5.000 + $15O*DISTANCIA + $50*PESO
  }
  calcularTiempoEstimado(distanciaKm: number): string {
    return `${Math.ceil(distanciaKm / 70)} hrs`; // LAS COMILLAS INVERTIDAS (``) PERMITEN MEZCLAR TEXTO CON VARIABLES
                //.ceil() REDONDEA EL NÚMERO HACIA ARRIBA AL NÚMERO MÁS CERCANO
  }
}