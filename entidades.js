import { dibujo } from './funciones_dibujo.js';
import { calculos } from './general.js';
import { movimiento } from './movimiento.js';

const pincel = new dibujo();
const calculo = new calculos();

export class Entidad{
        constructor(x, y, velocidad = 1, imagen = "", claves = [], imagenes = [] /*{"torso": torso.img ....}*/, colores_iniciales = ["red"], tono = 50, saturacion = 50){
            //this.listo = false;
            this.x = x; //x actual
            this.y = y; //y actual
            this.velocidad = velocidad;

            this.imagen = new Image();

            this.urls = imagen;
            this.claves = claves;
            this.imagenes = {};

            this.canvasOculto = document.createElement('canvas');
            this.canvasOculto.width = 1;
            this.canvasOculto.height = 1;
            this.ctxOculto = this.canvasOculto.getContext('2d');

            this.canvasAux = document.createElement('canvas');
            this.canvasAux.width = 1;
            this.canvasAux.height = 1;
            this.ctxAux = this.canvasAux.getContext('2d');
            this.canvases = [];
            this.ctxs = [];

            this.colores = colores_iniciales;
            this.tono_viejo = 0;
            this.tono = tono;
            this.saturacion_viejo = 0;
            this.saturacion = saturacion;

            this.movimiento = new movimiento(this);

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
                if(!colores[i]) colores[i] = colores[0];
                if(!tonos[i]) tonos[i] = tonos[0];
                if(!saturaciones[i]) saturaciones[i] = saturaciones[0];
                this.recolor(imagen, this.canvases[i], this.ctxs[i], colores[i], tonos[i], saturaciones[i]);
                //this.ctxOculto.drawImage(this.canvases[i], 0, 0);
                //this.ctxOculto.fillStyle = "red";
                //this.ctxOculto.fillRect(0,0,100,100);
            });
        }
        recolor(sprite, canvas, ctx, color, tono, saturacion)
        {
            ///////////hay que adaptarlo para solo recolorear una part

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(Array.isArray(sprite)){
                //console.log(sprite);
                sprite.forEach(img => {
                    ctx.drawImage(img, 0, 0);    
                });
            }
            else{
                ctx.drawImage(sprite, 0, 0);
            }
            let Dataimage = pincel.aNormal(ctx, canvas);
            let Data = Dataimage.data;

            this.ctxAux.fillStyle = color;
            this.ctxAux.fillRect(0, 0, 1, 1);
            const colornuevo = this.ctxAux.getImageData(0, 0, 1, 1).data;
            let color_hsv = calculo.rgbaToHsv(colornuevo[0], colornuevo[1], colornuevo[2]);

            const nuevo_tono = tono-50;
            const nueva_saturacion = saturacion-50;
            
            for(let i = 0; i < Data.length; i += 4){
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                //let aux = false;
                hsv_Data.h = color_hsv.h;
                if(hsv_Data.h < 0) hsv_Data.h += 360;
                if(hsv_Data.h > 360) hsv_Data.h -= 360;
                hsv_Data.s += nueva_saturacion;
                if(hsv_Data.s < 0) hsv_Data.s = 0;
                if(hsv_Data.s > 100) hsv_Data.s = 100;
                hsv_Data.v += nuevo_tono;
                if(hsv_Data.v < 0) hsv_Data.v = 0;
                if(hsv_Data.v > 100) hsv_Data.v = 100;
                
                
                let colorFinal = calculo.hsvToRgba(hsv_Data.h, hsv_Data.s, hsv_Data.v);
                Data[i] = colorFinal.r;
                Data[i + 1] = colorFinal.g;
                Data[i + 2] = colorFinal.b;
                Data[i + 3] = Data[i + 3];
            }
            ctx.putImageData(Dataimage, 0, 0);
            //this.ctxOculto.putImageData(Dataimage, 0, 0);
            this.ctxOculto.drawImage(canvas, 0, 0);
           //console.log(this.canvasOculto);
        }
        guardarimagen(clave, imagen, i) {
            this.imagenes[clave] = imagen;
            let img_aux = imagen;
            if(Array.isArray(imagen)) img_aux = imagen[0];

            this.canvases[i] = document.createElement('canvas');
            this.canvases[i].width = img_aux.naturalWidth || img_aux.width;
            this.canvases[i].height = img_aux.naturalHeight || img_aux.height;
            this.ctxs[i] = this.canvases[i].getContext('2d');
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
    }