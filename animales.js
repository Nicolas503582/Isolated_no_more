import { Entidad } from "./entidades.js";

export class Animal extends Entidad {
    constructor(x, y, id, datos) {
        super(
            x,
            y,
            { x: 2, y: 0, ancho: 15, alto: 11 },
            1,
            id
        );

        this.tipo = "animal";
        this.datos = datos;

        this.imagenAnimal = new Image();

        this.imagenAnimal.onload = () => {
            // Adaptamos el canvas oculto al tamaño de la imagen
            this.canvasOculto.width = this.imagenAnimal.naturalWidth;
            this.canvasOculto.height = this.imagenAnimal.naturalHeight;

            // Dibujamos la imagen dentro del canvas que usa Entidad
            this.ctxOculto.drawImage(
                this.imagenAnimal,
                0,
                0
            );

            console.log("Imagen del animal cargada:", datos.src);
        };

        this.imagenAnimal.onerror = () => {
            console.error("Error al cargar la imagen:", datos.src);
        };

        this.imagenAnimal.src = datos.src;

        this.domesticado = false;
        this.corral = null;
        this.alimentado = false;
        this.tiempoProduccion = 0;
        this.direccionAnimal = { x: 0, z: 0 };
    }
}