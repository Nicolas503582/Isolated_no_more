
export class movimiento {
    constructor(entidad) {
        this.entidad = entidad;
        this.movimiento = {x: 0, y: 0, z: 0};
        //direccion {x=0, z=0};
    }

    moviendo(direccion, espacio_x, espacio_y, id, salto = false)
    {
        this.mover(direccion, salto);
        if(this.comprobar(espacio_x, espacio_y, id))
        {
            this.movicion();
        }
    }

    mover(direccion, salto) {
        this.caminar(direccion);
        if (salto) {
            this.saltar();
        }
        this.escalar(direccion.y);
        this.gravedad();
    }
    movicion() {
        this.entidad.x += this.movimiento.x;
        this.entidad.y += this.movimiento.z;
        this.entidad.z += this.movimiento.y;
    }

    caminar(direccion) {    //x, z
        this.movimiento_x(direccion.x);
        this.movimiento_z(direccion.z);
    }
    movimiento_x(x) {
        this.movimiento.x = x * this.entidad.velocidad;
    }
    movimiento_z(z) {
        this.movimiento.z = z * this.entidad.velocidad;
    }
    saltar() {
        this.movimiento.y = this.entidad.salto;    //el salto es una característica de la entidad
    }
    escalar(y){
        this.movimiento.y = y * this.entidad.velocidad;
    }
    gravedad() {
        this.movimiento.y -= 1;
    }

    comprobar(x, y, id)
    {
        let toca_x = false;
        let toca_y = false;
        for(let i = this.entidad.x + this.entidad.hitbox.x + this.movimiento.x; i < this.entidad.x + this.entidad.hitbox.x + this.entidad.hitbox.ancho + this.movimiento.x; i++)
        {
            x[i].forEach(espacio => {
                if(espacio != id)
                {
                    toca_x = true;
                }
            });
        }
        for(let i = this.entidad.y + this.entidad.hitbox.y + this.movimiento.z; i < this.entidad.y + this.entidad.hitbox.y + this.entidad.hitbox.alto + this.movimiento.z; i++)
        {
            y[i].forEach(espacio => {
                if(espacio != id)
                {
                    toca_y = true;
                }
            });
        }
        const toca = toca_x == true && toca_y == true;
        console.log(toca, toca_x, toca_y);
        return !toca;
    }
}