import { Contenedor } from './Contenedor';
import { Item } from './Item';

// Capacidad máxima del contenedor principal (Pallet), en m³.
export const CAPACIDAD_MAX = 1;

export type TipoContenedor = 'pallet' | 'caja';

export interface ItemCargado {
  id: string;
  tipo: string;
  descripcion: string;
  pesoKg: number;
  volumen: number;
  precioBase: number;
  costoAdicional: number;
  total: number;
}

export interface CargaState {
  items: ItemCargado[];
  rutaId: string;
  tipoContenedor: TipoContenedor;
}

type CargaObserver = (estado: CargaState) => void;

const ETIQUETA_CONTENEDOR: Record<TipoContenedor, string> = {
  pallet: 'Pallet',
  caja: 'Caja',
};

class CargaService {
  // Jerarquía real (patrón Composite) — la misma instancia que antes vivía
  // como useRef dentro de GestorCarga.tsx, ahora compartida.
  private contenedor = new Contenedor('CONT-001', 'Pallet');

  // Espejo "plano" de los ítems agregados, para pintar tablas fácilmente en la UI.
  private items: ItemCargado[] = [];

  // Ruta elegida UNA sola vez (en GestorCarga). CentroDespacho ya no la reselecciona.
  private rutaId: string = '';

  // Tipo de contenedor elegido (Pallet/Caja) — ahora sí afecta qué vehículos pueden llevarlo.
  private tipoContenedor: TipoContenedor = 'pallet';

  private observadores: CargaObserver[] = [];

  private getEstado(): CargaState {
    return { items: [...this.items], rutaId: this.rutaId, tipoContenedor: this.tipoContenedor };
  }

  // ── Observer: mismo patrón que EnvioService ──
  suscribir(callback: CargaObserver) {
    this.observadores.push(callback);
    callback(this.getEstado());
  }

  desuscribir(callback: CargaObserver) {
    this.observadores = this.observadores.filter((obs) => obs !== callback);
  }

  private notificar() {
    this.observadores.forEach((callback) => callback(this.getEstado()));
  }

  getItems(): ItemCargado[] {
    return this.items;
  }

  getContenedor(): Contenedor {
    return this.contenedor;
  }

  getRutaId(): string {
    return this.rutaId;
  }

  setRuta(rutaId: string) {
    this.rutaId = rutaId;
    this.notificar();
  }

  getTipoContenedor(): TipoContenedor {
    return this.tipoContenedor;
  }

  setTipoContenedor(tipo: TipoContenedor) {
    this.tipoContenedor = tipo;
    this.contenedor.tipo = ETIQUETA_CONTENEDOR[tipo];
    this.notificar();
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
      descripcion: itemJson.descripcion,
      pesoKg: itemJson.pesoKg,
      volumen: itemJson.volumen,
      precioBase,
      costoAdicional,
      total,
    });

    this.notificar();
    return true;
  }

  eliminarItem(index: number) {
    const item = this.items[index];
    if (item) {
      // Sincroniza también la jerarquía Composite real, no solo el espejo plano.
      this.contenedor.removerComponente(item.id);
    }
    this.items = this.items.filter((_, i) => i !== index);
    this.notificar();
  }

  /** Se llama después de un despacho exitoso: la carga ya se convirtió en un Envío. */
  vaciar() {
    this.tipoContenedor = 'pallet';
    this.contenedor = new Contenedor('CONT-001', 'Pallet');
    this.items = [];
    this.notificar();
    // rutaId se deja tal cual — normalmente se vuelve a fijar apenas
    // arranca la próxima carga en GestorCarga.
  }
}

// Exporta la instancia única
export const cargaService = new CargaService();
