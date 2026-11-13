
export class Inventario {
    constructor() {
        this.inventario_html = document.getElementById("inv_objetos");
        this.espacios_inventario = this.inventario_html.getElementsByClassName("espacio_inv");
        this.inventario_objetos = {Insumos: [], Herramientas: [], Materiales: [], Rapido: []};
        this.inventario_objetos.Insumos = Array.from(this.espacios_inventario).slice(0, 5);
        this.inventario_objetos.Herramientas = Array.from(this.espacios_inventario).slice(5, 10);
        this.inventario_objetos.Materiales = Array.from(this.espacios_inventario).slice(10, 15);
        this.inventario_objetos.Rapido = Array.from(this.espacios_inventario).slice(15, 20);
    }

    guardarObjetoEnInventario(categoria, imagen, nombre, descripcion) {
        let espacios = this.inventario_objetos[categoria];
        let aux = false; //(para verificar si se guardo el objeto o no, por si no hay espacios libres)
        espacios.forEach((espacio) => {
            let imgElement = espacio.querySelector(".imagen_Item");
            if (imgElement.src === "" || imgElement.src === window.location.href) 
            {
                aux = true;
                imgElement.src = imagen;
            }
            let nombreElement = espacio.querySelector(".nombre_objeto");
            nombreElement.textContent = nombre;
            let descripcionElement = espacio.querySelector(".descripcion");
            descripcionElement.textContent = descripcion;
        });
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
                idElement.textContent = "";
                aux = true;
            }
        });
        return aux;
    }
}