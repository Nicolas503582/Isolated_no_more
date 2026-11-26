<?php
session_start();
$color_general = $_SESSION["color_general"];
$saturacion = $_SESSION["saturacion"];
$tono = $_SESSION["tono"];


$color_cabeza = $_SESSION["color_cabeza"];
$color_torso = $_SESSION["color_torso"];
$color_brazo = $_SESSION["color_brazo"];
$color_pierna = $_SESSION["color_pierna"];

$cabeza = $_SESSION["id_cabeza"];
$torso = $_SESSION["id_torso"];
$brazo = $_SESSION["id_brazo"];
$pierna = $_SESSION["id_pierna"];


header("Content-Type: application/javascript");

?>

import { Animal } from "./animales.js";
import { Parcela } from "./parcelas.js";
import { Corral } from "./corrales.js";
import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";
import { Inventario } from "./inventario.js";
import { Crafteador } from "./crafteo.js";
import { Construccion } from "./construccion.js";
import { Objetos } from "./objetos.js";
import { FuenteRecurso } from "./fuentes_recursos.js";


let Guardar = document.getElementById("guardar_partido");
let vida_html = document.getElementById("vida");

const calculo = new calculos();
let inv = new Inventario();
let craf = new Crafteador();

let canvas = document.getElementById("juego");
let ctx = canvas.getContext("2d", {willReadFrequently: true});

let Cara_UI = document.getElementById("cara_robot");
let ctx_UI_cara = Cara_UI.getContext("2d");

let inventario = document.getElementById("Inventario");

let inventario_html = document.getElementById("Inv_objetos");
let ingreso_inv = document.getElementById("ingreso_inv");
let inv_de_construccion_activo = false;
let parcelaAbierta = null;
let espacios_inventario = Array.from(inventario_html.getElementsByClassName("espacio_inv"));
let inventario_objetos = {Insumos: [], Herramientas: [], Materiales: [], Rapido: []};
inventario_objetos.Insumos = espacios_inventario.slice(0, 5);
inventario_objetos.Herramientas = espacios_inventario.slice(5, 10);
inventario_objetos.Materiales = espacios_inventario.slice(10, 15);
inventario_objetos.Rapido = espacios_inventario.slice(15, 20);

let crafteador = document.getElementById("Crafteador");

let crafteador_html = document.getElementById("Crafteador");
let espacios_crafteador = Array.from(crafteador_html.getElementsByClassName("espacio_inv"));
let crafteador_objetos = {Materiales: [], Rapido: []};
crafteador_objetos.Materiales = espacios_crafteador.slice(0, 5);
crafteador_objetos.Rapido = espacios_crafteador.slice(5, 10);

let inv_activo = false;
let craf_activo = false;

let equipamiento = document.getElementById("canvas_equipamiento");
let ctx_robot = equipamiento.getContext("2d");
/*let hamster = document.getElementById("canvas_hamster");
let ctx_hamster = hamster.getContext("2d");*/

let hora_html = document.getElementById("hora");
let minuto_html = document.getElementById("minuto");
let hora_text = "00";
let minuto_text = "00";

let teclas = {a: false, d: false, s: false, w: false, e: false, q: false, j: false, shift: false, r: false};
let entidades_id = 0;
let direccion = {x : 0, y: 0, z: 0};
let espacio_x = [];
let espacio_y = [];
let imagenes = {};
let imagenesExtra = [];
const rutasGenerales = ["./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png"];

let dias = 0;
let horas = 0;
let minutos = 0;
let time = 0;
let time_del = 0;

let entidades = [];
let entidades_dibujables = [];
let color_post = <?php echo $color_general; ?>;
let saturacion_post = <?php echo $saturacion; ?>;
let tono_post = <?php echo $tono; ?>;
let cabeza = <?php echo $cabeza;?>;
let cabeza_color = <?php echo $color_cabeza;?>;
let brazo = <?php echo $brazo;?>;
let brazo_color = <?php echo $color_brazo;?>;
let torso = <?php echo $torso;?>;
let torso_color = <?php echo $color_torso;?>;
let pierna = <?php echo $pierna;?>;
let pierna_color = <?php echo $color_pierna;?>;

const mapas = {
    bosque: {
        fondo: "./mapa/monte.png",

        conexiones: {
            derecha: "bosque2",
            izquierda: null,
            arriba: null,
            abajo: "bosque4"
        },

        entidades: [
            { tipo: "recurso", x: 300, y: 200, idObjeto: 16 },
            // Más árboles, rocas, etc.
        ],

        instancias: []
    },

    bosque2: {
        fondo: "./mapa/monte.png",

        conexiones: {
            derecha: "bosque3",
            izquierda: "bosque",
            arriba: null,
            abajo: "bosque5"
        },

        entidades: [
            { tipo: "recurso", x: 250, y: 300, idObjeto: 16 }
        ],

        instancias: []
    },

    bosque3: {
        fondo: "./mapa/monte.png",

        conexiones: {
            derecha: null,
            izquierda: "bosque2",
            arriba: null,
            abajo: "bosque6"
        },

        entidades: [],

        instancias: []
    },

    bosque4: {
        fondo: "./mapa/monte.png",

        conexiones: {
            derecha: "bosque5",
            izquierda: null,
            arriba: "bosque",
            abajo: null
        },

        entidades: [],
        instancias: []
    },

    bosque5: {
        fondo: "./mapa/monte.png",

        conexiones: {
            derecha: "bosque6",
            izquierda: "bosque4",
            arriba: "bosque2",
            abajo: null
        },

        entidades: [],
        instancias: []
    },

    bosque6: {
        fondo: "./mapa/monte.png",

        conexiones: {
            derecha: null,
            izquierda: "bosque5",
            arriba: "bosque3",
            abajo: null
        },

        entidades: [],
        instancias: []
    }
};

let mapaActual = null;
let mapa = {
    ancho: 0,
    alto: 0
};
let fondoActual = null;

async function inicializarMapas() {

    for (const [id, datos] of Object.entries(mapas)) {

        // Cargar el fondo.
        const imagen = await cargarImagen(datos.fondo);

        datos.imagen = imagen;

        // Crear las entidades permanentes una sola vez.
        datos.instancias = datos.entidades.map(datosEntidad => {

            if (datosEntidad.tipo === "recurso") {

                const objeto = Objetos.find(
                    o => o.id === datosEntidad.idObjeto
                );

                if (!objeto) return null;

                return new FuenteRecurso(
                    datosEntidad.x,
                    datosEntidad.y,
                    entidades_id++,
                    objeto
                );
            }

            return null;
        }).filter(entidad => entidad !== null);
    }

    cambiarMapa("bosque", "inicio");
}

let camara = {
    x: 0,
    y: 0
};

brazo += 1;
cabeza += 1;
torso += 1;
pierna += 1;

let cabeza_rgb = calculo.hsvToRgba(cabeza_color, 100, 100);
let brazo_rgb = calculo.hsvToRgba(brazo_color, 100, 100);
let torso_rgb = calculo.hsvToRgba(torso_color, 100, 100);
let pierna_rgb = calculo.hsvToRgba(pierna_color, 100, 100);

let aux_entidad = 0;

const v  = tono_post;
const s  = saturacion_post;

//console.log("h: " + color_post + ", s: " + s + ", v: " + v);
let color_rgb = calculo.hsvToRgba(color_post, 100, 100);
let robot1 = new Entidad(
    100,
    100,
    {x: 8, y: 50, alto: 12, ancho: 19},
    2,
    entidades_id++
);

// El movimiento conoce los límites del mundo.
robot1.movimiento.limites = mapa;

//console.log(robot1);
for(let i = robot1.x+robot1.hitbox.x; i< robot1.x+robot1.hitbox.x+robot1.hitbox.ancho; i++)
{
    espacio_x[i] = [0]; 
}
for(let i = robot1.y+robot1.hitbox.y; i< robot1.y+robot1.hitbox.y+robot1.hitbox.alto; i++)
{
    espacio_y[i] = [0]; 
}

let h = 0;

entidades.push(robot1);
entidades_dibujables.push(robot1);

// Buscar los datos del árbol

function loop() {
  //console.log(entidades);

    if(!inv_activo && !craf_activo && !inv_de_construccion_activo)
    {
        if(aux_entidad >= 30)
        {
            if (aux_entidad >= 30) {

                if (entidades.filter(e => e.tipo === "animal" && !e.domesticado).length < 5) {

                    const datosAnimal = Objetos.find(objeto =>
                        objeto.categoria === "animal"
                    );

                    if (datosAnimal) {

                        const animal = new Animal(
                            100,
                            150,
                            entidades_id++,
                            datosAnimal
                        );

                        entidades.push(animal);

                        actualizar_espacio(animal);
                    }

                }

                aux_entidad = 0;
            }
        }
        else
        {
            //categoria, imagen, nombre, descripcion, id, cantidad
            //console.log("aaaa");
            inv.guardarObjetoEnInventario("Materiales", 1, 85);
            aux_entidad++;
        }
        //ajustarResolucionCanvas(canvas, ctx);
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.width, canvas.height);

        //console.log("5485");
        
        direccion.x = teclas.d - teclas.a;
direccion.z = teclas.s - teclas.w;

// Determinar hacia dónde mira el robot.
if (direccion.x > 0) {
    robot1.cambiarDireccionRobot("derecha");
}
else if (direccion.x < 0) {
    robot1.cambiarDireccionRobot("izquierda");
}
else if (direccion.z > 0) {
    robot1.cambiarDireccionRobot("frente");
}
else if (direccion.z < 0) {
    robot1.cambiarDireccionRobot("atras");
}

// Mover al robot.
robot1.movimiento.moviendo(
    direccion,
    espacio_x,
    espacio_y,
    0
);
robot1.actualizarAnimacion();
        //movimiento
        /*//console.log("y: " + espacio_y);
        //console.log("x: " + espacio_x);*/

        entidades.forEach(entidad => {
            if (entidad.tipo === "animal" && entidad.domesticado) {

                entidad.movimiento.limites = mapa;

                entidad.movimiento.moverAleatorio(
                    espacio_x,
                    espacio_y
                );
            }
        });

        actualizarCamara();

        ctx.save();

        ctx.translate(-camara.x, -camara.y);

        // Dibujar mapa
        if (fondoActual && fondoActual.complete && fondoActual.naturalWidth > 0) {
            ctx.drawImage(fondoActual, 0, 0);
        }

        // Dibujar entidades
        entidades.forEach(entidad => {
            entidad.dibujar(
                canvas,
                ctx,
                entidad.tipo === "animal" ? 0.5 : 1
            );
        });

        ctx.restore();
        
        //console.log(entidades);
    }
    else if (!craf_activo && !inv_de_construccion_activo){
        ctx_robot.clearRect(0, 0, equipamiento.width, equipamiento.height);
        ctx_robot.fillStyle = "white";
        ctx_robot.fillRect (0, 0, equipamiento.width, equipamiento.height);
        robot1.dibujar_max(equipamiento, ctx_robot, equipamiento.width, equipamiento.height);
    }
    else if(!inv_de_construccion_activo)
    {
        
    }
    else
    {
        
    }
    time++;
    if(time >= 60)
    {
        minutos++;
        if(minutos >= 60)
        {
            minutos = 0;
            horas++;
            if(horas >= 24)
            {
                horas = 0;
                dias++;
            }
            if(horas < 10)
            {
                hora_text = "0" + horas;
            }
            else
            {
                hora_text = horas;
            }
        }
        time = 0;
        if(minutos < 10)
        {
            minuto_text = "0" + minutos;
        }
        else
        {
            minuto_text = minutos;
        }
        hora_html.textContent = hora_text;
        minuto_html.textContent = minuto_text;
        time_del++;
        if(time_del >= 5)
        {
            const evento = new CustomEvent('5_minutos', {
                detail: "pasaron 5 minutos"
            });
            
            document.dispatchEvent(evento);
            time_del = 0;
        }
    }
    requestAnimationFrame(loop);
}

function actualizarCamara() {
    const anchoPantalla = canvas.clientWidth;
    const altoPantalla = canvas.clientHeight;

    const jugadorX = robot1.x + robot1.hitbox.x + robot1.hitbox.ancho / 2;
    const jugadorY = robot1.y + robot1.hitbox.y + robot1.hitbox.alto / 2;

    // Posición ideal de la cámara: jugador en el centro
    let camaraX = jugadorX - anchoPantalla / 2;
    let camaraY = jugadorY - altoPantalla / 2;

    // Límites de la cámara
    const maxX = Math.max(0, mapa.ancho - anchoPantalla);
    const maxY = Math.max(0, mapa.alto - altoPantalla);

    // Evitar que la cámara salga del mapa
    camara.x = Math.max(0, Math.min(camaraX, maxX));
    camara.y = Math.max(0, Math.min(camaraY, maxY));
}

function jerarquia() {
    entidades.sort((a, b) => {

        // Si una entidad es un animal dentro de un corral,
        // usamos la profundidad del animal normalmente.
        const profundidadA = a.y + a.hitbox.y + a.hitbox.alto;
        const profundidadB = b.y + b.hitbox.y + b.hitbox.alto;

        // Si el corral y uno de sus animales se comparan,
        // el corral siempre se dibuja primero.
        if (a.tipo === "corral" && b.corral === a) return -1;
        if (b.tipo === "corral" && a.corral === b) return 1;

        return profundidadA - profundidadB ||
            b.x - a.x;
    });
}

function cambiarMapa(idMapa, direccionEntrada) {

    console.log("Cambiando mapa:", {
        anterior: mapaActual,
        nuevo: idMapa,
        entrada: direccionEntrada
    });
    const nuevoMapa = mapas[idMapa];

    if (!nuevoMapa) return;

    // Guardar las entidades del mapa que estamos abandonando.
    if (mapaActual) {
        mapaActual.instancias = entidades.filter(
            entidad => entidad !== robot1
        );
    }

    mapaActual = nuevoMapa;
    fondoActual = nuevoMapa.imagen;

    // Actualizar dimensiones.
    mapa.ancho = fondoActual.naturalWidth;
    mapa.alto = fondoActual.naturalHeight;

    // Colocar al jugador en el extremo opuesto.

    const margen = 5;

switch (direccionEntrada) {
    case "izquierda":
        robot1.x = margen - robot1.hitbox.x;
        break;

    case "derecha":
        robot1.x = mapa.ancho - robot1.hitbox.ancho
            - robot1.hitbox.x - margen;
        break;

    case "arriba":
        robot1.y = margen - robot1.hitbox.y + 80;
        break;

    case "abajo":
        robot1.y = mapa.alto - robot1.hitbox.alto
            - robot1.hitbox.y - margen;
        break;
}

    // Eliminar las entidades del mapa anterior de las listas activas.
    entidades = entidades.filter(entidad =>
        entidad === robot1
    );

    // Agregar las entidades del nuevo mapa.
    entidades.push(...mapaActual.instancias);

    // Reiniciar las matrices de colisión.
    espacio_x = Array.from(
        { length: mapa.ancho },
        () => []
    );

    espacio_y = Array.from(
        { length: mapa.alto },
        () => []
    );

    // Registrar todas las entidades del mapa actual.
    entidades.forEach(entidad => {
        actualizar_espacio(entidad);
    });

    // Actualizar la cámara.
    actualizarCamara();
}

function ajustarResolucionCanvas(can, contexto, bool = true) {
    let anchoVisual, altoVisual;

    if (bool) {
        anchoVisual = window.innerWidth - 10;
        altoVisual = window.innerHeight - 10;
    }
    else {
        const rect = can.getBoundingClientRect();

        anchoVisual = rect.width - 10;
        altoVisual = rect.height - 10;
    }

    const dpr = window.devicePixelRatio || 1;

    can.style.width = anchoVisual + "px";
    can.style.height = altoVisual + "px";

    can.width = Math.round(anchoVisual * dpr);
    can.height = Math.round(altoVisual * dpr);

    // Evita acumular escalados cuando se cambia el tamaño.
    contexto.setTransform(dpr, 0, 0, dpr, 0, 0);

    contexto.imageSmoothingEnabled = false;
}

/*window.addEventListener('wheel', (e) => {
    h += (e.deltaY/3)/8;
    while(h < 0 || h > 360)
    {
        if(h > 360) h -=360;
        if(h < 0) h += 360;
    }
});*/

window.addEventListener("keydown", (e) => {
    const tecla = e.key.toLowerCase();
    if(tecla in teclas){
        if(tecla == "e" && !teclas[tecla]  && !craf_activo && !inv_de_construccion_activo)
        {
            inventario.classList.toggle("activo");
            inv_activo = inv_activo ? false : true;
        }
        if(tecla == "q" && !teclas[tecla]  && !inv_activo && !inv_de_construccion_activo)
        {
            crafteador.classList.toggle("activo");
            craf_activo = craf_activo ? false : true;
        }
        
        if(tecla == "j" && !teclas[tecla])
        {  
            let vidas = Array.from(document.getElementsByClassName("rayito"));
            if(robot1.vida.actual >=0)
            {
                vidas[robot1.vida.actual].src = "./rayo_rojo.png";
                robot1.vida.actual -=1;
            }
        }
        if(tecla == "shift" && !teclas[tecla])
        {
            robot1.velocidad +=5;
            robot1.animacionPiernas.velocidad -=2;
        }
        if (tecla == "r" && !teclas[tecla] && !inv_activo && !craf_activo) {

            // Si hay un inventario de construcción abierto, cerrarlo.
            if (inv_de_construccion_activo) {
                inv_de_construccion_activo = false;
                ingreso_inv.classList.remove("visible");
                parcelaAbierta = null;
            }

            // Primero intentar recoger un animal salvaje.
            else if (recogerAnimalSalvaje()) {
                // Animal recogido.
            }

            // Después intentar recolectar una fuente de recursos.
            else if (recolectarFuenteRecurso()) {
                // Recurso recolectado.
            }

            // Si no hay animales ni fuentes cerca, buscar construcciones.
            else {
                const rango = 90;

                const jugador_x = robot1.x + robot1.hitbox.x + robot1.hitbox.ancho / 2;
                const jugador_y = robot1.y + robot1.hitbox.y + robot1.hitbox.alto / 2;

                let encontrada = null;
                let distanciaMenor = Infinity;

                entidades.forEach(entidad => {

                    if (entidad.id == robot1.id) return;

                    if (entidad.tipo != "corral" && entidad.tipo != "parcela") return;

                    const entidad_x = entidad.x + entidad.hitbox.x + entidad.hitbox.ancho / 2;
                    const entidad_y = entidad.y + entidad.hitbox.y + entidad.hitbox.alto / 2;

                    const dx = jugador_x - entidad_x;
                    const dy = jugador_y - entidad_y;

                    const distancia = Math.sqrt(dx * dx + dy * dy);

                    if (distancia <= rango && distancia < distanciaMenor) {
                        distanciaMenor = distancia;
                        encontrada = entidad;
                    }
                });

                if (encontrada) {
                    inv_de_construccion_activo = true;
                    ingreso_inv.classList.add("visible");

                    if (encontrada.tipo == "parcela") {
                        parcelaAbierta = encontrada;
                        rellenarInventarioParcela(encontrada);
                    }
                    else if (encontrada.tipo == "corral") {
                        parcelaAbierta = encontrada;
                        rellenarInventarioCorral(encontrada);
                    }
                }
            }
        }

        teclas[tecla] = true;
        console.log(teclas[tecla]);
        
    }
});
window.addEventListener("keyup", (e) => {
    const tecla = e.key.toLowerCase();
    teclas[tecla] = false;
    if(tecla == "shift")
    {
        robot1.animacionPiernas.velocidad += 2;
        robot1.velocidad -=5;
    }
});

window.addEventListener("resize", function(){
    ajustarResolucionCanvas(canvas, ctx);
    ajustarResolucionCanvas(equipamiento, ctx_robot, false);
});

function rellenarInventarioParcela(parcela)
{
    const contConstr = document.querySelector("#inventari_de_construcciones");
    const espacios = contConstr.querySelectorAll(".espacio");

   //console.log(parcela);

           //console.log(contConstr);
    espacios.forEach((slot, i) => {
           //console.log("asfdsdvgess");

        const id = parcela.cultivo[i];
        const estado = parcela.estado[i];

        const seleccionado = slot.querySelector(".seleccionado");
        const idObjeto = slot.querySelector(".id_objeto");
        const nombre = slot.querySelector(".nombre_objeto");
        const cantidad = slot.querySelector(".cantidad");
        const descripcion = slot.querySelector(".descripcion");
        const imagen = slot.querySelector(".imagen_Item");

        // Limpiar el espacio
        seleccionado.textContent = "false";
        idObjeto.textContent = "";
        nombre.textContent = "";
        cantidad.textContent = "";
        descripcion.textContent = "";
        imagen.src = "";

           //console.log("asfdsdvgess");
        // Si está vacío, no mostrar ningún cultivo
        if(estado == "vacio" || id == null)
        {

           //console.log("asfdsdvgess");
            return;
        }

        // Buscar la definición del cultivo por su ID
        const cultivo = Objetos.find(
            c => c.id == id
        );

        if(!cultivo) return;

        idObjeto.textContent = id;
        nombre.textContent = cultivo.nombre;

        descripcion.textContent = estado;

        if (estado === "sembrado") {
            descripcion.textContent = parcela.regada[i]
                ? "Regada"
                : "Necesita agua";
        }

        cantidad.textContent =
            estado == "listo" ? "Cosechar" : "Creciendo";

        // Mostrar imagen de la etapa actual

           //console.log("asfdsdvgess");
        if(cultivo.etapas && cultivo.etapas.length > 0)
        {
            const etapa = cultivo.etapas[0];

           //console.log("asfdsdvgess");

            imagen.src = typeof etapa == "string"
                ? etapa
                : etapa.src;
        }
    });
}
function rellenarInventarioCorral(corral)
{
    const contConstr = document.querySelector("#inventari_de_construcciones");
    const espacios = contConstr.querySelectorAll(".espacio");

    espacios.forEach((slot, i) => {
        const seleccionado = slot.querySelector(".seleccionado");
        const idObjeto = slot.querySelector(".id_objeto");
        const nombre = slot.querySelector(".nombre_objeto");
        const cantidad = slot.querySelector(".cantidad");
        const descripcion = slot.querySelector(".descripcion");
        const imagen = slot.querySelector(".imagen_Item");

        // Limpiar el espacio.
        seleccionado.textContent = "false";
        idObjeto.textContent = "";
        nombre.textContent = "";
        cantidad.textContent = "";
        descripcion.textContent = "";
        imagen.src = "";

        // Si todavía no hay un animal en esta posición.
        if (!corral.animales[i]) return;

        const animal = corral.animales[i].tipo;

        idObjeto.textContent = animal.id;
        nombre.textContent = animal.nombre;
        cantidad.textContent = "1";
        descripcion.textContent = corral.animales[i].alimentado
            ? "Alimentado"
            : "Sin alimentar";

        imagen.src = animal.src;
    });
}

function recolectarFuenteRecurso() {
    const rango = 90;

    const jugador_x = robot1.x + robot1.hitbox.x + robot1.hitbox.ancho / 2;
    const jugador_y = robot1.y + robot1.hitbox.y + robot1.hitbox.alto / 2;

    let fuenteCercana = null;
    let distanciaMenor = Infinity;

    entidades.forEach(entidad => {
        if (entidad.tipo !== "fuente_recurso") return;

        const entidad_x = entidad.x + entidad.hitbox.x + entidad.hitbox.ancho / 2;
        const entidad_y = entidad.y + entidad.hitbox.y + entidad.hitbox.alto / 2;

        const dx = jugador_x - entidad_x;
        const dy = jugador_y - entidad_y;

        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia <= rango && distancia < distanciaMenor) {
            distanciaMenor = distancia;
            fuenteCercana = entidad;
        }
    });

    if (!fuenteCercana) return false;

    const drops = fuenteCercana.recolectar();

    if (drops === false) {
        return true;
    }

    drops.forEach(recurso => {
        inv.guardarObjetoEnInventario(
            "Materiales",
            recurso.id,
            recurso.cantidad
        );
        console.log(recurso);
    });

    return true;
}

function recogerAnimalSalvaje() {
    const rango = 90;

    const jugador_x = robot1.x + robot1.hitbox.x + robot1.hitbox.ancho / 2;
    const jugador_y = robot1.y + robot1.hitbox.y + robot1.hitbox.alto / 2;

    let animalCercano = null;
    let distanciaMenor = Infinity;

    entidades.forEach(entidad => {

        if (
            entidad.tipo !== "animal" ||
            entidad.domesticado ||
            entidad.corral !== null
        ) return;

        const animal_x = entidad.x + entidad.hitbox.x + entidad.hitbox.ancho / 2;
        const animal_y = entidad.y + entidad.hitbox.y + entidad.hitbox.alto / 2;

        const dx = jugador_x - animal_x;
        const dy = jugador_y - animal_y;

        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia <= rango && distancia < distanciaMenor) {
            distanciaMenor = distancia;
            animalCercano = entidad;
        }
    });

    if (!animalCercano) return false;

    const idObjeto = animalCercano.datos.id;

    const guardado = inv.guardarObjetoEnInventario("Rapido", idObjeto, 1);

    if (!guardado) {
        alert("No tenés espacio en el inventario rápido.");
        return true;
    }

    eliminarEntidad(animalCercano);

    return true;
}

function eliminarEntidad(entidad) {
    if (!entidad) return false;

    // Liberar las posiciones que ocupaba en las matrices de colisión.
    quitar_espacio(entidad);

    // Eliminar de la lista principal de entidades.
    entidades = entidades.filter(e => e !== entidad);

    // Eliminar de la lista de entidades dibujables.
    entidades_dibujables = entidades_dibujables.filter(e => e !== entidad);

    return true;
}

function quitar_espacio(entidad) {
    const x = Math.floor(entidad.x + entidad.hitbox.x);
    const y = Math.floor(entidad.y + entidad.hitbox.y);

    const ancho = entidad.hitbox.ancho;
    const alto = entidad.hitbox.alto;

    const id = entidad.id;

    for (let i = x; i < x + ancho; i++) {
        if (!espacio_x[i]) continue;

        espacio_x[i] = espacio_x[i].filter(
            espacio => espacio !== id
        );
    }

    for (let i = y; i < y + alto; i++) {
        if (!espacio_y[i]) continue;

        espacio_y[i] = espacio_y[i].filter(
            espacio => espacio !== id
        );
    }
}

const botonRegar = document.getElementById("regar_todo");

if (botonRegar) {
    botonRegar.addEventListener("click", () => {

        if (!inv_de_construccion_activo || !parcelaAbierta) return;

        let cantidad = 0;

        if (parcelaAbierta.tipo === "parcela") {
            cantidad = parcelaAbierta.regarTodo();
        } 
        else if (parcelaAbierta.tipo === "corral") {
            cantidad = parcelaAbierta.alimentar();
        }

        if (parcelaAbierta.tipo === "parcela") {
            rellenarInventarioParcela(parcelaAbierta);
        }
        else if (parcelaAbierta.tipo === "corral") {
            rellenarInventarioCorral(parcelaAbierta);
        }

       //console.log(`Se regaron o alimentaron ${cantidad} espacios.`);
    });
}

// Siembra usando la casilla actualmente seleccionada del inventario rápido.
function sembrarJugador(parcela, posicion)
{
    // inv.id_select_inv es el índice 0-4 de la barra rápida.
    const id = inv.transformar("Rapido", inv.id_select_inv);

    if(id === false)
    {
       //console.log("No tenés ningún objeto seleccionado en el inventario rápido.");
        return;
    }

    // Buscar el objeto por su ID y comprobar que tenga datos de cultivo.
    const cultivo = Objetos.find(objeto =>
        objeto.id == id &&
        objeto.etapas &&
        objeto.tiempo !== undefined
    );

   //console.log(Objetos[id].id == id + " gbf" + Objetos[id].etapas + " bgsdf" + Objetos[id].tiempo !== undefined);

    if(!cultivo)
    {
       //console.log("El objeto seleccionado no es una semilla.");
        return;
    }

    // Verificar que la casilla tenga al menos una unidad.
    const slotRapido = inv.rapidos[inv.id_select_inv];
    const cantidad = Number(
        slotRapido.querySelector(".cantidad").textContent
    );

    if(!Number.isFinite(cantidad) || cantidad <= 0)
    {
       //console.log("No tenés semillas disponibles.");
        return;
    }

    // Parcela.sembrar recibe el ID del cultivo.
    const sembrado = parcela.sembrar(posicion, cultivo.id);

    if(!sembrado)
    {
       //console.log("Ese espacio de la parcela no está vacío o no se pudo sembrar.");
        return;
    }

    // Descontar una unidad desde la clase Inventario.
    // Esto también sincroniza el inventario principal, secundario y rápido.
    const descontado = inv.reducirObjetoDeInventario("Rapido", id, 1);

    if(!descontado)
    {
        // En condiciones normales no debería ocurrir porque ya comprobamos la cantidad.
        console.error("El cultivo se plantó, pero no se pudo descontar la semilla.");
    }

    rellenarInventarioParcela(parcela);

   //console.log("Sembraste:", cultivo.nombre);
}

// Evento delegado: permite hacer clic en cualquiera de los 8 espacios,
// incluso después de que se actualice el contenido HTML.
const contenedorParcelas = document.getElementById("inventari_de_construcciones");

function cocecharParcela(parcela, posicion)
{
    // Comprobar que la posición tenga una planta lista para cosechar.
    if(parcela.estado[posicion] !== "listo")
    {
       //console.log("No hay ningún cultivo listo para cosechar.");
        return;
    }

    const cultivo = parcela.obtenerCultivo(posicion);

    if(!cultivo)
    {
       //console.log("No se encontraron los datos del cultivo.");
        return;
    }

    // Obtener los objetos que entrega la cosecha.
    const cosecha = parcela.cosechar(posicion);

   //console.log("Resultado de la cosecha:", cosecha);
   //console.log("Inventario:", inv);
   console.log("Métodos del inventario:", Object.getOwnPropertyNames(
        Object.getPrototypeOf(inv)
    ));

    if(!cosecha)
    {
       //console.log("No se pudo cosechar.");
        return;
    }

    // Comprobar si hay espacio en el inventario rápido.
    for(const [id, cantidad] of Object.entries(cosecha))
    {
        const agregado = inv.guardarObjetoEnInventario("Rapido", Number(id), cantidad);

        if(!agregado)
        {
           //console.log("No hay espacio suficiente en el inventario rápido.");

            // Restaurar el cultivo en la parcela.
            parcela.cultivo[posicion] = cultivo.id;
            parcela.progreso[posicion] = cultivo.tiempo;
            parcela.regada[posicion] = true;
            parcela.estado[posicion] = "listo";

            return;
        }
    }

    rellenarInventarioParcela(parcela);

   //console.log("Cosechaste:", cultivo.nombre);
}
function ingresarAnimal(corral)
{
    // Obtener el objeto seleccionado en el inventario rápido.
    const id = inv.transformar("Rapido", inv.id_select_inv);

    if (id === false) return;

    // Buscar el objeto y comprobar que sea un animal.
    const animal = Objetos.find(objeto =>
        objeto.id == id &&
        objeto.categoria === "animal"
    );

    if (!animal) {
       //console.log("El objeto seleccionado no es un animal.");
        return;
    }

    // Comprobar que haya unidades disponibles.
    const slotRapido = inv.rapidos[inv.id_select_inv];

    const cantidad = Number(
        slotRapido.querySelector(".cantidad").textContent
    );

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
       //console.log("No tenés animales disponibles.");
        return;
    }

    // Intentar introducir el animal en el corral.
    const agregado = corral.agregarAnimal(id, entidades_id++, entidades);

    if (!agregado) {
       //console.log("El corral está lleno o no se pudo agregar el animal.");
        return;
    }

    // Descontar una unidad del inventario del jugador.
    const descontado = inv.reducirObjetoDeInventario("Rapido", id, 1);

    if (!descontado) {
        // Si no se pudo descontar, retirar el animal del corral.
        corral.quitarAnimal(corral.animales.length - 1);

        console.error("No se pudo descontar el animal del inventario.");
        return;
    }

    // Actualizar los espacios del corral.
    rellenarInventarioCorral(corral);

   //console.log("Agregaste una", animal.nombre, "al corral.");
}
contenedorParcelas.addEventListener("click", (e) => {

    if(!inv_de_construccion_activo) return;
    if(!parcelaAbierta) return;

    const slot = e.target.closest(".espacio");

    if(!slot || !contenedorParcelas.contains(slot)) return;

    const espacios = Array.from(
        contenedorParcelas.querySelectorAll(".espacio")
    );

    const posicion = espacios.indexOf(slot);

    if(posicion === -1) return;


    if (parcelaAbierta.tipo === "parcela") {
        cocecharParcela(parcelaAbierta, posicion);
        sembrarJugador(parcelaAbierta, posicion);
    }
    else if (parcelaAbierta.tipo === "corral") {
        ingresarAnimal(parcelaAbierta);
    }
});

robot1.movimiento.alSalirMapa = (direccionSalida) => {
    const idNuevoMapa = mapaActual.conexiones[direccionSalida];

    console.log("Intentando conectar:", {
        mapaActual: Object.keys(mapas).find(
            id => mapas[id] === mapaActual
        ),
        direccionSalida,
        destino: idNuevoMapa
    });

    if (!idNuevoMapa) return false;

    const entradas = {
        izquierda: "derecha",
        derecha: "izquierda",
        arriba: "abajo",
        abajo: "arriba"
    };

    cambiarMapa(idNuevoMapa, entradas[direccionSalida]);

    return true;
};
ajustarResolucionCanvas(canvas, ctx);

//evento personalizado
document.addEventListener('construir', (e) => {
    const propiedades = e.detail;
   //console.log(propiedades.tipo);
    if(propiedades.tipo == "parcela_cultivos")
    {
        const construccion = new Parcela(robot1.x + (-20 + 2 *20 * robot1.direccion.x) + robot1.hitbox.x, robot1.y + (-15 + 2 *20 * robot1.direccion.y), Objetos[propiedades.id].hitbox, entidades_id++, imagenesExtra[propiedades.id]);//Tengo que cambiar esta linea, para que se construya a distinta distancia según el tamaño de la construccion
        entidades.push(construccion);
        actualizar_espacio(construccion);
    }
    else if(propiedades.tipo == "corral")
    {
        const construccion = new Corral(robot1.x + (-20 + 2 *20 * robot1.direccion.x) + robot1.hitbox.x, robot1.y + (-15 + 2 *20 * robot1.direccion.y), Objetos[propiedades.id].hitbox, entidades_id++, imagenesExtra[propiedades.id]);//Tengo que cambiar esta linea, para que se construya a distinta distancia según el tamaño de la construccion
        entidades.push(construccion);
        actualizar_espacio(construccion);
    }
    else
    {
        const construccion = new Construccion(robot1.x + (-20 + 2 *20 * robot1.direccion.x) + robot1.hitbox.x, robot1.y + (-15 + 2 *20 * robot1.direccion.y), Objetos[propiedades.id].hitbox, entidades_id++, imagenesExtra[propiedades.id]);//Tengo que cambiar esta linea, para que se construya a distinta distancia según el tamaño de la construccion
        entidades.push(construccion);
       actualizar_espacio(construccion);
    }
});

function actualizar_espacio(entidad) {
    const x = Math.floor(entidad.x + entidad.hitbox.x);
    const y = Math.floor(entidad.y + entidad.hitbox.y);

    const ancho = entidad.hitbox.ancho;
    const alto = entidad.hitbox.alto;

    const id = entidad.id;

    for (let i = x; i < x + ancho; i++) {
        if (!espacio_x[i]) espacio_x[i] = [];

        espacio_x[i].push(id);
    }

    for (let i = y; i < y + alto; i++) {
        if (!espacio_y[i]) espacio_y[i] = [];

        espacio_y[i].push(id);
    }
}


const rutasRobot = {
    frente: {
        cabeza: `cabezaR${cabeza}_post.png`,
        torso: `torsoR${torso}.png`,

        brazos: [
            `brazoR${brazo}_izq.png`,
            `brazoR${brazo}_der.png`
        ],

        antebrazos: [
            `antebrazoR${brazo}_izq.png`,
            `antebrazoR${brazo}_der.png`
        ],

        piernas: [
            `piernaR${pierna}_izq.png`,
            `piernaR${pierna}_der.png`
        ]
    },

    derecha: {
        carpeta: "perfil_der/"
    },

    izquierda: {
        carpeta: "perfil_izq/"
    },

    atras: {
        cabeza: `cabezaR${cabeza}_ant.png`,
        torso: `torsoR${torso}.png`,

        brazos: [
            `brazoR${brazo}_izq.png`,
            `brazoR${brazo}_der.png`
        ],

        antebrazos: [
            `antebrazoR${brazo}_izq.png`,
            `antebrazoR${brazo}_der.png`
        ],

        piernas: [
            `piernaR${pierna}_izq_ant.png`,
            `piernaR${pierna}_der_ant.png`
        ]
    }
};


async function cargarSpritesDireccion(direccion) {

    const cargarParte = async (id, archivo, perfil = "") => {
        const ruta = `./Robot${id}/${perfil}${archivo}`;
        return await cargarImagen(ruta);
    };

    // =========================================
    // PERFILES
    // =========================================

    if (direccion === "derecha" || direccion === "izquierda") {

        const perfil = direccion === "derecha"
            ? "perfil_der/"
            : "perfil_izq/";

        const [
            cabezaImg,
            torsoImg,
            brazoIzq,
            brazoDer,
            antebrazoIzq,
            antebrazoDer,
            piernaIzq,
            piernaDer,
            piernaIzqCaminar,
            piernaDerCaminar
        ] = await Promise.all([

            cargarParte(cabeza, "cabeza.png", perfil),
            cargarParte(torso, "torso.png", perfil),

            cargarParte(brazo, "brazo_izq.png", perfil),
            cargarParte(brazo, "brazo_der.png", perfil),

            cargarParte(brazo, "antebrazo_izq.png", perfil),
            cargarParte(brazo, "antebrazo_der.png", perfil),

            cargarParte(pierna, "pierna_izq.png", perfil),
            cargarParte(pierna, "pierna_der.png", perfil),

            cargarParte(pierna, "pierna_izq_caminar.png", perfil),
            cargarParte(pierna, "pierna_der_caminar.png", perfil)
        ]);

        return {
            cabeza: cabezaImg,
            torso: torsoImg,

            brazos: [brazoIzq, brazoDer],
            antebrazos: [antebrazoIzq, antebrazoDer],

            piernas: [piernaIzq, piernaDer],

            piernasCaminar: [
                piernaIzqCaminar,
                piernaDerCaminar
            ]
        };
    }

    // =========================================
    // FRENTE Y ATRÁS
    // =========================================

    const atras = direccion === "atras";

    const [
        cabezaImg,
        torsoImg,
        brazoIzq,
        brazoDer,
        antebrazoIzq,
        antebrazoDer,
        piernaIzq,
        piernaDer,
        piernaIzqCaminar,
        piernaDerCaminar
    ] = await Promise.all([

        cargarParte(
            cabeza,
            `cabezaR${cabeza}_${atras ? "ant" : "post"}.png`
        ),

        cargarParte(torso, `torsoR${torso}.png`),

        cargarParte(brazo, `brazoR${brazo}_izq.png`),
        cargarParte(brazo, `brazoR${brazo}_der.png`),

        cargarParte(brazo, `antebrazoR${brazo}_izq.png`),
        cargarParte(brazo, `antebrazoR${brazo}_der.png`),

        cargarParte(
            pierna,
            `piernaR${pierna}_izq${atras ? "_ant" : ""}.png`
        ),

        cargarParte(
            pierna,
            `piernaR${pierna}_der${atras ? "_ant" : ""}.png`
        ),

        cargarParte(
            pierna,
            `piernaR${pierna}_izq${atras ? "_ant" : ""}_caminar.png`
        ),

        cargarParte(
            pierna,
            `piernaR${pierna}_der${atras ? "_ant" : ""}_caminar.png`
        )
    ]);

    return {
        cabeza: cabezaImg,
        torso: torsoImg,

        brazos: [brazoIzq, brazoDer],
        antebrazos: [antebrazoIzq, antebrazoDer],

        piernas: [piernaIzq, piernaDer],

        piernasCaminar: [
            piernaIzqCaminar,
            piernaDerCaminar
        ]
    };
}




async function inicializarSprites() {

    const sprites = {};

    for (const direccion of Object.keys(rutasRobot)) {
        sprites[direccion] = await cargarSpritesDireccion(direccion);
    }

    return sprites;
}

// ======================================================
// CARGADOR GENERAL DE IMÁGENES
// ======================================================

function cargarImagen(ruta) {

    return new Promise((resolve, reject) => {

        const imagen = new Image();

        imagen.onload = () => {
            resolve(imagen);
        };

        imagen.onerror = () => {
            reject(new Error("No se pudo cargar la imagen: " + ruta));
        };

        imagen.src = ruta;
    });
}

// Carga en paralelo: el objeto de robots y la lista de imágenes generales
Promise.all([
    inicializarSprites(),
    Promise.all(rutasGenerales.map(cargarImagen)),
    inicializarMapas()
]).then(([spritesRobots, imagenesGenerales]) => {

    // 1. Primer objeto: diccionario exclusivo con los sprites de los robots
    const misSprites = { ...spritesRobots };

    // 2. Segundo elemento: lista (Array) con los objetos Image de rutasGenerales en el mismo orden
    const listaImagenesGenerales = [...imagenesGenerales];

    // Configuración automática de Robot1
    // Guardamos todos los sprites del robot.
robot1.spritesDirecciones = spritesRobots;

// Configuración inicial de colores.
robot1.coloresRobot = [
    `rgb(${color_rgb.r},${color_rgb.g},${color_rgb.b})`,
    `rgb(${cabeza_rgb.r},${cabeza_rgb.g},${cabeza_rgb.b})`,
    `rgb(${brazo_rgb.r},${brazo_rgb.g},${brazo_rgb.b})`,
    `rgb(${pierna_rgb.r},${pierna_rgb.g},${pierna_rgb.b})`,
    `rgb(${torso_rgb.r},${torso_rgb.g},${torso_rgb.b})`,
    `rgb(${brazo_rgb.r},${brazo_rgb.g},${brazo_rgb.b})`
];

robot1.tonosRobot = [<?php echo $tono?>];
robot1.saturacionesRobot = [<?php echo $saturacion?>];

// Dirección inicial.
robot1.cambiarDireccionRobot("frente");

    // Asignación a variables globales (si las usás fuera del .then)
    imagenes = misSprites;
    imagenesExtra = listaImagenesGenerales;

    ajustarResolucionCanvas(equipamiento, ctx_robot, false);

    for (let i = 0; i < mapa.ancho; i++) {
        espacio_x[i] = [];
    }

    for (let i = 0; i < mapa.alto; i++) {
        espacio_y[i] = [];
    }

    entidades.forEach(entidad => {
        actualizar_espacio(entidad);
    });

    // Iniciar juego únicamente cuando todas las imágenes estén cargadas
    //ctx_UI_cara.
    ctx_UI_cara.clearRect(0,0,900,900);
    robot1.dibujar_max(Cara_UI, ctx_UI_cara, Cara_UI.width, Cara_UI.height*3);

    for(let i = 0; i <= robot1.vida.max; i++)
    {
        let rayito = document.createElement("img");
        rayito.classList.add("rayito");
        rayito.src = "./rayo_amarillo.png";
        vida_html.appendChild(rayito);
        /*
            let nueva_receta = document.createElement("div");
            objeto.appendChild(id);
            id.textContent = receta.resultado.id;
            id.classList.add("id_objeto");
        */
    }

    const datosArbol = Objetos.find(objeto => objeto.id === 16);

    if (datosArbol) {
        const arbol = new FuenteRecurso(
            300, // Posición X
            200, // Posición Y
            entidades_id++,
            datosArbol
        );

        entidades.push(arbol);
        actualizar_espacio(arbol);
    }


    loop();

}).catch(error => {
    console.error("Error al inicializar las imágenes:", error);
});


Guardar.addEventListener("click", () => {
    const mundo = {
        entidades: entidades,
        entidades_adibujar: entidades_dibujables,
        inventario: inventario
    };

    const datos = {
        hora: hora_html.textContent,
        Entidades_adibujar: minuto_html.textContent
    };

    // 2. Lo conviertes a texto JSON
    const datosjson = JSON.stringify(datos);
    const mundojson = JSON.stringify(mundo);

   //console.log(mundojson);
   //console.log("");
   //console.log(datosjson);
});
