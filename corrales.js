import { Construccion } from "./construccion.js"; // ajusta la ruta al archivo donde está tu clase base

/*
 * Corral de animales.
 *
 * Un tipo de animal se describe con un objeto así:
 * {
 *   id: 5,                          // id del animal
 *   tiempoProduccion: 20,           // segundos entre cada producción (si está alimentado)
 *   produce: { id: 9, cantidad: 1 } // objeto que genera (huevo, leche, etc.)
 * }
 */
export class Corral extends Construccion {
    constructor(x, y, hitbox, id, imagen, capacidad = 4) {
        super(x, y, hitbox, id, imagen);
        this.capacidad = capacidad;
        this.animales = [];    // {tipo, temporizador, alimentado}
        this.produccion = [];  // producción lista para recolectar: {id, cantidad}
        this.tipo = "corral";
    }

    estaLleno() {
        return this.animales.length >= this.capacidad;
    }

    agregarAnimal(tipo) {
        if (this.estaLleno()) return false;
        this.animales.push({ tipo, temporizador: 0, alimentado: false });
        return true;
    }

    quitarAnimal(indice) {
        if (indice < 0 || indice >= this.animales.length) return null;
        return this.animales.splice(indice, 1)[0].tipo;
    }

    // Alimenta a todos los animales (devuelve cuántos se alimentaron)
    alimentar() {
        let n = 0;
        this.animales.forEach(a => {
            if (!a.alimentado) {
                a.alimentado = true;
                n++;
            }
        });
        return n;
    }

    // dt en segundos; llámalo desde tu bucle del juego
    actualizar(dt) {
        this.animales.forEach(a => {
            if (!a.alimentado) return;
            a.temporizador += dt;
            if (a.temporizador >= a.tipo.tiempoProduccion) {
                a.temporizador = 0;
                a.alimentado = false; // necesita comer de nuevo
                this.agregarProduccion(a.tipo.produce);
            }
        });
    }

    agregarProduccion(objeto) {
        const existente = this.produccion.find(p => p.id === objeto.id);
        if (existente) existente.cantidad += objeto.cantidad;
        else this.produccion.push({ ...objeto });
    }

    hayProduccion() {
        return this.produccion.length > 0;
    }

    // Devuelve la lista [{id, cantidad}] y vacía el corral
    recolectar() {
        const resultado = this.produccion;
        this.produccion = [];
        return resultado;
    }
}