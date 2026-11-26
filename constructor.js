
import { Objetos } from "./objetos.js";

export class Construccion {

    constructor(inventario) {
        this.inventario = inventario;
    }

    construir(id) {

        console.log("id: " + id);

        if (id === false || id === null || id === undefined || id === "") {
            return false;
        }

        const objeto = Objetos[id];

        if (!objeto || objeto.categoria !== "cons") {
            return false;
        }

        const evento = new CustomEvent("construir", {
            detail: {
                id: objeto.id,
                hitbox: objeto.hitbox,
                tipo: objeto.tipo
            }
        });

        document.dispatchEvent(evento);

        // Descontar una unidad del inventario rápido.
        const descontado = this.inventario.reducirObjetoDeInventario(
            "Rapido",
            id,
            1
        );

        if (!descontado) {
            console.error("No se pudo descontar el objeto.");
            return false;
        }

        return true;
    }
}
