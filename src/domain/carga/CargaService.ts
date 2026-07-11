import { Contenedor } from './Contenedor';
import { Item } from './Item';

// Capacidad máxima del contenedor principal (Pallet), en m³.
export const CAPACIDAD_MAX = 1;

export interface ItemCargado {
  id: string;
  tipo: string;
  volumen: number;
  precioBase: number;
  costoAdicional: number;
  total: number;
}

type CargaObserver = (items: ItemCargado[]) => void;

class CargaService {
  // Jerarquía real (patrón Composite) — la misma instancia que antes vivía
  // como useRef dentro de GestorCarga.tsx, ahora compartida.
  private contenedor = new Contenedor('CONT-001', 'Pallet');

  // Espejo "plano" de los ítems agregados, para pintar tablas fácilmente en la UI.
  private items: ItemCargado[] = [];

  private observadores: CargaObserver[] = [];

  // ── Observer: mismo patrón que EnvioService ──
  suscribir(callback: CargaObserver) {
    this.observadores.push(callback);
    callback([...this.items]); // le pasa el estado actual de inmediato
  }

  desuscribir(callback: CargaObserver) {
    this.observadores = this.observadores.filter((obs) => obs !== callback);
  }

  private notificar() {
    this.observadores.forEach((callback) => callback([...this.items]));
  }

  getItems(): ItemCargado[] {
    return this.items;
  }

  getContenedor(): Contenedor {
    return this.contenedor;
  }

  getVolumenTotal(): number {
    return this.items.reduce((acc, i) => acc + i.volumen, 0);
  }

  getCapacidadRestante(): number {
    return CAPACIDAD_MAX - this.getVolumenTotal();
  }

  /**
   * Agrega un ítem a la carga compartida.
   * itemJson es el registro crudo de mockData.item ({ id, tipo, pesoKg, volumen, descripcion }).
   * Devuelve false si no hay capacidad suficiente (y no agrega nada).
   */
  agregarItem(itemJson: any, precioBase: number, costoAdicional: number): boolean {
    if (itemJson.volumen > this.getCapacidadRestante()) {
      return false;
    }

    const nuevoItemDominio = new Item(itemJson.id, itemJson.descripcion, itemJson.volumen);
    this.contenedor.agregarComponente(nuevoItemDominio);

    const total = precioBase + costoAdicional;
    this.items.push({
      id: itemJson.id,
      tipo: itemJson.tipo,
      volumen: itemJson.volumen,
      precioBase,
      costoAdicional,
      total,
    });

    this.notificar();
    return true;
  }

  eliminarItem(index: number) {
    this.items = this.items.filter((_, i) => i !== index);
    this.notificar();
    // Nota: si Contenedor.ts expone un método para remover componentes,
    // conviene llamarlo aquí también para que la jerarquía Composite real
    // quede sincronizada 1:1 con este espejo plano.
  }

  /** Se llama después de un despacho exitoso: la carga ya se convirtió en un Envío. */
  vaciar() {
    this.contenedor = new Contenedor('CONT-001', 'Pallet');
    this.items = [];
    this.notificar();
  }
}

// Exporta la instancia única
export const cargaService = new CargaService();
