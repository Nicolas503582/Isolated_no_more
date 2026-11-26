import { dibujo } from './funciones_dibujo.js';
import { calculos } from './general.js';
import { movimiento } from './movimiento.js';

const pincel = new dibujo();
const calculo = new calculos();

export class Entidad{
        constructor(x, y, hitbox = {x: 2, y: 0, alto: 11, ancho: 15}, velocidad = 1, id = 0, vida = 10, vida_max = 10, imagen = "", claves = [], imagenes = [], colores_iniciales = ["red"], tono = 50, saturacion = 50){
            this.vida = {"max": vida_max, "actual": vida};
            
            this.x = x; //x actual
            this.y = y; //y actual
            this.velocidad = velocidad;
            this.id = id;

           //console.log(hitbox);
            this.hitbox = hitbox;

            this.imagen = new Image();

            this.urls = imagen;
            this.claves = claves;
            this.imagenes = {};

            this.canvasOculto = document.createElement('canvas');
            this.canvasOculto.width = 1;
            this.canvasOculto.height = 1;
            this.ctxOculto = this.canvasOculto.getContext('2d', {willReadFrequently: true});

            this.canvasAux = document.createElement('canvas');
            this.canvasAux.width = 1;
            this.canvasAux.height = 1;
            this.ctxAux = this.canvasAux.getContext('2d', {willReadFrequently: true});
            this.canvases = [];
            this.ctxs = [];

            this.colores = colores_iniciales;
            this.tono_viejo = 0;
            this.tono = tono;
            this.saturacion_viejo = 0;
            this.saturacion = saturacion;

            this.direccion = {x:0, y:0};

            this.movimiento = new movimiento(this);
            // =========================================
// ANIMACIÓN DE CAMINAR
// =========================================

this.animacionPiernas = {
    frames: [],
    actual: 0,
    contador: 0,
    velocidad: 8,
    activa: false
};

// Guardamos los datos necesarios para recolorear.
this.coloresCapas = [];
this.tonosCapas = [];
this.saturacionesCapas = [];

            
            this.tipo = "entidad";

            this.start(this.claves, this.urls);
        }

        inicio(){
            this.ctxOculto.drawImage(this.imagen, 0, 0);
            this.cambiarColor(this.colores, this.tono, this.saturacion);
            //console.log(pincel.aNormal(this.ctxOculto, this.canvasOculto));
        }
        start(){
            this.guardarimagenes(this.claves, this.imagenes);
            this.cambiarcolores(this.colores_iniciales, this.tono, this.saturacion);
        }


cambiarDireccionRobot(direccion) {

    if (this.direccionVisual === direccion) return;

    const sprites = this.spritesDirecciones[direccion];

    if (!sprites) return;

    // =========================================
    // COLORES
    // =========================================

    const colores = {
        cabeza: this.coloresRobot[1],
        brazos: this.coloresRobot[2],
        piernas: this.coloresRobot[3],
        torso: this.coloresRobot[4],
        antebrazos: this.coloresRobot[5]
    };

    // =========================================
    // CREAR CAPAS
    // =========================================

    const capas = [];

    // Piernas.
    capas.push({
        nombre: "piernas",
        imagen: sprites.piernas,
        color: colores.piernas
    });

    // =========================================
    // BRAZOS DETRÁS
    // =========================================

    if (direccion === "frente") {

        capas.push({
            nombre: "brazo_fondo_izq",
            imagen: sprites.brazos[0],
            color: colores.brazos
        });

        capas.push({
            nombre: "brazo_fondo_der",
            imagen: sprites.brazos[1],
            color: colores.brazos
        });

        capas.push({
            nombre: "antebrazo_fondo_izq",
            imagen: sprites.antebrazos[0],
            color: colores.antebrazos
        });

        capas.push({
            nombre: "antebrazo_fondo_der",
            imagen: sprites.antebrazos[1],
            color: colores.antebrazos
        });

    } else if (direccion === "derecha" || direccion === "izquierda") {

        const indiceFondo = direccion === "derecha" ? 0 : 1;

        capas.push({
            nombre: "brazo_fondo",
            imagen: sprites.brazos[indiceFondo],
            color: colores.brazos
        });

        capas.push({
            nombre: "antebrazo_fondo",
            imagen: sprites.antebrazos[indiceFondo],
            color: colores.antebrazos
        });
    }

    // =========================================
    // TORSO
    // =========================================

    capas.push({
        nombre: "torso",
        imagen: sprites.torso,
        color: colores.torso
    });

    // =========================================
    // BRAZOS DELANTE
    // =========================================

    if (direccion === "atras") {

        capas.push({
            nombre: "brazo_delante_izq",
            imagen: sprites.brazos[0],
            color: colores.brazos
        });

        capas.push({
            nombre: "brazo_delante_der",
            imagen: sprites.brazos[1],
            color: colores.brazos
        });

        capas.push({
            nombre: "antebrazo_delante_izq",
            imagen: sprites.antebrazos[0],
            color: colores.antebrazos
        });

        capas.push({
            nombre: "antebrazo_delante_der",
            imagen: sprites.antebrazos[1],
            color: colores.antebrazos
        });

    } else if (direccion === "derecha" || direccion === "izquierda") {

        const indiceDelante = direccion === "derecha" ? 1 : 0;

        capas.push({
            nombre: "brazo_delante",
            imagen: sprites.brazos[indiceDelante],
            color: colores.brazos
        });

        capas.push({
            nombre: "antebrazo_delante",
            imagen: sprites.antebrazos[indiceDelante],
            color: colores.antebrazos
        });
    }

    // =========================================
    // CABEZA
    // =========================================

    capas.push({
        nombre: "cabeza",
        imagen: sprites.cabeza,
        color: colores.cabeza
    });

    // =========================================
    // PREPARAR IMÁGENES
    // =========================================

    const claves = capas.map(capa => capa.nombre);
    const imagenes = capas.map(capa => capa.imagen);

    const coloresOrdenados = [
        this.coloresRobot[0],
        ...capas.map(capa => capa.color)
    ];

    // Limpiar capas anteriores.
    this.imagenes = {};
    this.canvases = [];
    this.ctxs = [];

    // Guardar las imágenes normales.
    this.guardarimagenes(claves, imagenes);

    // Guardar los datos de recoloración.
    this.coloresCapas = coloresOrdenados;

    this.tonosCapas = Array(capas.length).fill(
        this.tonosRobot[0]
    );

    this.saturacionesCapas = Array(capas.length).fill(
        this.saturacionesRobot[0]
    );

    // Preparar la animación.
    this.prepararAnimacionPiernas(
        sprites.piernasCaminar,
        sprites.piernas
    );

    this.animacionPiernas.activa = false;

    // Recolorear todas las capas normales.
    this.cambiarcolores(
        this.coloresCapas,
        this.tonosCapas,
        this.saturacionesCapas
    );

    this.direccionVisual = direccion;
}


        cambiarColor(color, tono = 50, saturacion = 50){
            this.ctxOculto.drawImage(this.imagen, 0, 0);
            let Dataimage = pincel.aNormal(this.ctxOculto, this.canvasOculto);
            let Data = Dataimage.data;
            let colores_nuevos = [];
            let colores_nuevos_hsv = [];
            let colores_viejos = [];
            let colores_viejos_hsv = [];
            let menor_s = 0;
            let mayor_s = 0;
            let menor_v = 0;
            let mayor_v = 0;

            for(let i = 0; i<color.length; i++){
                this.ctxAux.fillStyle = color[i];
                this.ctxAux.fillRect(0, 0, 1, 1);
                let colorData = this.ctxAux.getImageData(0, 0, 1, 1).data;
                colores_nuevos.push([colorData[0], colorData[1], colorData[2]]);
                colores_nuevos_hsv.push(calculo.rgbaToHsv(colorData[0], colorData[1], colorData[2]));
            }

            for(let i = 0; i < Data.length; i += 4){
                let aux = false;
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                if(hsv_Data.v > 95 || hsv_Data.v < 5) continue;
                for(let j = 0; j < colores_viejos.length; j++){
                    const diferencia = hsv_Data.h - colores_viejos_hsv[j].h;
                    if(Math.abs(diferencia) < 20){
                        if(hsv_Data.s > colores_viejos_hsv[j].s || hsv_Data.v > colores_viejos_hsv[j].v) colores_viejos_hsv[j].s = hsv_Data.s;
                        aux = true;/*
                        if(menor_s[j])
                        {*/
                            if(hsv_Data.s < menor_s)
                            {
                                //console.log("             Menor_S:     antes: " + menor_s + "  ahora: " + hsv_Data.s);
                                menor_s = Math.floor(hsv_Data.s);
                            }
                            else if(hsv_Data.s > mayor_s)
                            {
                                //console.log("             Mayor_S:     antes: " + mayor_s + "  ahora: " + hsv_Data.s);
                                mayor_s = Math.floor(hsv_Data.s);
                            }
                            if(hsv_Data.v < menor_v)
                            {
                                //console.log("             Menor_V:     antes: " + menor_v + "  ahora: " + hsv_Data.v);
                                menor_v = Math.floor(hsv_Data.v);
                            }
                            else if(hsv_Data.v > mayor_v)
                            {
                                //console.log("             Mayor_V:     antes: " + mayor_v + "  ahora: " + hsv_Data.v);
                                mayor_v = Math.floor(hsv_Data.v);
                            }
                        //}
                        break;
                    }
                }
                if(!aux && Data[i + 3] !== 0){
                    colores_viejos.push([Data[i], Data[i + 1], Data[i + 2]]);
                    colores_viejos_hsv.push(hsv_Data);
                }
            }
            

            const nuevo_tono = tono-50;
            const nueva_saturacion = saturacion-50;
            let aux_tono = 0;
            let aux_s = 0;
            
            for(let i = 0; i < Data.length; i += 4){
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                let aux = false;
                //if(hsv_Data.v > 95 || hsv_Data.v < 5) continue;
                for(let j = 0; j< colores_viejos.length && j < colores_nuevos.length; j++)
                {
                        hsv_Data.h = colores_nuevos_hsv[0].h/*+ diferencia_h*/;
                        if(hsv_Data.h < 0) hsv_Data.h += 360;
                        if(hsv_Data.h > 360) hsv_Data.h -= 360;

                        hsv_Data.s += nueva_saturacion/* - this.saturacion_viejo*/;
                        //hsv_Data.s = colores_nuevos_hsv[0].s;
                        if(hsv_Data.s < 0) hsv_Data.s = 0;
                        if(hsv_Data.s > 100) hsv_Data.s = 100;

                        //hsv_Data.v = colores_nuevos_hsv[j].v + diferencia_v;
                        hsv_Data.v += nuevo_tono/* - this.tono_viejo*/;
                        //hsv_Data.v = colores_nuevos_hsv[0].v;
                        if(hsv_Data.v < 0) hsv_Data.v = 0;
                        if(hsv_Data.v > 100) hsv_Data.v = 100;

                        let nuevoColor = calculo.hsvToRgba(hsv_Data.h, hsv_Data.s, hsv_Data.v);
                        Data[i] = nuevoColor.r;
                        Data[i + 1] = nuevoColor.g;
                        Data[i + 2] = nuevoColor.b;
                        Data[i + 3] = Data[i + 3];
                        aux = true;
                        break;
                }
            }
            this.tono_viejo = aux_tono;
            this.saturacion_viejo = aux_s;//////////////28 ancho
            //console.log(Dataimage);
            this.ctxOculto.putImageData(Dataimage, 0, 0);
        }
        cambiarcolores(colores = ["red"], tonos = [50], saturaciones = [50]){
            this.ctxOculto.clearRect(0,0,this.canvasOculto.width, this.canvasOculto.height)
            Object.entries(this.imagenes).forEach(([clave, imagen], i)=>{
                if(!colores[i+1]) colores[i+1] = colores[0];
                if(!tonos[i]) tonos[i] = tonos[0];
                if(!saturaciones[i]) saturaciones[i] = saturaciones[0];
                this.recolor(imagen, this.canvases[i], this.ctxs[i], colores[i+1], tonos[i], saturaciones[i]);
                //this.ctxOculto.drawImage(this.canvases[i], 0, 0);
                //this.ctxOculto.fillStyle = "red";
                //this.ctxOculto.fillRect(0,0,100,100);
            });
        }
        
recolor(sprite, canvas, ctx, color, tono, saturacion, componer = true) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Array.isArray(sprite)) {

        sprite.forEach(img => {
            ctx.drawImage(img, 0, 0);
        });

    } else {

        ctx.drawImage(sprite, 0, 0);

    }

    let Dataimage = pincel.aNormal(ctx, canvas);
    let Data = Dataimage.data;

    this.ctxAux.fillStyle = color;
    this.ctxAux.fillRect(0, 0, 1, 1);

    const colornuevo = this.ctxAux.getImageData(0, 0, 1, 1).data;

    let color_hsv = calculo.rgbaToHsv(
        colornuevo[0],
        colornuevo[1],
        colornuevo[2]
    );

    const nuevo_tono = tono - 50;
    const nueva_saturacion = saturacion - 50;

    for (let i = 0; i < Data.length; i += 4) {

        // Los píxeles transparentes no necesitan recoloración.
        if (Data[i + 3] === 0) continue;

        const hsv_Data = calculo.rgbaToHsv(
            Data[i],
            Data[i + 1],
            Data[i + 2]
        );

        hsv_Data.h = color_hsv.h;

        if (hsv_Data.h < 0) hsv_Data.h += 360;
        if (hsv_Data.h > 360) hsv_Data.h -= 360;

        hsv_Data.s += nueva_saturacion;

        if (hsv_Data.s < 0) hsv_Data.s = 0;
        if (hsv_Data.s > 100) hsv_Data.s = 100;

        hsv_Data.v += nuevo_tono;

        if (hsv_Data.v < 0) hsv_Data.v = 0;
        if (hsv_Data.v > 100) hsv_Data.v = 100;

        const colorFinal = calculo.hsvToRgba(
            hsv_Data.h,
            hsv_Data.s,
            hsv_Data.v
        );

        Data[i] = colorFinal.r;
        Data[i + 1] = colorFinal.g;
        Data[i + 2] = colorFinal.b;
    }

    ctx.putImageData(Dataimage, 0, 0);

    // Dibujar sobre el robot solamente cuando corresponda.
    if (componer) {
        this.ctxOculto.drawImage(canvas, 0, 0);
    }
}


prepararAnimacionPiernas(piernasCaminar, piernasNormales) {

    const animacion = this.animacionPiernas;

    animacion.frames = [];
    animacion.actual = 0;
    animacion.contador = 0;

    if (!piernasCaminar || !piernasNormales) return;

    const ancho = piernasNormales[0].naturalWidth;
    const alto = piernasNormales[0].naturalHeight;

    const separacion = 1;

    const anchoTira = piernasCaminar[0].naturalWidth;

    const cantidadFrames = Math.floor(
        (anchoTira + separacion) / (ancho + separacion)
    );

    for (let i = 0; i < cantidadFrames; i++) {

        const canvas = document.createElement("canvas");

        canvas.width = ancho;
        canvas.height = alto;

        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });

        const xFrame = 1 + i * (ancho + separacion);
const yFrame = 1;

ctx.drawImage(
    piernasCaminar[0],
    xFrame, yFrame,
    ancho, alto,
    0, 0,
    ancho, alto
);

ctx.drawImage(
    piernasCaminar[1],
    xFrame, yFrame,
    ancho, alto,
    0, 0,
    ancho, alto
);

        animacion.frames.push(canvas);
    }

    console.log(
        "Frames de piernas preparados:",
        cantidadFrames
    );
}


setCaminando(activo) {

    const animacion = this.animacionPiernas;

    if (animacion.activa === activo) return;

    animacion.activa = activo;

    if (!activo) {

        animacion.actual = 0;
        animacion.contador = 0;

        // Restaurar las piernas normales.
        this.cambiarcolores(
            this.coloresCapas,
            this.tonosCapas,
            this.saturacionesCapas
        );
    }
}


actualizarAnimacion() {

    const animacion = this.animacionPiernas;

    if (!animacion.activa) return;

    if (animacion.frames.length === 0) return;

    animacion.contador++;

    if (animacion.contador < animacion.velocidad) return;

    animacion.contador = 0;

    animacion.actual++;

    if (animacion.actual >= animacion.frames.length) {
        animacion.actual = 0;
    }

    // Recolorear el frame actual.
    this.recolor(
        animacion.frames[animacion.actual],
        this.canvases[0],
        this.ctxs[0],
        this.coloresCapas[1],
        this.tonosCapas[0],
        this.saturacionesCapas[0],
        false
    );

    // Reconstruir todas las capas del robot.
    this.ctxOculto.clearRect(
        0,
        0,
        this.canvasOculto.width,
        this.canvasOculto.height
    );

    this.canvases.forEach(canvas => {
        this.ctxOculto.drawImage(canvas, 0, 0);
    });
}


        guardarimagen(clave, imagen, i) {
            this.imagenes[clave] = imagen;
            let img_aux = imagen;
            if(Array.isArray(imagen)) img_aux = imagen[0];

            this.canvases[i] = document.createElement('canvas');
            this.canvases[i].width = img_aux.naturalWidth || img_aux.width;
            this.canvases[i].height = img_aux.naturalHeight || img_aux.height;
            this.ctxs[i] = this.canvases[i].getContext('2d', {willReadFrequently: true});
            this.canvasOculto.width = img_aux.naturalWidth || img_aux.width;
            this.canvasOculto.height = img_aux.naturalHeight || img_aux.height;
        }
        guardarimagenes(claves, imgs) {
            claves.forEach((clave, i) => {
                if (imgs[i])
                {
                    this.guardarimagen(clave, imgs[i], i);
                    /*this.imagenes[clave] = imgs[i];
                    this.canvases[i] = document.createElement('canvas');
                    this.canvases[i].width = imgs[i].naturalWidth || imgs[i].width;
                    this.canvases[i].height = imgs[i].naturalHeight || imgs[i].height;
                    this.ctxs[i] = this.canvases[i].getContext('2d');
                    //this.ctxOculto.drawImage(imgs[i], 0, 0);
                   //console.log(this.ctxOculto);
                    this.canvasOculto.width = imgs[i].naturalWidth || imgs[i].width;
                    this.canvasOculto.height = imgs[i].naturalHeight || imgs[i].height;*/
                }
            });
        }
        cambiarimagen(imagen, clave){
            this.imagenes[clave] = imagen;
        }
        
        dibujar(can, ct, tamaño){
            pincel.dibujarData(this.canvasOculto, can, ct, tamaño, this.x, this.y);
        }
        dibujar_max(can, ct, tamaño_x, tamaño_y){
            pincel.dibujarData_total(this.canvasOculto, can, ct, tamaño_x, tamaño_y);
        }

        cambiarHitbox(hitbox){
            this.hitbox = hitbox;
        }
    }