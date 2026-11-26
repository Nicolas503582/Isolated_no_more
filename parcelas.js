
import { Construccion } from "./construccion.js";
import { dibujo } from "./funciones_dibujo.js";
import { Objetos } from "./objetos.js";

const pincel = new dibujo();

const imagenesCultivos = new Map();

function obtenerImagen(ruta) {
    if (!imagenesCultivos.has(ruta)) {
        const imagen = new Image();
        imagen.src = ruta;

        imagenesCultivos.set(ruta, imagen);
    }

    return imagenesCultivos.get(ruta);
}

export class Parcela extends Construccion {

    constructor(x, y, hitbox, id, imagen) {
        super(x, y, hitbox, id, imagen);

        this.tipo = "parcela";

        // 8 espacios independientes
        this.estado = Array(8).fill("vacio");
        this.cultivo = Array(8).fill(null);
        this.progreso = Array(8).fill(0);
        this.regada = Array(8).fill(false);

        document.addEventListener("5_minutos", () => {
            this.actualizar();
        });

    }

    // Buscar los datos de un cultivo por su ID
    obtenerCultivo(posicion) {
        if (posicion < 0 || posicion >= 8) return null;

        const id = this.cultivo[posicion];

        if (id === null) return null;

        return Objetos.find(c => c.id === id) || null;
    }

    // Sembrar en un espacio específico
    sembrar(posicion, idCultivo) {

        if (posicion < 0 || posicion >= 8) return false;
        if (this.estado[posicion] !== "vacio") return false;

        const cultivo = Objetos.find(c => c.id === idCultivo);

        if (!cultivo) return false;

        this.cultivo[posicion] = idCultivo;
        this.progreso[posicion] = 0;
        this.regada[posicion] = false;
        this.estado[posicion] = "sembrado";

        return true;
    }

    // Regar un espacio específico
    regar(posicion) {

        if (posicion < 0 || posicion >= 8) return false;
        if (this.estado[posicion] !== "sembrado") return false;

        this.regada[posicion] = true;

        return true;
    }

    // Actualizar crecimiento de los 8 espacios
    actualizar() {

        for (let i = 0; i < 8; i++) {

            // Si no está sembrado, no puede crecer.
            if (this.estado[i] !== "sembrado") continue;

            // Si no está regado, no puede crecer.
            if (!this.regada[i]) continue;

            const cultivo = this.obtenerCultivo(i);

            if (!cultivo) continue;

            const etapaAnterior = this.etapaActual(i);

            // Crece 5 minutos.
            this.progreso[i] += 5;

            // Pierde el riego después de crecer.
            this.regada[i] = false;

            // Comprobar si terminó de crecer.
            if (this.progreso[i] >= cultivo.tiempo) {
                this.progreso[i] = cultivo.tiempo;
                this.estado[i] = "listo";

                console.log(`Cultivo ${i}: listo`);
            }

            const etapaNueva = this.etapaActual(i);

            if (etapaAnterior !== etapaNueva) {
                console.log(
                    `El cultivo ${i} cambió de etapa: ${etapaAnterior} → ${etapaNueva}`
                );
            }
        }
    }

    // Cosechar un espacio
    cosechar(posicion) {

        if (posicion < 0 || posicion >= 8) return null;
        if (this.estado[posicion] !== "listo") return null;

        const cultivo = this.obtenerCultivo(posicion);

        if (!cultivo) return null;

        const cosecha = { ...cultivo.cosecha };

        this.cultivo[posicion] = null;
        this.progreso[posicion] = 0;
        this.regada[posicion] = false;
        this.estado[posicion] = "vacio";

        return cosecha;
    }

    // Obtener etapa de crecimiento de un espacio
    etapaActual(posicion) {

        if (posicion < 0 || posicion >= 8) return -1;

        const cultivo = this.obtenerCultivo(posicion);

        if (!cultivo || !cultivo.etapas || cultivo.etapas.length === 0) {
            return -1;
        }

        const cantidadEtapas = cultivo.etapas.length;

        if (this.estado[posicion] === "listo") {
            return cantidadEtapas - 1;
        }

        if (cultivo.tiempo <= 0) return cantidadEtapas - 1;

        return Math.min(
            cantidadEtapas - 2,
            Math.floor(
                (this.progreso[posicion] / cultivo.tiempo) *
                (cantidadEtapas - 1)
            )
        );
    }

    // Dibujar terreno y sus cultivos
    dibujar(canvas, ctx, tamaño) {

        super.dibujar(canvas, ctx, tamaño);

        const anchoEspacio = this.hitbox.ancho / 4;
        const altoEspacio = this.hitbox.alto / 2;

        for (let i = 0; i < 8; i++) {

            const etapa = this.etapaActual(i);

            if (etapa < 0) continue;

            const cultivo = this.obtenerCultivo(i);

            if (!cultivo) continue;

            const fila = Math.floor(i / 4);
            const columna = i % 4;

            const x = this.x + columna * anchoEspacio;
            const y = this.y + fila * altoEspacio;

            const imagen = obtenerImagen(cultivo.etapas[etapa].src);

            if (!imagen.complete || imagen.naturalWidth === 0) continue;

            pincel.dibujarimagen(
                imagen,
                canvas,
                ctx,
                tamaño,
                x,
                y
            );
        }
    }

    regarTodo() {
        let regados = 0;

        for (let i = 0; i < 8; i++) {
            if (this.regar(i)) {
                regados++;
            }
        }

        console.log(`Se regaron ${regados} cultivos.`);

        return regados;
    }
}
