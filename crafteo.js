import { Recetas } from "./recetas.js";
import { Objetos } from "./objetos.js";

export class Crafteador {
    constructor(){

        this.recetario = document.getElementById("crafteos");
        this.crafteador_html = document.getElementById("Crafteador");
        this.espacios_crafteador = Array.from(this.crafteador_html.getElementsByClassName("espacio_inv"));
        this.crafteador_objetos = {Materiales: [], Rapido: []};
        this.crafteador_objetos.Materiales = this.espacios_crafteador.slice(0, 5);
        this.crafteador_objetos.Rapido = this.espacios_crafteador.slice(5, 10);
        this.estaseleccionado = null;

        //Inventario

        this.inventario_html = document.getElementById("Inv_objetos");
        this.espacios_inventario = Array.from(this.inventario_html.getElementsByClassName("espacio_inv"));
        this.inventario_objetos = {Insumos: [], Herramientas: [], Materiales: [], Rapido: []};
        this.inventario_objetos.Insumos = this.espacios_inventario.slice(0, 5);
        this.inventario_objetos.Herramientas = this.espacios_inventario.slice(5, 10);
        this.inventario_objetos.Materiales = this.espacios_inventario.slice(10, 15);
        this.inventario_objetos.Rapido = this.espacios_inventario.slice(15, 20);
        this.estaseleccionado = null;

        Recetas.forEach(receta =>{
            let nueva_receta = document.createElement("div");
            nueva_receta.classList.add("crafteo");
            let precio = document.createElement("div");
            precio.classList.add("precio");
            receta.materiales.forEach(material =>{
                let objeto = document.createElement("div");
                objeto.classList.add("objeto");
                let id = document.createElement("p");
                id.textContent = material.id;
                id.classList.add("id_objeto");
                let nombre = document.createElement("p");
                nombre.textContent = Objetos[material.id].nombre;
                nombre.classList.add("nombre_objeto");
                let cantidad = document.createElement("p");
                cantidad.textContent = material.cantidad;
                cantidad.classList.add("cantidad")
                let imagen = document.createElement("img");
                imagen.src = Objetos[material.id].src;
                imagen.classList.add("imagen_Item");

                objeto.appendChild(id);
                objeto.appendChild(nombre);
                objeto.appendChild(cantidad);
                objeto.appendChild(imagen);
                precio.appendChild(objeto);
            });

            let flecha = document.createElement("div");
            flecha.classList.add("flecha");


            let resultado = document.createElement("div");
            resultado.classList.add("resultado");
        
            let objeto = document.createElement("div");
            objeto.classList.add("objeto");
            let id = document.createElement("p");
            id.textContent = receta.resultado.id;
            id.classList.add("id_objeto");
            let nombre = document.createElement("p");
            nombre.textContent = Objetos[receta.resultado.id].nombre;
            nombre.classList.add("nombre_objeto");
            let cantidad = document.createElement("p");
            cantidad.textContent = receta.resultado.cantidad;
            cantidad.classList.add("cantidad")
            let imagen = document.createElement("img");
            imagen.src = Objetos[receta.resultado.id].src;
            imagen.classList.add("imagen_Item");

            objeto.appendChild(id);
            objeto.appendChild(nombre);
            objeto.appendChild(cantidad);
            objeto.appendChild(imagen);
            resultado.appendChild(objeto);


            nueva_receta.appendChild(precio);
            nueva_receta.appendChild(flecha);
            nueva_receta.appendChild(resultado);
            this.recetario.appendChild(nueva_receta);
        });
        

        this.eventos();
    }

    
    guardarObjetoEnInventario(categoria, id, cantidad) {
        let espacios = this.crafteador_objetos[categoria];
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
                    console.log(id);
                    console.log(Objetos);
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
        let espacios = this.crafteador_objetos[categoria];
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
        let espacios = this.crafteador_objetos[categoria];
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
        let espacios = this.crafteador_objetos[categoria];
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
        this.espacios_crafteador.forEach((espacio, i) => {
            espacio.addEventListener("click", (e) =>{

                const categorias = ["Materiales", "Rapido"];
                let anterior = this.espacios_crafteador[this.estaseleccionado];
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

        Array.from(this.recetario.getElementsByClassName("crafteo")).forEach(crafteo => {
            crafteo.addEventListener("click", (e) => {
               //console.log"se ejecuta el evento");
                let resultado = crafteo.querySelector(".resultado");
                let id_resultado = resultado.querySelector(".id_objeto");
                let cantidad_resultado = resultado.querySelector(".cantidad");
                let espacio_libre = false;
                this.crafteador_objetos.Rapido.forEach(objeto => {
                    if(!espacio_libre)
                    {
                        const id_objeto = objeto.querySelector(".id_objeto");
                        if(id_objeto.textContent == "" || id_objeto.textContent == id_resultado)
                        {
                            espacio_libre = true;    
                        }
                    }
                });
                if(!espacio_libre)
                {
                   //console.log"No hay espacio suficiente");
                }
                else
                {
                    const precio = crafteo.querySelector(".precio");
                    let necesario = [];
                    let puede = true;
                    Array.from(precio.getElementsByClassName("objeto")).forEach(objeto =>{
                        const id = objeto.querySelector(".id_objeto");
                        const cantidad = objeto.querySelector(".cantidad");
                        let aux = false;
                        
                        this.crafteador_objetos.Materiales.forEach(Material =>{

                            /*console.log("necesito: ");
                            console.log(objeto);
                            console.log("Tengo: ");
                            console.log(Material);*/
                            const id_objeto = Material.querySelector(".id_objeto");
                            const cantidad_objeto = Material.querySelector(".cantidad");

                           //console.log"id_necesario: " + id.textContent + ", id_material: " + id_objeto.textContent);
                           //console.log"cantidad_necesario: " + cantidad.textContent + ", cantidad_material: " + cantidad_objeto.textContent);
                           //console.log);
                            if(id_objeto.textContent == id.textContent && cantidad_objeto.textContent >= cantidad.textContent)
                            {
                                aux = true;
                            }
                        });
                    
                        necesario.push({"id": id.textContent, "cantidad": cantidad.textContent, "esta": aux});
                    });

                    for(let i = 0; i < necesario.length; i++)
                    {
                        if(!necesario[i].esta)
                        {
                            puede = false;
                           //console.log"No tiene lo necesario");
                        }
                    }


                    if(puede)
                    {
                        
                       //console.log"Haciendo la compra");
                       //console.lognecesario);
                        necesario.forEach(objeto => {
                            const id = objeto.id;
                            const cantidad = objeto.cantidad;

                            this.crafteador_objetos.Materiales.forEach(objeto =>{
                                const id_objeto = objeto.querySelector(".id_objeto");

                                if(id_objeto == id)
                                {
                                    this.reducirObjetoDeInventario("Materiales", id, cantidad);
                                }
                            });
                        });

                        this.guardarObjetoEnInventario("Rapido", id_resultado.textContent, cantidad_resultado.textContent); 
                    }
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

        crafteador.forEach((espacio, i) => {
            inventario[i].innerHTML = espacio.innerHTML;
        });
    }
}