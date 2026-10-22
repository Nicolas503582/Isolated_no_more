
import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";

const calculo = new calculos();

let canvas = document.getElementById("selector");
let ctx = canvas.getContext("2d");

canvas.width = 100;
canvas.height = 100;

let selector = document.getElementById("selector_de_color");
let selector_value = document.getElementById("selector_de_tono");
let selector_saturacion = document.getElementById("selector_de_saturacion");
let tonoActual = 25;
let valorActual = 50;
let saturacionActual = 50;

let cabeza_oculto = document.getElementById("cabeza");
let torso_oculto = document.getElementById("torso");
let brazo_oculto = document.getElementById("brazo");
let pierna_oculto = document.getElementById("pierna");

const cabeza_mas = document.getElementById("cabeza_+");
const cabeza_men = document.getElementById("cabeza_-");
const torso_mas = document.getElementById("torso_+");
const torso_men = document.getElementById("torso_-");
const brazo_mas = document.getElementById("brazo_+");
const brazo_men = document.getElementById("brazo_-");
const pierna_mas = document.getElementById("pierna_+");
const pierna_men = document.getElementById("pierna_-");

let selector_cabeza = document.getElementById("selector_de_color_cabeza");
let selector_torso = document.getElementById("selector_de_color_torso");
let selector_brazo = document.getElementById("selector_de_color_brazo");
let selector_pierna = document.getElementById("selector_de_color_pierna");

let brazo = 0;
let pierna = 0;
let torso = 0;
let cabeza = 0;

let color_cabeza = 0;
let color_torso = 0;
let color_brazo = 0;
let color_pierna = 0;
let color_cabeza_rgb = calculo.hsvToRgba(color_cabeza, 100, 100);
let color_torso_rgb = calculo.hsvToRgba(color_torso, 100, 100);;
let color_brazo_rgb = calculo.hsvToRgba(color_brazo, 100, 100);;
let color_pierna_rgb = calculo.hsvToRgba(color_pierna, 100, 100);;

let imagenes = {};

let entidades = [];
let robot1 = new Entidad(0, 0, 1, "", ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]);

entidades.push(robot1);


let h = 280;
let v = 50;
let s = 50;

saturacionActual = selector_saturacion.value;
tonoActual = selector_value.value;
valorActual = selector.value;

const color_nuevo0 = calculo.hsvToRgba(h, 100, 100);
robot1.cambiarColor([`rgb(${color_nuevo0.r},${color_nuevo0.g},${color_nuevo0.b})`], v, s);

function loop() {
    ctx.fillStyle = "white";
    ctx.clearRect(0,0, canvas.height, canvas.width);
    ctx.fillRect(0,0,canvas.height, canvas.width);
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillRect(0, 0, 1000, 1000);
    
    h = valorActual;
    v = tonoActual;
    s = saturacionActual;

    const color_nuevo = calculo.hsvToRgba(h, 100, 100);
    robot1.cambiarcolores([`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`, `rgb(${color_cabeza_rgb.r},${color_cabeza_rgb.g},${color_cabeza_rgb.b})`, `rgb(${color_brazo_rgb.r},${color_brazo_rgb.g},${color_brazo_rgb.b})`, `rgb(${color_pierna_rgb.r},${color_pierna_rgb.g},${color_pierna_rgb.b})`, `rgb(${color_torso_rgb.r},${color_torso_rgb.g},${color_torso_rgb.b})`, `rgb(${color_brazo_rgb.r},${color_brazo_rgb.g},${color_brazo_rgb.b})`], [v], [s]);

    /*console.log(robot1);
    
    console.log(`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`);
    console.log(`h: ${h}, s: ${s}, v: ${v}`);*/

    entidades.forEach(entidad => {
        entidad.dibujar(canvas, ctx, 10);
    });
    
    //ctx.fillRect(0,0,100,100000);
    
    requestAnimationFrame(loop);
}



function ajustarResolucionCanvas(can, contexto) {
    const anchoVisual = window.innerWidth/6;
    const altoVisual = window.innerHeight/2;
    
    const dpr = window.devicePixelRatio || 1;
    
    can.width = anchoVisual * dpr;
    can.height = altoVisual * dpr;
    
    can.style.width = anchoVisual + "px";
    can.style.height = altoVisual + "px";
    
    contexto.scale(dpr, dpr);
    contexto.imageSmoothingEnabled = false; 
}


window.addEventListener("resize", function(){
    ajustarResolucionCanvas(canvas, ctx);
});


ajustarResolucionCanvas(canvas, ctx);


selector.addEventListener("input", function() {
    valorActual = selector.value;
});
selector_value.addEventListener("input", function() {
    tonoActual = selector_value.value;
});
selector_saturacion.addEventListener("input", function() {
    saturacionActual = selector_saturacion.value;
});

selector_cabeza.addEventListener("input", function() {
    color_cabeza = selector_cabeza.value;
    color_cabeza_rgb = calculo.hsvToRgba(color_cabeza, 100, 100);
});
selector_torso.addEventListener("input", function() {
    color_torso = selector_torso.value;
    color_torso_rgb = calculo.hsvToRgba(color_torso, 100, 100);
});
selector_brazo.addEventListener("input", function() {
    color_brazo = selector_brazo.value;
    color_brazo_rgb = calculo.hsvToRgba(color_brazo, 100, 100);
});
selector_pierna.addEventListener("input", function() {
    color_pierna = selector_pierna.value;
    color_pierna_rgb = calculo.hsvToRgba(color_pierna, 100, 100);
});


cabeza_mas.addEventListener("click", function(){
    cabeza += 1;
    if(cabeza >2) cabeza = 0;
    cabeza_oculto.value = cabeza;
    const imagen_cabeza = "cabezaR" + (cabeza + 1) + "_post";
    robot1.cambiarimagen(imagenes[imagen_cabeza], "cabeza");
});
cabeza_men.addEventListener("click", function(){
    cabeza -= 1;
    if(cabeza <0) cabeza = 2;
    cabeza_oculto.value = cabeza;
    robot1.cambiarimagen(imagenes.cabezaR1_post, "cabeza");
    const imagen_cabeza = "cabezaR" + (cabeza + 1) + "_post";
    robot1.cambiarimagen(imagenes[imagen_cabeza], "cabeza");
});

torso_mas.addEventListener("click", function(){
    torso += 1;
    if(torso >2) torso = 0;
    torso_oculto.value = torso;
    const imagen_torso = "torsoR" + (torso + 1);
    robot1.cambiarimagen(imagenes[imagen_torso], "torso");
});
torso_men.addEventListener("click", function(){
    torso -= 1;
    if(torso <0) torso = 2;
    torso_oculto.value = torso;
    const imagen_torso = "torsoR" + (torso + 1);
    robot1.cambiarimagen(imagenes[imagen_torso], "torso");
});

brazo_mas.addEventListener("click", function(){
    brazo += 1;
    if(brazo >2) brazo = 0;
    brazo_oculto.value = brazo;
    const imagen_brazo = "brazoR" + (brazo + 1);
    const imagen_brazo_der = imagen_brazo + "_der";
    const imagen_brazo_izq = imagen_brazo + "_izq";
    
    const imagen_antebrazo_der = "ante" + imagen_brazo + "_der";
    const imagen_antebrazo_izq = "ante" + imagen_brazo + "_izq";
    robot1.cambiarimagen([imagenes[imagen_brazo_der], imagenes[imagen_brazo_izq]], "brazo");
    robot1.cambiarimagen([imagenes[imagen_antebrazo_der], imagenes[imagen_antebrazo_izq]], "antebrazo");
});
brazo_men.addEventListener("click", function(){
    brazo -= 1;
    if(brazo <0) brazo = 2;
    brazo_oculto.value = brazo;
    const imagen_brazo = "brazoR" + (brazo + 1);
    const imagen_brazo_der = imagen_brazo + "_der"
    const imagen_brazo_izq = imagen_brazo + "_izq"
    robot1.cambiarimagen([imagenes[imagen_brazo_der], imagenes[imagen_brazo_izq]], "brazo");
});

pierna_mas.addEventListener("click", function(){
    pierna += 1;
    if(pierna >2) pierna = 0;
    pierna_oculto.value = pierna;
    const imagen_brazo = "piernaR" + (pierna + 1);
    const imagen_brazo_der = imagen_brazo + "_der"
    const imagen_brazo_izq = imagen_brazo + "_izq"
    robot1.cambiarimagen([imagenes[imagen_brazo_der], imagenes[imagen_brazo_izq]], "pierna");
});
pierna_men.addEventListener("click", function(){
    pierna -= 1;
    if(pierna <0) pierna = 2;
    pierna_oculto.value = pierna;
    const imagen_brazo = "piernaR" + (pierna + 1);
    const imagen_brazo_der = imagen_brazo + "_der"
    const imagen_brazo_izq = imagen_brazo + "_izq"
    robot1.cambiarimagen([imagenes[imagen_brazo_der], imagenes[imagen_brazo_izq]], "pierna");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


// ============================================================================
// 1. GENERACIÓN DINÁMICA DEL ARRAY CON LAS RUTAS DE LOS 3 ROBOTS
// ============================================================================
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

// Recorremos las carpetas de los 3 robots (Robot1, Robot2, Robot3)
for (let i = 1; i <= 3; i++) {
    for (const nombre of nombresBaseImagenes) {
        let nombreConId;
        
        // Regla especial para inyectar "R1", "R2" o "R3" en la posición correcta
        if (nombre.includes('_')) {
            nombreConId = nombre.replace('_', `R${i}_`);
        } else {
            nombreConId = `${nombre}R${i}`; // Caso para 'torso' -> 'torsoR1'
        }
        
        imagenesRobot.push(`./Robot${i}/${nombreConId}.png`);
    }
}


// ============================================================================
// 2. FUNCIÓN PARA CARGAR UNA IMAGEN MEDIANTE PROMESA
// ============================================================================
function cargarImagen(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Cargada con éxito: ${url}`);
            resolve(img); 
        };
        
        img.onerror = () => {
            console.error(`❌ Error al cargar la imagen: ${url}`);
            reject(new Error(`No se pudo cargar: ${url}`));
        };
        
        img.src = url; 
    });
}


// ============================================================================
// 3. FUNCIÓN ASÍNCRONA PARA CARGAR TODOS LOS SPRITES EN SECUENCIA
// ============================================================================
async function inicializarSprites() {
    const spritesCargados = {};

    console.log("=== Iniciando carga secuencial de imágenes ===");

    for (const url of imagenesRobot) {
        try {
            const imgObjeto = await cargarImagen(url);
            
            // Extrae el nombre final del archivo sin extensión (ej: "torsoR1")
            const nombreClave = url.split('/').pop().replace('.png', '');
            
            // Almacena el elemento de imagen en el objeto de sprites
            spritesCargados[nombreClave] = imgObjeto; 
            
        } catch (error) {
            console.warn("Saltando imagen debido al error.");
        }
    }

    console.log("=== ¡Todas las imágenes de los 3 robots han sido cargadas! ===");
    return spritesCargados;
}


// ============================================================================
// 4. EJECUCIÓN DEL PROCESO Y ASIGNACIÓN DE LOS ELEMENTOS
// ============================================================================
inicializarSprites().then((misSprites) => {
    // 'misSprites' ahora contiene los archivos de Robot1, Robot2 y Robot3 estructurados así:
    // misSprites.torsoR1, misSprites.torsoR2, misSprites.torsoR3, etc.
    console.log("Diccionario completo de sprites listos:", misSprites);
    
    // Configuración automática de Robot1
    robot1.guardarimagenes(
        ["cabeza", "brazo", "pierna", "torso", "antebrazo"], 
        [
            misSprites.cabezaR1_post, 
            [misSprites.brazoR1_der, misSprites.brazoR1_izq], 
            [misSprites.piernaR1_der, misSprites.piernaR1_izq], 
            misSprites.torsoR1,
            [misSprites.antebrazoR1_der, misSprites.antebrazoR1_izq]
        ]
    );

    // Renderizado de prueba inicial en tu Canvas (Ejemplo usando Robot 1)
    ctx.drawImage(misSprites.cabezaR1_post, 0, 0);
    ctx.drawImage(misSprites.brazoR1_der_suelto, 0, 0);
    ctx.drawImage(misSprites.brazoR1_izq_suelto, 0, 0);
    ctx.drawImage(misSprites.torsoR1, 0, 0);

    // Guardar referencia en tu variable global e iniciar el bucle principal (loop)
    imagenes = misSprites;
    loop();
});
