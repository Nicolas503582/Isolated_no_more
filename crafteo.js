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

        // Inventario secundario (espejo)
        const casillas = (id) =>
            Array.from(document.getElementById(id).getElementsByClassName("espacio_inv"));

        this.secundario_objetos = {
            Materiales: casillas("Materiales_secundario"),
            Rapido: casillas("Rapido_secundario")
        };
         
        this.Rapido = document.getElementById("mini_Rapido");
        this.rapidos = Array.from(this.Rapido.getElementsByClassName("espacio_inv"));

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
            crafteo.addEventListener("click", () => {

                const resultado = crafteo.querySelector(".resultado");
                const idResultado = Number(resultado.querySelector(".id_objeto").textContent);
                const cantidadResultado = Number(resultado.querySelector(".cantidad").textContent);

                // Comprobar si hay espacio para el resultado.
                let espacioLibre = false;

                this.crafteador_objetos.Rapido.forEach(objeto => {
                    const idObjeto = objeto.querySelector(".id_objeto").textContent;

                    if (idObjeto === "" || Number(idObjeto) === idResultado) {
                        espacioLibre = true;
                    }
                });

                if (!espacioLibre) {
                    console.log("No hay espacio suficiente en el inventario rápido.");
                    return;
                }

                // Comprobar los materiales necesarios.
                const precio = crafteo.querySelector(".precio");
                const necesario = [];
                let puede = true;

                Array.from(precio.getElementsByClassName("objeto")).forEach(objeto => {

                    const id = Number(objeto.querySelector(".id_objeto").textContent);
                    const cantidad = Number(objeto.querySelector(".cantidad").textContent);

                    let cantidadDisponible = 0;

                    this.crafteador_objetos.Materiales.forEach(material => {

                        const idMaterial = Number(material.querySelector(".id_objeto").textContent);
                        const cantidadMaterial = Number(material.querySelector(".cantidad").textContent);

                        if (idMaterial === id) {
                            cantidadDisponible += cantidadMaterial;
                        }
                    });

                    if (cantidadDisponible < cantidad) {
                        puede = false;
                    }

                    necesario.push({ id, cantidad });
                });

                if (!puede) {
                    console.log("No tenés los materiales necesarios.");
                    return;
                }

                // Descontar los materiales.
                necesario.forEach(material => {
                    this.reducirObjetoDeInventario(
                        "Materiales",
                        material.id,
                        material.cantidad
                    );
                });

                // Entregar el resultado.
                this.guardarObjetoEnInventario(
                    "Rapido",
                    idResultado,
                    cantidadResultado
                );

                console.log("Crafteo realizado correctamente.");
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
        let secundario = this.secundario_objetos[categoria];
        let rapidos = this.rapidos;

        crafteador.forEach((espacio, i) => {
            inventario[i].innerHTML = espacio.innerHTML;
            secundario[i].innerHTML = espacio.innerHTML;
        });

        if (categoria === "Rapido") {
            inventario.forEach((espacio, i) => {
                rapidos[i].innerHTML = espacio.innerHTML;
            });
        }
    }
}