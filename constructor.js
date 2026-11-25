import { Objetos } from "./objetos.js";

export class Construccion{
    construir(id){
        console.log("id: " + id);
        if(!id)
        {
            return false;
        }
        const objeto = Objetos[id];
        if (objeto.categoria == "cons")
        {
            const evento = new CustomEvent('construir', {
                detail: { id: objeto.id, hitbox: objeto.hitbox, tipo: objeto.tipo }
            });

            document.dispatchEvent(evento);
            return true;
        }
        else
        {
            return false;
        }
    }
}