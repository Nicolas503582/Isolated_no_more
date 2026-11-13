
export class Inventario {
    constructor() {
        this.inventario_html = document.getElementById("Inv_objetos");
        this.espacios_inventario = Array.from(this.inventario_html.getElementsByClassName("espacio_inv"));
        this.inventario_objetos = {Insumos: [], Herramientas: [], Materiales: [], Rapido: []};
        this.inventario_objetos.Insumos = this.espacios_inventario.slice(0, 5);
        this.inventario_objetos.Herramientas = this.espacios_inventario.slice(5, 10);
        this.inventario_objetos.Materiales = this.espacios_inventario.slice(10, 15);
        this.inventario_objetos.Rapido = this.espacios_inventario.slice(15, 20);
        this.estaseleccionado = null;

        this.eventos();
    }

    guardarObjetoEnInventario(categoria, imagen, nombre, descripcion, id, cantidad) {
        let espacios = this.inventario_objetos[categoria];
        let aux = false; //(para verificar si se guardo el objeto o no, por si no hay espacios libres)
        let esta = false; //(para verificar si el objeto ya esta en el inventario)
        
        espacios.forEach((espacio) => {
            if(esta) return;
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent == id) {
                aux = this.aumentarObjetoDeInventario(categoria, id, cantidad);
                esta = true;
                console.log("si esta");
            }
        });
        if(!esta){
            espacios.forEach((espacio) => {
                if(aux) return;
                let imgElement = espacio.querySelector(".imagen_Item");
                let idElement = espacio.querySelector(".id_objeto");
                if (idElement.textContent == "") 
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
                idElement.textContent = id;
                let cantidadElement = espacio.querySelector(".cantidad");
                cantidadElement.textContent = cantidad;
            });
        }console.log(this.inventario_objetos.Insumos[0]);

        return aux;
    }
    eliminarObjetoDeInventario(categoria, id) {
        let aux = false; //(para verificar si se elimino el objeto o no, por si no hay objetos con ese id)
        let espacios = this.inventario_objetos[categoria];
        espacios.forEach((espacio) => {
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent == id) {
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
            if (idElement.textContent == id) {
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
            if (idElement.textContent == id) {
                let cantidadElement = espacio.querySelector(".cantidad");
                cantidadElement.textContent = parseInt(cantidadElement.textContent) + cantidad;
                aux = true;
            }
        });
        return aux;
    }

    eventos(){
        this.espacios_inventario.forEach((espacio, i) => {
            espacio.addEventListener("click", (e) =>{
                let anterior = this.espacios_inventario[this.estaseleccionado];
                if(anterior)
                {
                    if(Math.floor(i/5) == Math.floor(this.estaseleccionado / 5))
                    {
                        console.log(anterior);
                        const anterior_html = anterior.innerHTML;
                        anterior.innerHTML = espacio.innerHTML;
                        espacio.innerHTML = anterior_html;
                    }
                }

                let activo = espacio.querySelector(".seleccionado");
                activo.textContent = activo.textContent === "true" ? false : true;
                espacio.classList.toggle('seleccionado');
                this.estaseleccionado = i;
            });
        });
    }
}