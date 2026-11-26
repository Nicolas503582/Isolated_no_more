
import { Entidad } from "./entidades.js";

export class FuenteRecurso extends Entidad {
    constructor(x, y, id, datos) {
        super(
            x,
            y,
            datos.hitbox ?? { x: 0, y: 0, ancho: 20, alto: 20 },
            0,
            id
        );

        this.tipo = "fuente_recurso";
        this.datos = datos;

        // Imagen
        this.imagenRecurso = new Image();

        this.imagenRecurso.onload = () => {
            this.canvasOculto.width = this.imagenRecurso.naturalWidth;
            this.canvasOculto.height = this.imagenRecurso.naturalHeight;

            this.ctxOculto.drawImage(
                this.imagenRecurso,
                0,
                0
            );
        };

        this.imagenRecurso.onerror = () => {
            console.error("No se pudo cargar:", datos.src);
        };

        this.imagenRecurso.src = datos.src;

        // Recursos que entrega
        this.drops = datos.drops ?? [];

        // Tiempo hasta volver a recolectar (en milisegundos)
        this.tiempoRecoleccion = datos.tiempoRecoleccion ?? 0;

        this.disponible = true;
        this.ultimaRecoleccion = 0;
    }

    recolectar() {
        if (!this.disponible) return false;

        this.disponible = false;

        if (this.tiempoRecoleccion > 0) {
            this.ultimaRecoleccion = Date.now();

            setTimeout(() => {
                this.disponible = true;
            }, this.tiempoRecoleccion);
        }

        else {
            this.disponible = true;
        }

        return this.drops;
    }
}
