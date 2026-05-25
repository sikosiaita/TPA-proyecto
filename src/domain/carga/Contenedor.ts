import { ComponenteCarga } from './ComponenteCarga';

export class Contenedor implements ComponenteCarga {
  public id: string;
  public tipo: string; 
  private componentes: ComponenteCarga[] = []; //GUARDA LOS ITEMS

  constructor(id: string, tipo: string) {
    this.id = id;
    this.tipo = tipo;
  }

  //MÉTODO PARA AGREGAR ITEMS
  public agregarComponente(componente: ComponenteCarga): void { //MÉTODO PARA AGREGAR ITEMS
    this.componentes.push(componente);
  }

  //MÉTODO PARA ELIMINAR ITEMS
  public removerComponente(componenteId: string): void {
    for (let i = 0; i < this.componentes.length; i++) {
      if (this.componentes[i].id === componenteId) {        
        this.componentes.splice(i, 1); //.splice(i,1) INDICA QUE DEBE BORRAR 1 ELEMENTO APARTIR DE LA POSICIÓN DE I
        break; 
      }
    }
  }

  public obtenerVolumen(): number { //SE SUMA TODOS LOS ITEMS DENTRO DEL CONTENEDOR 
    return this.componentes.reduce((volumenTotal, componenteActual) => {
      return volumenTotal + componenteActual.obtenerVolumen();
    }, 0);
  }

  public obtenerDescripcion(): string {
    return `Contenedor [${this.tipo}] con ${this.componentes.length} elementos. Peso total: ${this.obtenerVolumen()} kg`;
  }
}