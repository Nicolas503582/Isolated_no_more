
import { Animal } from "./animales.js";
import { movimientoCorral } from "./movimiento.js";
import { Construccion } from "./construccion.js";
import { Objetos } from "./objetos.js";

export class Corral extends Construccion {

    constructor(x, y, hitbox, id, imagen) {
        super(x, y, hitbox, id, imagen);

        this.tipo = "corral";

        this.capacidad = 8;
        this.animales = [];
    }

    estaLleno() {
        return this.animales.length >= this.capacidad;
    }

    agregarAnimal(idAnimal, idEntidad, entidades) {
        if (this.estaLleno()) return false;

        const datosAnimal = Objetos.find(obj => obj.id == idAnimal);

        if (!datosAnimal || datosAnimal.categoria !== "animal") {
            return false;
        }

        const x = this.x + this.hitbox.x + 10;
        const y = this.y + this.hitbox.y + 10;

        const nuevoAnimal = new Animal(x, y, idEntidad, datosAnimal);

        nuevoAnimal.movimiento = new movimientoCorral(nuevoAnimal, this.id);
        nuevoAnimal.corral = this;
        nuevoAnimal.domesticado = true;

        entidades.push(nuevoAnimal);

        this.animales.push({
            entidad: nuevoAnimal,
            tipo: datosAnimal,
            alimentado: false
        });

        return true;
    }

    quitarAnimal(indice) {
        if (indice < 0 || indice >= this.animales.length) return null;

        const animal = this.animales.splice(indice, 1)[0];

        animal.entidad.corral = null;

        return animal;
    }

    alimentar() {
        let cantidad = 0;

        this.animales.forEach(animal => {
            if (!animal.alimentado) {
                animal.alimentado = true;
                animal.entidad.alimentado = true;
                cantidad++;
            }
        });

        return cantidad;
    }
}
