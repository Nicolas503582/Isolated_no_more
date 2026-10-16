<?php
session_start();
$color_general = $_SESSION["color_general"];
$saturacion = $_SESSION["saturacion"];
$tono = $_SESSION["tono"];
/*if(!isset($color_general) || !isset($saturacion) || !isset($tono)){
    echo "Error: No se han recibido los valores de color, saturación y tono.";
    exit;
}
else
{
    echo "aaaaaaaaaaaaaaaaaa";
}
echo $color_general;
echo $saturacion;
echo $tono;*/

header("Content-Type: application/javascript");

?>


import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";

const calculo = new calculos();

let canvas = document.getElementById("juego");
let ctx = canvas.getContext("2d");

let teclas = {a: false, d: false, s: false, w: false};
let direccion = {x : 0, y: 0, z: 0};

let entidades = [];
const color_post = <?php echo $color_general; ?>;
const saturacion_post = <?php echo $saturacion; ?>;
const tono_post = <?php echo $tono; ?>;
let color_rgb = calculo.hsvToRgba(color_post, saturacion_post, tono_post);
let robot1 = new Entidad(100, 100, 1, "robot1.png", [color_rgb]);
let h = 0;

entidades.push(robot1);

function loop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.height, canvas.width);

    const color_nuevo = calculo.hsvToRgba(h, 100, 100);
    robot1.cambiarColor([`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`]);
    
    direccion.x = teclas.d - teclas.a  + 0;
    direccion.z = teclas.s - teclas.w   + 0;
    robot1.movimiento.moviendo(direccion);
    console.log(direccion);

    entidades.forEach(entidad => {
        entidad.dibujar(canvas, ctx, 1);
    });
    
    requestAnimationFrame(loop);
}

function ajustarResolucionCanvas(can, contexto) {
    const anchoVisual = window.innerWidth -10;
    const altoVisual = window.innerHeight -10;
    
    const dpr = window.devicePixelRatio || 1;
    
    can.width = anchoVisual * dpr;
    can.height = altoVisual * dpr;
    
    /*can.style.width = anchoVisual + "px";
    can.style.height = altoVisual + "px";*/
    
    contexto.scale(dpr, dpr);
    contexto.imageSmoothingEnabled = false; 
}

window.addEventListener('wheel', (e) => {
    h += (e.deltaY/3)/8;
    while(h < 0 || h > 360)
    {
        if(h > 360) h -=360;
        if(h<0) h += 360;
    }
});

window.addEventListener("keydown", (e) => {
    const tecla = e.key.toLowerCase();
    teclas[tecla] = true;
});
window.addEventListener("keyup", (e) => {
    const tecla = e.key.toLowerCase();
    teclas[tecla] = false;
});

window.addEventListener("resize", ajustarResolucionCanvas);


ajustarResolucionCanvas(canvas, ctx);
loop();