import { dibujo } from "./funciones_dibujo.js";
const pincel = new dibujo();

export class Construccion{
    constructor(x, y, hitbox, id, imagen){
        this.x = x;
        this.y = y;
        this.hitbox = hitbox;
        this.id = id;
        this.imagen = imagen;
    }

    dibujar(canvas, ctx, tamaño){
        pincel.dibujarimagen(this.imagen, canvas, ctx, tamaño, this.x, this.y);//imagen, can, ct, tamaño, inicioX, inicioY

    }
}