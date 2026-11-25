import { Construccion } from "./construccion.js"; // ajusta la ruta al archivo donde está tu clase base
import { dibujo } from "./funciones_dibujo.js";
const pincel = new dibujo();

/*
 * Parcela de cultivo.
 * Estados: "vacia" -> "sembrada" -> "lista" (al cosechar vuelve a "vacia").
 *
 * Un cultivo se describe con un objeto así:
 * {
 *   id: 3,                        // id del cultivo
 *   tiempo: 30,                   // segundos para crecer (con riego)
 *   etapas: [img1, img2, img3],   // imágenes de cada etapa de crecimiento (la última = lista)
 *   cosecha: { id: 7, cantidad: 2 } // objeto que se obtiene al cosechar
 * }
 */
export class Parcela extends Construccion {
    constructor(x, y, hitbox, id, imagen) {
        super(x, y, hitbox, id, imagen);
        this.estado = "vacia";
        this.cultivo = null;
        this.progreso = 0;     // segundos acumulados de crecimiento
        this.regada = false;
        this.tipo = "parcela";
    }

    sembrar(cultivo) {
        if (this.estado !== "vacia") return false;
        this.cultivo = cultivo;
        this.progreso = 0;
        this.regada = false;
        this.estado = "sembrada";
        return true;
    }

    regar() {
        if (this.estado !== "sembrada") return false;
        this.regada = true;
        return true;
    }

    // dt en segundos; llámalo desde tu bucle del juego
    actualizar(dt) {
        if (this.estado !== "sembrada" || !this.regada) return;
        this.progreso += dt;
        if (this.progreso >= this.cultivo.tiempo) {
            this.progreso = this.cultivo.tiempo;
            this.estado = "lista";
        }
    }

    // Devuelve {id, cantidad} del objeto cosechado, o null si no está lista
    cosechar() {
        if (this.estado !== "lista") return null;
        const cosecha = { ...this.cultivo.cosecha };
        this.cultivo = null;
        this.progreso = 0;
        this.regada = false;
        this.estado = "vacia";
        return cosecha;
    }

    // Etapa actual según el progreso (0 .. etapas.length - 1)
    etapaActual() {
        if (!this.cultivo) return -1;
        const n = this.cultivo.etapas.length;
        if (this.estado === "lista") return n - 1;
        return Math.min(n - 1, Math.floor((this.progreso / this.cultivo.tiempo) * n));
    }

    dibujar(canvas, ctx, tamaño) {
        super.dibujar(canvas, ctx, tamaño); // terreno de la parcela
        const etapa = this.etapaActual();
        if (etapa >= 0) {
            pincel.dibujarimagen(this.cultivo.etapas[etapa], canvas, ctx, tamaño, this.x, this.y);
        }
    }
}