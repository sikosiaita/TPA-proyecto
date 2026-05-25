import { ComponenteCarga } from './ComponenteCarga';

export class Item implements ComponenteCarga {
  public id: string;
  public nombre: string;
  private volumen: number;

  constructor(id: string, nombre: string, volumen: number) {
    this.id = id;
    this.nombre = nombre;
    this.volumen = volumen;
  }

  public obtenerVolumen(): number {
    return this.volumen;
  }

  public obtenerDescripcion(): string {
    return `Item: ${this.nombre} (${this.volumen} kg)`;
  }
}