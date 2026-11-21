
export class Mente_animal{
    constructor(info, comida/*comida que come el animal */, felicidad, miedo, hambre, sed, cariño){
        this.x = info.x;
        this.y = info.y;
        this.ancho = info.ancho;
        this.alto = info.alto;
        this.comida = comida;
        this.felicidad = felicidad;
        this.miedo = miedo;
        this.hambre = hambre;
        this.sed = sed;
        this.cariño = cariño;
        this.destino = {"x": this.x, "y": this.y};
    }

    mirar(espacio_x, espacio_y, entidades)
    {
        let comienzo_x = Math.max(this.x - 90, 0);
        let comienzo_y = Math.max(this.y - 90, 0);
        let final_x = Math.min(this.x + this.ancho + 90, espacio_x.length);
        let final_y = Math.min(this.y + this.alto  + 90, espacio_y.length);
        let comida_x = [];
        let comida_y = [];
        for(let i = comienzo_x; i < final_x; i++)
        {
            const l = espacio_x[i].findIndex( id => entidades[id].id == this.comida.id);
            if(l!= -1)
            {
                comida_x.push({"pos": i, "id": espacio_x[i][l]});
            }
        }
        for(let i = comienzo_y; i < final_y; i++)
        {
            comida_x.forEach(aparicion => {
                const l = espacio_y[i].indexOf(aparicion.id);
                if(l != -1)
                {
                    comida_y.push({"pos": i, "id": espacio_y[l][l]});
                }
            });
        }

        let x_min = 0;
        let y_min = 0;
        let d_min = Infinity;
        comida_y.forEach(aparicion => {
            const aparicion_x = comida_x[comida_x.findIndex(comida_encontrada_x => comida_encontrada_x.id == aparicion.id)];
            if(Math.abs(aparicion_x.pos - this.x) + Math.abs(aparicion.pos - this.y) < d_min)
            {
                d_min = Math.abs(aparicion_x.pos - this.x) + Math.abs(aparicion.pos - this.y);
                x_min = aparicion_x.pos; 
                y_min = aparicion.pos;
            }
        });

        if(d_min != Infinity)
        {
            this.destino = {"x": x_min, "y": y_min};
        }
    }

    caminar(){
        //Necesito usar un algoritmo para esto No se como se hace
    }

    ejecutar(){
        if(this.destino.x!=this.x || this.destino.y != this.y){

        }
    }
}