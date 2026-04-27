import { ComponenteCarga } from './ComponenteCarga';

export class Item implements ComponenteCarga {
  public id: string;
  public nombre: string;
  private pesoKg: number;

  constructor(id: string, nombre: string, pesoKg: number) {
    this.id = id;
    this.nombre = nombre;
    this.pesoKg = pesoKg;
  }

  public obtenerPeso(): number {
    return this.pesoKg;
  }

  public obtenerDescripcion(): string {
    return `Item: ${this.nombre} (${this.pesoKg} kg)`;
  }
}