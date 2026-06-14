import { EstadoEnvio } from './EstadoEnvio';

export class Envio {
  constructor(
    public readonly id: string,
    public readonly origen: string,
    public readonly destino: string,
    public readonly transporte: string,
    public estado: EstadoEnvio,
    public tiempoEstimado: string | null = null,
  ) {}

  estaActivo(): boolean {
    return this.estado === EstadoEnvio.EN_PREPARACION
        || this.estado === EstadoEnvio.EN_TRANSITO;
  }

  getColorEstado(): string {
    switch (this.estado) {
      case EstadoEnvio.EN_PREPARACION: return '#3b82f6'; //azul
      case EstadoEnvio.EN_TRANSITO:    return '#f97316'; //naranja
      case EstadoEnvio.ENTREGADO:      return '#22c55e'; //verde
      case EstadoEnvio.FALLIDO:        return '#ef4444'; //rojo
    }
  }
}