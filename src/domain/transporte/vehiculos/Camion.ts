import { EstrategiaTransporte } from '../EstrategiaTransporte'; // (../) <- ESTO ES PARA CUANDO EL ARCHIVO ESTÁ FUERA DEL ACTUAL
import {VEHICULOS} from '../../../data/MockDataVehiculos';
import mockData from '../../../data/MockData.json';

export class Camion implements EstrategiaTransporte {
  calcularCosto(distanciaKm: number): number {

    const costoBase = VEHICULOS.camion.costoBase;
    const costoPorKm = VEHICULOS.camion.costoPorKm;

    return costoBase + (distanciaKm * costoPorKm); 
    //FÓRMULA COSTO TOTAL CAMIÓN
  }
  calcularTiempoEstimado(distanciaKm: number): string {
    return `${Math.ceil(distanciaKm / 70)} hrs`; // LAS COMILLAS INVERTIDAS (``) PERMITEN MEZCLAR TEXTO CON VARIABLES
                //.ceil() REDONDEA EL NÚMERO HACIA ARRIBA AL NÚMERO MÁS CERCANO
  }
}