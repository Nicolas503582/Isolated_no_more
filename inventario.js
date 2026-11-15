import { Objetos } from "./objetos.js";

export { Objetos } from "./objetos.js";

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

        //Crafteo

        this.crafteador_html = document.getElementById("Crafteador");
        this.espacios_crafteador = Array.from(this.crafteador_html.getElementsByClassName("espacio_inv"));
        this.crafteador_objetos = {Materiales: [], Rapido: []};
        this.crafteador_objetos.Materiales = this.espacios_crafteador.slice(0, 5);
        this.crafteador_objetos.Rapido = this.espacios_crafteador.slice(5, 10);
        this.estaseleccionado = null;

        this.eventos();

        
    }

    guardarObjetoEnInventario(categoria, id, cantidad) {
        let espacios = this.inventario_objetos[categoria];
        let aux = false; //(para verificar si se guardo el objeto o no, por si no hay espacios libres)
        let esta = false; //(para verificar si el objeto ya esta en el inventario)
        
        espacios.forEach((espacio) => {
            if(esta) return;
            let idElement = espacio.querySelector(".id_objeto");
            if (idElement.textContent == id) {
                aux = this.aumentarObjetoDeInventario(categoria, id, cantidad);
                esta = true;
                 //console.log("si esta");
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
                    imgElement.src = Objetos[id].src;
                }
                else
                {
                    return;
                }
                let nombreElement = espacio.querySelector(".nombre_objeto");
                nombreElement.textContent = Objetos[id].nombre;
                let descripcionElement = espacio.querySelector(".descripcion");
                descripcionElement.textContent = Objetos[id].descripcion;
                idElement.textContent = id;
                let cantidadElement = espacio.querySelector(".cantidad");
                cantidadElement.textContent = cantidad;
            });
        }
        //console.log(this.inventario_objetos.Insumos[0]);

        this.sincronizarInventarios(categoria);
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
        
        this.sincronizarInventarios(categoria);
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

        
        
        this.sincronizarInventarios(categoria);
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

        this.sincronizarInventarios(categoria);
        return aux;
    }

    eventos(){
        this.espacios_inventario.forEach((espacio, i) => {
            espacio.addEventListener("click", (e) =>{

                const categorias = ["Insumos", "Herramientas", "Materiales", "Rapido"];
                let anterior = this.espacios_inventario[this.estaseleccionado];
                if(anterior)
                {
                    if (i == this.estaseleccionado)
                    {
                        this.des_activar(espacio);
                        this.estaseleccionado = null;
                    }
                    else if(Math.floor(i/5) == Math.floor(this.estaseleccionado / 5))
                    {
                        if(anterior.querySelector(".id_objeto").textContent)
                        {
                            this.des_activar(anterior);
                            this.estaseleccionado = null;

                            const anterior_html = anterior.innerHTML;
                            anterior.innerHTML = espacio.innerHTML;
                            espacio.innerHTML = anterior_html;
                            this.sincronizarInventarios(categorias[Math.floor(i/5)]);
                        }
                        else
                        {
                            this.des_activar(anterior);
                            this.des_activar(espacio);
                            this.estaseleccionado = i;
                        }
                    }
                    else
                    {
                        this.des_activar(anterior);
                        this.des_activar(espacio);
                        this.estaseleccionado = i;
                    }
                }
                else
                {
                    let activo = espacio.querySelector(".seleccionado");
                    activo.textContent = activo.textContent === "true" ? false : true;
                    espacio.classList.toggle('seleccionado');
                    this.estaseleccionado = i;
                }
            });
        });
    }

    des_activar(espacio)
    {
        let activo = espacio.querySelector(".seleccionado");
        activo.textContent = activo.textContent === "true" ? false : true;
        espacio.classList.toggle('seleccionado');
    }

    sincronizarInventarios(categoria) {
        if (categoria !== "Materiales" && categoria !== "Rapido") return;

        let inventario = this.inventario_objetos[categoria];
        let crafteador = this.crafteador_objetos[categoria];

        inventario.forEach((espacio, i) => {
            crafteador[i].innerHTML = espacio.innerHTML;
        });
    }
}