
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
let brazo = 0;
let pierna = 0;
let torso = 0;
let cabeza = 0;

const imagenes = {};

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
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillRect(0, 0, 1000, 1000);
    
    h = valorActual;
    v = tonoActual;
    s = saturacionActual;

    const color_nuevo = calculo.hsvToRgba(h, 100, 100);
    robot1.cambiarcolores([`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`], [v], [s]);

    /*console.log(robot1);
    
    console.log(`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`);
    console.log(`h: ${h}, s: ${s}, v: ${v}`);*/

    entidades.forEach(entidad => {
        entidad.dibujar(canvas, ctx, 10);
    });
    
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


cabeza_mas.addEventListener("click", function(){
    cabeza += 1;
    if(cabeza >2) cabeza = 0;
    //robot1.cambiarimagen(("robot" + (cabeza +1) + ".png"));
    cabeza_oculto.value = cabeza;
    robot1.cambiarimagen(misSprites.cabezaR2_post, "cabeza");
});
cabeza_men.addEventListener("click", function(){
    cabeza -= 1;
    if(cabeza <0) cabeza = 2;
    cabeza_oculto.value = cabeza;
    robot1.cambiarimagen(misSprites.cabezaR1_post, "cabeza");
});

torso_mas.addEventListener("click", function(){
   torso += 1;
   if(torso >2) torso = 0;
   torso_oculto.value = torso;
   robot1.cambiarimagen(misSprites.torsoR2, "torso");
});
torso_men.addEventListener("click", function(){
   torso -= 1;
   if(torso <0) torso = 2;
   torso_oculto.value = torso;
   robot1.cambiarimagen(misSprites.torsoR1, "torso");
});

brazo_mas.addEventListener("click", function(){
   brazo += 1;
   if(brazo >2) brazo = 0;
   brazo_oculto.value = brazo;
   robot1.cambiarimagen([misSprites.brazoR2_der, misSprites.brazoR2_izq], "brazo");
});
brazo_men.addEventListener("click", function(){
   brazo -= 1;
   if(brazo <0) brazo = 2;
   brazo_oculto.value = brazo;
   //[misSprites.cabezaR1_post, [misSprites.brazoR1_der, misSprites.brazoR1_izq], misSprites.torsoR1, [misSprites.piernaR1_der, misSprites.piernaR1_izq]
   robot1.cambiarimagen([misSprites.brazoR1_der, misSprites.brazoR1_izq], "brazo");
});

pierna_mas.addEventListener("click", function(){
    pierna += 1;
    if(pierna >2) pierna = 0;
    pierna_oculto.value = pierna;
    robot1.cambiarimagen([misSprites.piernaR2_der, misSprites.piernaR2_izq], "pierna");
});
pierna_men.addEventListener("click", function(){
    pierna -= 1;
    if(pierna <0) pierna = 2;
    pierna_oculto.value = pierna;
    robot1.cambiarimagen([misSprites.piernaR1_der, misSprites.piernaR1_izq], "pierna");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


// 1. Array con las rutas de los archivos de tu carpeta "Robot1"
const imagenesRobot = [
    "./Robot1/antebrazoR1_der.png",
    "./Robot1/antebrazoR1_izq.png",
    "./Robot1/brazoR1_der_suelto.png",
    "./Robot1/brazoR1_der.png",
    "./Robot1/brazoR1_izq_suelto.png",
    "./Robot1/brazoR1_izq.png",
    "./Robot1/cabezaR1_post.png",
    "./Robot1/piernaR1_der.png",
    "./Robot1/piernaR1_izq.png",
    "./Robot1/torsoR1.png",   //
    "./Robot2/antebrazoR2_der.png",
    "./Robot2/antebrazoR2_izq.png",
    "./Robot2/brazoR2_der_suelto.png",
    "./Robot2/brazoR2_der.png",
    "./Robot2/brazoR2_izq_suelto.png",
    "./Robot2/brazoR2_izq.png",
    "./Robot2/cabezaR2_post.png",
    "./Robot2/piernaR2_der.png",
    "./Robot2/piernaR2_izq.png",
    "./Robot2/torsoR2.png"
];

// 2. Función que envuelve la carga de la imagen en una Promesa
function cargarImagen(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Cargada con éxito: ${url}`);
            resolve(img); // Devuelve el objeto Image listo
        };
        
        img.onerror = () => {
            console.error(`❌ Error al cargar la imagen: ${url}`);
            reject(new Error(`No se pudo cargar: ${url}`));
        };
        
        img.src = url; // Inicia la carga de la imagen
    });
}

// 3. Función asíncrona con el bucle secuencial
async function inicializarSprites() {
    const spritesCargados = {};

    console.log("=== Iniciando carga secuencial de imágenes ===");

    // IMPORTANTE: Se usa un bucle 'for...of' porque 'forEach' NO respeta el await
    for (const url of imagenesRobot) {
        try {
            // El bucle se detiene aquí de forma estricta hasta que la promesa se resuelva (resolve)
            const imgObjeto = await cargarImagen(url);
            
            // Extraemos solo el nombre del archivo para usarlo como clave (ej: "torsoR1")
            const nombreClave = url.split('/').pop().replace('.png', '');
            
            // Guardamos el objeto de la imagen cargada
            spritesCargados[nombreClave] = imgObjeto; 
            
        } catch (error) {
            // Si una imagen falla, el código atrapa el error y continúa con la siguiente
            console.warn("Saltando imagen debido al error.");
        }
    }

    console.log("=== ¡Todas las imágenes han sido cargadas en orden! ===");
    return spritesCargados;
}

// 4. Ejecución del proceso
inicializarSprites().then((misSprites) => {
    // Aquí dentro ya tienes todas tus imágenes listas para usar en tu Canvas o lógica
    console.log("Diccionario de sprites listos:", misSprites);
    
    robot1.guardarimagenes(["cabeza", "torso", "brazo", "pierna"], [misSprites.cabezaR1_post, [misSprites.brazoR1_der, misSprites.brazoR1_izq], misSprites.torsoR1, [misSprites.piernaR1_der, misSprites.piernaR1_izq]]);

    ctx.drawImage(misSprites.cabezaR1_post, 0, 0);
    ctx.drawImage(misSprites.brazoR1_der_suelto, 0, 0);
    ctx.drawImage(misSprites.brazoR1_izq_suelto, 0, 0);
    ctx.drawImage(misSprites.torsoR1, 0, 0);
    ctx.drawImage(misSprites.cabezaR1_post, 0, 0);

    imagenes = misSprites;
    loop();
    
    // Ejemplo de uso: ctx.drawImage(misSprites.torsoR1, 100, 100);
});