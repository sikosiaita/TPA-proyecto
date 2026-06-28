import { EstrategiaTransporte } from '../EstrategiaTransporte'; // (../) <- ESTO ES PARA CUANDO EL ARCHIVO ESTÁ FUERA DEL ACTUAL
import {VEHICULOS} from '../../../data/MockDataVehiculos';
import mockData from '../../../data/MockData.json';

export class Moto implements EstrategiaTransporte {
  calcularCosto(distanciaKm: number): number {

    const costoBase = VEHICULOS.moto.costoBase;
    const costoPorKm = VEHICULOS.moto.costoPorKm;

    return costoBase + (distanciaKm * costoPorKm);
    //FÓRMULA COSTO TOTAL MOTO
  }
  calcularTiempoEstimado(distanciaKm: number): string {
    return `${Math.ceil(distanciaKm / 60)} hrs`;
                //.ceil() REDONDEA EL NÚMERO HACIA ARRIBA AL NÚMERO MÁS CERCANO
  }
}