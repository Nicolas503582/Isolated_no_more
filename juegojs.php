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


import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";
import { Inventario } from "./inventario.js";
import { Crafteador } from "./crafteo.js";
import { Construccion } from "./construccion.js";
import { Objetos } from "./objetos.js";

const calculo = new calculos();
let inv = new Inventario();
let craf = new Crafteador();

let canvas = document.getElementById("juego");
let ctx = canvas.getContext("2d");

let inventario = document.getElementById("Inventario");

let inventario_html = document.getElementById("Inv_objetos");
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

let teclas = {a: false, d: false, s: false, w: false, e: false};
let entidades_id = 0;
let direccion = {x : 0, y: 0, z: 0};
let espacio_x = [];
let espacio_y = [];
let imagenes = {};

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
let robot1 = new Entidad(100, 100, {x: 8, y: 50, alto: 12, ancho: 19}, 2, entidades_id++);
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

function loop() {
   //console.log(robot1.x + "    " + robot1.y);

    if(!inv_activo && !craf_activo)
    {
        if(aux_entidad >= 30)
        {
            if(entidades.length < 2)
            {
                entidades.push(new Entidad(100, 150, {x: 8, y: 50, alto: 12, ancho: 19}, 1, entidades_id++));

                const aux_esp = entidades.length - 1;
                for(let i = entidades[aux_esp].x+entidades[aux_esp].hitbox.x; i< entidades[aux_esp].x+entidades[aux_esp].hitbox.x+entidades[aux_esp].hitbox.ancho; i++)
                {
                    espacio_x[i] = [aux_esp]; 
                }
                for(let i = entidades[aux_esp].y+entidades[aux_esp].hitbox.y; i< entidades[aux_esp].y+entidades[aux_esp].hitbox.y+entidades[aux_esp].hitbox.alto; i++)
                {
                    espacio_y[i] = [aux_esp]; 
                }

                entidades[(entidades.length - 1)].guardarimagenes(["cabeza", "brazo", "pierna", "torso", "antebrazo"], 
                [
                    imagenes.cabezaR1_post, 
                    [imagenes.brazoR1_der, imagenes.brazoR1_izq], 
                    [imagenes.piernaR1_der, imagenes.piernaR1_izq], 
                    imagenes.torsoR1,
                    [imagenes.antebrazoR1_der, imagenes.antebrazoR1_izq]
                ]);
                entidades[(entidades.length - 1)].cambiarcolores();
            }

            aux_entidad = 0;
        }
        else
        {
            //categoria, imagen, nombre, descripcion, id, cantidad
            //console.log("aaaa");
            inv.guardarObjetoEnInventario("Materiales", 1, 85);
            aux_entidad++;
        }
        ajustarResolucionCanvas(canvas, ctx);
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.width, canvas.height);

        //console.log("5485");
        
        direccion.x = teclas.d - teclas.a  + 0;
        direccion.z = teclas.s - teclas.w  + 0;
        robot1.movimiento.moviendo(direccion, espacio_x, espacio_y, 0);
        //movimiento
        /*//console.log("y: " + espacio_y);
        //console.log("x: " + espacio_x);*/

        entidades.forEach(entidad => {
            entidad.dibujar(canvas, ctx, 1);
        });
        jerarquia();
        
        //console.log(entidades);
    }
    else if (!craf_activo){
        ctx_robot.clearRect(0, 0, equipamiento.width, equipamiento.height);
        ctx_robot.fillStyle = "white";
        ctx_robot.fillRect (0, 0, equipamiento.width, equipamiento.height);
        robot1.dibujar_max(equipamiento, ctx_robot, equipamiento.width, equipamiento.height);
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
            time_del = 0;
        }
    }
    requestAnimationFrame(loop);
}

function jerarquia(){
    entidades.sort((a, b) => {
        return ((a.y + a.hitbox.y + a.hitbox.alto) - (b.y + b.hitbox.y + b.hitbox.alto)) || ((b.x + b.hitbox.x + b.hitbox.ancho) - (a.x + a.hitbox.x + a.hitbox.ancho));
    });
    
}

function ajustarResolucionCanvas(can, contexto, bool = true) {
    let anchoVisual, altoVisual;
    if(bool)
    {
        anchoVisual = window.innerWidth -10;
        altoVisual = window.innerHeight -10;
    }
    else
    {
        const rect = can.getBoundingClientRect();
        anchoVisual = rect.width - 10;
        altoVisual = rect.height - 10;
    }
    
    const dpr = window.devicePixelRatio || 1;
    
    can.width = anchoVisual * dpr;
    can.height = altoVisual * dpr;
    
    can.style.width = anchoVisual + "px";
    can.style.height = altoVisual + "px";
    
    contexto.scale(dpr, dpr);
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
        /*Object.keys(teclas).forEach(clave =>{
            teclas[clave] = false;
        });*/
        teclas[tecla] = true;
        if(tecla == "e" && !craf_activo)
        {
            inventario.classList.toggle("activo");
            inv_activo = inv_activo ? false : true;
        }
        if(tecla == "q" && !inv_activo)
        {
            crafteador.classList.toggle("activo");
            craf_activo = craf_activo ? false : true;
        }
        
    }
});
window.addEventListener("keyup", (e) => {
    const tecla = e.key.toLowerCase();
    teclas[tecla] = false;
});

window.addEventListener("resize", function(){
    ajustarResolucionCanvas(canvas, ctx);
    ajustarResolucionCanvas(equipamiento, ctx_robot, false);
});


ajustarResolucionCanvas(canvas, ctx);

//evento personalizado
document.addEventListener('construir', (e) => {

    const propiedades = e.detail;
    const construccion = new Construccion(robot1.x + (-15 + 2 *15 * robot1.direccion.x), robot1.y + 30 * robot1.direccion.y, Objetos[propiedades.id].hitbox, entidades_id++, imagenesExtra[propiedades.id]);
    entidades.push(construccion);
    actualizar_espacio(construccion);
    console.log("aaaaaaaaa");
});

function actualizar_espacio(entidad){
    const x = entidad.x + entidad.hitbox.x;
    const y = entidad.y + entidad.hitbox.y;
    const ancho = entidad.hitbox.ancho;
    const alto = entidad.hitbox.alto;
    const id = entidad.id;
    for(let i = x; i< x + ancho; i++)
    {
        espacio_x[i].push(id);
    }
    for(let i = y; i< y + alto; i++)
    {
        espacio_y[i].push(id);
    }
    console.log("nbbbbbbbbbbbbb");
    
}
const nombresBaseImagenes = [
    "antebrazo_der",
    "antebrazo_izq",
    "brazo_der_suelto",
    "brazo_der",
    "brazo_izq_suelto",
    "brazo_izq",
    "cabeza_post",
    "pierna_der",
    "pierna_izq",
    "torso"
];

const imagenesRobot = [];

for (let i = 1; i <= 3; i++) {
    for (const nombre of nombresBaseImagenes) {
        let nombreConId;

        if (nombre.includes('_')) {
            nombreConId = nombre.replace('_', `R${i}_`);
        } else {
            nombreConId = `${nombre}R${i}`;
        }

        imagenesRobot.push(`./Robot${i}/${nombreConId}.png`);
    }
}

// Agregá acá las rutas de las imágenes que irán a la lista
const rutasGenerales = ["./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png", "./verde.png"];
let imagenesExtra = [];

function cargarImagen(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            resolve(img);
        };

        img.onerror = () => {
            console.error(`❌ Error al cargar la imagen: ${url}`);
            reject(new Error(`No se pudo cargar: ${url}`));
        };

        img.src = url;
    });
}

async function inicializarSprites() {
    const spritesCargados = {};

    for (const url of imagenesRobot) {
        try {
            const imgObjeto = await cargarImagen(url);
            const nombreClave = url.split('/').pop().replace('.png', '');
            spritesCargados[nombreClave] = imgObjeto;
        } catch (error) {
            console.warn("Saltando imagen debido al error.");
        }
    }

    return spritesCargados;
}

// Carga en paralelo: el objeto de robots y la lista de imágenes generales
Promise.all([
    inicializarSprites(),
    Promise.all(rutasGenerales.map(cargarImagen))
]).then(([spritesRobots, imagenesGenerales]) => {

    // 1. Primer objeto: diccionario exclusivo con los sprites de los robots
    const misSprites = { ...spritesRobots };

    // 2. Segundo elemento: lista (Array) con los objetos Image de rutasGenerales en el mismo orden
    const listaImagenesGenerales = [...imagenesGenerales];

    // Configuración automática de Robot1
    const nom_cabeza = "cabezaR" + cabeza + "_post";

    const nom_brazo = {
        izq: "brazoR" + brazo + "_izq",
        der: "brazoR" + brazo + "_der"
    };

    const nom_pierna = {
        izq: "piernaR" + pierna + "_izq",
        der: "piernaR" + pierna + "_der"
    };

    const nom_antebrazo = {
        izq: "ante" + nom_brazo.izq,
        der: "ante" + nom_brazo.der
    };

    const nom_torso = "torsoR" + torso;

    robot1.guardarimagenes(
        ["cabeza", "brazo", "pierna", "torso", "antebrazo"],
        [
            misSprites[nom_cabeza],
            [misSprites[nom_brazo.izq], misSprites[nom_brazo.der]],
            [misSprites[nom_pierna.der], misSprites[nom_pierna.izq]],
            misSprites[nom_torso],
            [misSprites[nom_antebrazo.izq], misSprites[nom_antebrazo.der]]
        ]
    );

    robot1.cambiarcolores(
        [
            `rgb(${color_rgb.r},${color_rgb.g},${color_rgb.b})`,
            `rgb(${cabeza_rgb.r},${cabeza_rgb.g},${cabeza_rgb.b})`,
            `rgb(${brazo_rgb.r},${brazo_rgb.g},${brazo_rgb.b})`,
            `rgb(${torso_rgb.r},${torso_rgb.g},${torso_rgb.b})`,
            `rgb(${pierna_rgb.r},${pierna_rgb.g},${pierna_rgb.b})`,
            `rgb(${brazo_rgb.r},${brazo_rgb.g},${brazo_rgb.b})`
        ],
        [<?php echo $tono?>],
        [<?php echo $saturacion?>]
    );

    // Asignación a variables globales (si las usás fuera del .then)
    imagenes = misSprites;
    imagenesExtra = listaImagenesGenerales;

    ajustarResolucionCanvas(equipamiento, ctx_robot, false);

    for (let i = 0; i < canvas.width; i++) {
        espacio_x[i] = [];
    }

    for (let i = 0; i < canvas.height; i++) {
        espacio_y[i] = [];
    }

    entidades.forEach((entidad, i) => {
        for (let l = entidad.x; l < entidad.x + entidad.ancho; l++) {
            espacio_x[l].push(i);
        }

        for (let l = entidad.y; l < entidad.y + entidad.alto; l++) {
            espacio_y[l].push(i);
        }
    });

    // Iniciar juego únicamente cuando todas las imágenes estén cargadas
    loop();

}).catch(error => {
    console.error("Error al inicializar las imágenes:", error);
});