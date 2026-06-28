import {Envio} from './Envio';
import {EstadoEnvio} from './EstadoEnvio';

type EnvioObserver = (envios: Envio[]) => void;

class EnvioService {
  // Inicializala lista con instancias de la clase Envio
  private envios: Envio[] = [
    new Envio('ENV-1042', 'Pto. Montt', 'Castro', 'Camión', EstadoEnvio.EN_TRANSITO, '3 hrs'),
    new Envio('ENV-2089', 'Castro', 'Dalcahue', 'Motocicleta', EstadoEnvio.EN_PREPARACION, '2 hrs'),
    new Envio('ENV-3114', 'Pto. Montt', 'Quellón', 'Camión', EstadoEnvio.ENTREGADO, '-'),
    new Envio('ENV-4052', 'Quellón', 'Castro', 'Drone', EstadoEnvio.FALLIDO, '-')
  ];

  private observadores: EnvioObserver[] = [];

  // Método para que EstadoEntrega.tsx se suscriba
  suscribir(callback: EnvioObserver) {
    this.observadores.push(callback);
    // Le pasa los envíos actuales inmediatamente
    callback(this.envios);
  }

  // Método para desuscribirse al salir de la pantalla
  desuscribir(callback: EnvioObserver) {
    this.observadores = this.observadores.filter(obs => obs !== callback);
  }

  // Notifica la lista actualizada clonando el array
  private notificar() {
    this.observadores.forEach(callback => callback([...this.envios]));
  }

  // Este método se llama en la pantalla "CentroDespacho.tsx" para guardar un despacho nuevo
  crearEnvio(origen: string, destino: string, transporte: string) {
    const nuevoId = `ENV-${Math.floor(1000 + Math.random() * 9000)}`; // Genera un ID aleatorio tipo ENV-XXXX
    
    const nuevoEnvio = new Envio(
      nuevoId,
      origen,
      destino,
      transporte,
      EstadoEnvio.EN_PREPARACION, // Todo envío nuevo parte aquí
      '-'
    );

    this.envios.push(nuevoEnvio);
    this.notificar(); // Gatilla la actualización en los observadores
  }

  
}

// Exporta la instancia única
export const envioService = new EnvioService();