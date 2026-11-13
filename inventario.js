
export class Inventario {
    constructor() {
        this.inventario_html = document.getElementById("Inv_objetos");
        this.espacios_inventario = this.inventario_html.getElementsByClassName("espacio_inv");
        this.inventario_objetos = {Insumos: [], Herramientas: [], Materiales: [], Rapido: []};
        this.inventario_objetos.Insumos = Array.from(this.espacios_inventario).slice(0, 5);
        this.inventario_objetos.Herramientas = Array.from(this.espacios_inventario).slice(5, 10);
        this.inventario_objetos.Materiales = Array.from(this.espacios_inventario).slice(10, 15);
        this.inventario_objetos.Rapido = Array.from(this.espacios_inventario).slice(15, 20);
    }

    guardarObjetoEnInventario(categoria, imagen, nombre, descripcion, id, cantidad) {
        let espacios = this.inventario_objetos[categoria];
        let aux = false; //(para verificar si se guardo el objeto o no, por si no hay espacios libres)
        let esta = false; //(para verificar si el objeto ya esta en el inventario)
        
        espacios.forEach((espacio) => {
            if(esta) return;
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent === id) {
                aux = this.aumentarObjetoDeInventario(categoria, id, cantidad);
                esta = true;
            }
        });
        if(!esta){
            espacios.forEach((espacio) => {
                if(aux) return;
                let imgElement = espacio.querySelector(".imagen_Item");
                if (imgElement.src === "" || imgElement.src === window.location.href) 
                {
                    aux = true;
                    imgElement.src = imagen.src;
                }
                else
                {
                    return;
                }
                let nombreElement = espacio.querySelector(".nombre_objeto");
                nombreElement.textContent = nombre;
                let descripcionElement = espacio.querySelector(".descripcion");
                descripcionElement.textContent = descripcion;
                let idElement = espacio.querySelector(".id_objeto");
                idElement.textContent = id;
                let cantidadElement = espacio.querySelector(".cantidad");
                cantidadElement.textContent = cantidad;
            });
        }
        return aux;
    }
    eliminarObjetoDeInventario(categoria, id) {
        let aux = false; //(para verificar si se elimino el objeto o no, por si no hay objetos con ese id)
        let espacios = this.inventario_objetos[categoria];
        espacios.forEach((espacio) => {
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent === id) {
                let imgElement = espacio.querySelector(".imagen_Item");
                imgElement.src = "";
                let nombreElement = espacio.querySelector(".nombre_objeto");
                nombreElement.textContent = "";
                let descripcionElement = espacio.querySelector(".descripcion");
                descripcionElement.textContent = "";
                let cantidadElement = espacio.querySelector(".cantidad");
                cantidadElement.textContent = "";
                idElement.textContent = "";
                aux = true;
            }
        });
        return aux;
    }

    reducirObjetoDeInventario(categoria, id, cantidad) {
        let aux = false; //(para verificar si se pudo realizar la operacion)
        let espacios = this.inventario_objetos[categoria];
        espacios.forEach((espacio) => {
            if(aux) return;
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent === id) {
                let cantidadElement = espacio.querySelector(".cantidad");
                if(parseInt(cantidadElement.textContent) - cantidad == 0){
                    aux = this.eliminarObjetoDeInventario(categoria, id);
                    return;
                }
                else if(parseInt(cantidadElement.textContent) - cantidad < 0){
                    alert("No tienes suficientes objetos para realizar esta acción");
                    return false;
                }
                cantidadElement.textContent = parseInt(cantidadElement.textContent) - cantidad;
                aux = true;
            }
        });
        return aux;
    }
    aumentarObjetoDeInventario(categoria, id, cantidad) {
        let aux = false; //(para verificar si se pudo realizar la operacion)
        let espacios = this.inventario_objetos[categoria];
        espacios.forEach((espacio) => {
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent === id) {
                let cantidadElement = espacio.querySelector(".cantidad");
                cantidadElement.textContent = parseInt(cantidadElement.textContent) + cantidad;
                aux = true;
            }
        });
        return aux;
    }
}