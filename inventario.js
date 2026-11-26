
import { Objetos } from "./objetos.js";

import { Construccion } from "./constructor.js";


export class Inventario {

    constructor() {

        this.cons = new Construccion(this);

        this.inventario_html = document.getElementById("Inv_objetos");

        this.espacios_inventario = Array.from(
            this.inventario_html.getElementsByClassName("espacio_inv")
        );

        this.inventario_objetos = {
            Insumos: [],
            Herramientas: [],
            Materiales: [],
            Rapido: []
        };

        this.inventario_objetos.Insumos = this.espacios_inventario.slice(0, 5);
        this.inventario_objetos.Herramientas = this.espacios_inventario.slice(5, 10);
        this.inventario_objetos.Materiales = this.espacios_inventario.slice(10, 15);
        this.inventario_objetos.Rapido = this.espacios_inventario.slice(15, 20);

        this.estaseleccionado = null;


        // Crafteo

        this.crafteador_html = document.getElementById("Crafteador");

        this.espacios_crafteador = Array.from(
            this.crafteador_html.getElementsByClassName("espacio_inv")
        );

        this.crafteador_objetos = {
            Materiales: [],
            Rapido: []
        };

        this.crafteador_objetos.Materiales = this.espacios_crafteador.slice(0, 5);
        this.crafteador_objetos.Rapido = this.espacios_crafteador.slice(5, 10);


        // Inventario de construcciones

        const contConstr = document.getElementById("inventari_de_construcciones");

        contConstr.innerHTML = "";

        for (let k = 0; k < 8; k++) {

            const slot = document.createElement("div");

            slot.className = "espacio espacio_inv";

            slot.innerHTML = `
                <p class="seleccionado">false</p>
                <p class="id_objeto"></p>
                <p class="nombre_objeto"></p>
                <p class="cantidad"></p>
                <p class="descripcion"></p>
                <img src="" alt="" class="imagen_Item">
            `;

            contConstr.appendChild(slot);

        }

        this.espacios_construccion = Array.from(
            contConstr.getElementsByClassName("espacio_inv")
        );


        // Inventario secundario (espejo del principal)

        const casillas = (id) =>
            Array.from(
                document.getElementById(id).getElementsByClassName("espacio_inv")
            );

        this.secundario_objetos = {

            Insumos: casillas("Insumos_secundario"),

            Herramientas: casillas("Herramientas_secundario"),

            Materiales: casillas("Materiales_secundario"),

            Rapido: casillas("Rapido_secundario")

        };

        // Lista plana del secundario, en el mismo orden que espacios_inventario (0-19)

        this.espacios_secundario = Object.values(this.secundario_objetos).flat();


        // Inventario rápido

        this.Rapido = document.getElementById("mini_Rapido");

        this.rapidos = Array.from(
            this.Rapido.getElementsByClassName("espacio_inv")
        );


        this.id_select_inv = 0;

        this.pintar_seleccionado();

        this.eventos();

    }


    guardarObjetoEnInventario(categoria, id, cantidad) {

        let espacios = this.inventario_objetos[categoria];

        let aux = false;
        let esta = false;

        espacios.forEach((espacio) => {

            if (esta) return;

            let idElement = espacio.querySelector(".id_objeto");

            if (idElement.textContent == id) {

                aux = this.aumentarObjetoDeInventario(categoria, id, cantidad);

                esta = true;

            }

        });

        if (!esta) {

            espacios.forEach((espacio) => {

                if (aux) return;

                let imgElement = espacio.querySelector(".imagen_Item");

                let idElement = espacio.querySelector(".id_objeto");

                if (idElement.textContent == "") {

                    aux = true;

                    imgElement.src = Objetos[id].src;

                }
                else {

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

        this.sincronizarInventarios(categoria);

        return aux;

    }


    eliminarObjetoDeInventario(categoria, id) {

        let aux = false;

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

        let aux = false;

        let espacios = this.inventario_objetos[categoria];

        espacios.forEach((espacio) => {

            if (aux) return;

            let idElement = espacio.querySelector(".id_objeto");

            if (idElement.textContent == id) {

                let cantidadElement = espacio.querySelector(".cantidad");

                if (parseInt(cantidadElement.textContent) - cantidad == 0) {

                    aux = this.eliminarObjetoDeInventario(categoria, id);

                    return;

                }

                else if (parseInt(cantidadElement.textContent) - cantidad < 0) {

                    alert("No tienes suficientes objetos para realizar esta acción");

                    return false;

                }

                cantidadElement.textContent =
                    parseInt(cantidadElement.textContent) - cantidad;

                aux = true;

            }

        });

        this.sincronizarInventarios(categoria);

        return aux;

    }


    aumentarObjetoDeInventario(categoria, id, cantidad) {

        let aux = false;

        let espacios = this.inventario_objetos[categoria];

        espacios.forEach((espacio) => {

            let idElement = espacio.querySelector(".id_objeto");

            if (idElement.textContent == id) {

                let cantidadElement = espacio.querySelector(".cantidad");

                cantidadElement.textContent =
                    parseInt(cantidadElement.textContent) + cantidad;

                aux = true;

            }

        });

        this.sincronizarInventarios(categoria);

        return aux;

    }


    eventos() {

        this.espacios_inventario.forEach((espacio, i) => {

            espacio.addEventListener("click", () => this.clickEspacio(i));

        });

        this.espacios_secundario.forEach((espacio, i) => {

            espacio.addEventListener("click", () => this.clickEspacio(i));

        });


        window.addEventListener("keydown", (e) => {

            const tecla = e.key.toLowerCase();

            const teclas = {
                "arrowleft": -1,
                "arrowright": 1
            };

            if (tecla in teclas) {

                if (this.id_select_inv + teclas[tecla] > 4) {

                    this.id_select_inv = 0;

                }

                else if (this.id_select_inv + teclas[tecla] < 0) {

                    this.id_select_inv = 4;

                }

                else {

                    this.id_select_inv += teclas[tecla];

                }

                this.pintar_seleccionado();

            }

            if (tecla == "arrowdown") {

                this.cons.construir(
                    this.transformar("Rapido", this.id_select_inv)
                );

            }

        });

    }


    pintar_seleccionado() {

        for (let i = 0; i < this.rapidos.length; i++) {

            if (i != this.id_select_inv) {

                this.rapidos[i].classList.remove("seleccionado");

            }
            else {

                this.rapidos[i].classList.add("seleccionado");

            }

        }

    }


    clickEspacio(i) {

        const categorias = [
            "Insumos",
            "Herramientas",
            "Materiales",
            "Rapido"
        ];

        const espacio = this.espacios_inventario[i];

        const anterior = this.espacios_inventario[this.estaseleccionado];


        if (anterior) {

            if (i == this.estaseleccionado) {

                this.des_activar(espacio);

                this.estaseleccionado = null;

            }

            else if (
                Math.floor(i / 5) ==
                Math.floor(this.estaseleccionado / 5)
            ) {

                if (anterior.querySelector(".id_objeto").textContent) {

                    this.des_activar(anterior);

                    this.estaseleccionado = null;

                    const anterior_html = anterior.innerHTML;

                    anterior.innerHTML = espacio.innerHTML;

                    espacio.innerHTML = anterior_html;

                    this.sincronizarInventarios(
                        categorias[Math.floor(i / 5)]
                    );

                }
                else {

                    this.des_activar(anterior);

                    this.des_activar(espacio);

                    this.estaseleccionado = i;

                }

            }

            else {

                this.des_activar(anterior);

                this.des_activar(espacio);

                this.estaseleccionado = i;

            }

        }

        else {

            this.des_activar(espacio);

            this.estaseleccionado = i;

        }

    }


    // Marca o desmarca la casilla en el principal y en su espejo del secundario

    des_activar(espacio) {

        const i = this.espacios_inventario.indexOf(espacio);

        const marcar =
            espacio.querySelector(".seleccionado").textContent.trim() !== "true";

        [
            this.espacios_inventario[i],
            this.espacios_secundario[i]
        ].forEach((e) => {

            e.querySelector(".seleccionado").textContent =
                marcar ? "true" : "false";

            e.classList.toggle("seleccionado", marcar);

        });

    }


    transformar(categoria, id) {

        let objetivo = this.inventario_objetos[categoria][id];

        let id_objeto = objetivo.querySelector(".id_objeto");

        if (id_objeto.textContent == "") {

            return false;

        }

        return id_objeto.textContent;

    }


    sincronizarInventarios(categoria) 
    {

        let inventario = this.inventario_objetos[categoria];

        // Secundario: refleja las 4 categorías

        let secundario = this.secundario_objetos[categoria];

        inventario.forEach((espacio, i) => {

            secundario[i].innerHTML = espacio.innerHTML;

        });


        // Crafteador y mini rápido: solo Materiales y Rápido

        if (categoria !== "Materiales" && categoria !== "Rapido") return;

        let crafteador = this.crafteador_objetos[categoria];

        let rapidos = this.rapidos;

        inventario.forEach((espacio, i) => {

            crafteador[i].innerHTML = espacio.innerHTML;

        });

        if (categoria === "Rapido") {

            inventario.forEach((espacio, i) => {

                rapidos[i].innerHTML = espacio.innerHTML;

            });

        }

    }

}
