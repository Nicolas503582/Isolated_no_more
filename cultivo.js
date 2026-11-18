
export class Cultivo{
    constructor( id = 0, nombre = "zanahoria", agua = 1440, viva = true, tiempo_plantado = {"d": 0, "h" : 0, "m": 0}, edad = 0/*En minutos*/)
    {
        this.tiempo_plantado = tiempo_plantado;
        this.nombre = nombre;
        this.id = id;
        this.agua_nec = agua;
        this.edad = edad;
        this.viva = viva;
    }

    crec(){
        document.addEventListener("5_minutos", (e) =>{
            this.edad+= 5;
            this.tiempo_plantado.m+=5;
            if(this.tiempo_plantado.m >= 60)
            {
                this.tiempo_plantado.m -=60;
                this.tiempo_plantado.h++;
                if(this.tiempo_plantado.h >= 24)
                {
                    this.tiempo_plantado.h -= 24;
                    this.tiempo_plantado.d ++;
                }
            }
            this.agua-=5;
            if(this.agua == 0)
            {
                this.morir();
            }
            //simular crecimiento cambiando las imagenes;
        });
    }
    regar(){
        this.agua=1440;
    }
    morir(){
        //reemplazar por planta muerta;
    }
}