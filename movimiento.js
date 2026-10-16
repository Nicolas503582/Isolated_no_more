
export class movimiento {
    constructor(entidad) {
        this.entidad = entidad;
        this.movimiento = {x: 0, y: 0, z: 0};
        //direccion {x=0, z=0};
    }

    moviendo(direccion, salto = false)
    {
        this.mover(direccion, salto);
        this.movicion();
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
}