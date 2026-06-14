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
      case EstadoEnvio.EN_PREPARACION: return '#FFAEC1';
      case EstadoEnvio.EN_TRANSITO:    return '#ED93B1';
      case EstadoEnvio.ENTREGADO:      return '#4ade80';
      case EstadoEnvio.FALLIDO:        return '#f87171';
    }
  }
}