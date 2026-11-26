
export class movimiento {
    constructor(entidad) {
        this.entidad = entidad;
        this.movimiento = {x: 0, y: 0, z: 0};
        //direccion {x=0, z=0};
    }

    moviendo(direccion, espacio_x, espacio_y, id = this.entidad.id, salto = false)
    {
        this.mover(direccion, salto);

        if(this.comprobar(espacio_x, espacio_y, id))
        {
            this.movicion();
            this.afectarHitbox(espacio_x, espacio_y, id);
        }
        let aux = (this.movimiento.x == 0) + "" + (this.movimiento.z == 0);
        switch (aux)
        {
            case "falsetrue":
                this.entidad.direccion = {y: this.movimiento.z, x: this.movimiento.x};
            break;

            case "falsefalse":
                this.entidad.direccion = {y: this.movimiento.z, x: this.movimiento.x};
            break;

            case "truefalse":
                this.entidad.direccion = {y: this.movimiento.z, x: this.movimiento.x};
            break;
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
        let toca = false;
        let toca_x = [];
        let toca_y = [];
        for(let i = this.entidad.x + this.entidad.hitbox.x + this.movimiento.x; i < this.entidad.x + this.entidad.hitbox.x + this.entidad.hitbox.ancho + this.movimiento.x; i++)
        {
            x[i].forEach(espacio => {
                if(espacio != id)
                {
                    toca_x.push(espacio);
                }
            });
        }
        for(let i = this.entidad.y + this.entidad.hitbox.y + this.movimiento.z; i < this.entidad.y + this.entidad.hitbox.y + this.entidad.hitbox.alto + this.movimiento.z; i++)
        {
            y[i].forEach(espacio => {
                if(espacio != id)
                {
                    if(toca_x.includes(espacio))
                    {
                        toca = true;
                    }
                }
            });
        }
        //console.log(toca, toca_x, toca_y);
        return !toca;
    }
    afectarHitbox(espacio_x, espacio_y, id){
        for(let i = this.entidad.x + this.entidad.hitbox.x - this.movimiento.x; i < this.entidad.x + this.entidad.hitbox.x + this.entidad.hitbox.ancho - this.movimiento.x; i++)
        {
            espacio_x[i] = espacio_x[i].filter(espacio => espacio != id);
        }
        for(let i = this.entidad.y + this.entidad.hitbox.y - this.movimiento.z; i < this.entidad.y + this.entidad.hitbox.y + this.entidad.hitbox.alto - this.movimiento.z; i++)
        {
            espacio_y[i] = espacio_y[i].filter(espacio => espacio != id);
        }

        for(let i = this.entidad.x + this.entidad.hitbox.x; i < this.entidad.x + this.entidad.hitbox.x + this.entidad.hitbox.ancho; i++)
        {
            espacio_x[i].push(id);
        }
        for(let i = this.entidad.y + this.entidad.hitbox.y; i < this.entidad.y + this.entidad.hitbox.y + this.entidad.hitbox.alto; i++)
        {
            espacio_y[i].push(id);
        }
    }
}

export class movimientoCorral extends movimiento {
    constructor(entidad, idPermitido) {
        super(entidad);

        this.idPermitido = idPermitido;

        this.direcciones = [
            { x: 1, z: 0, y: 0},
            { x: -1, z: 0, y: 0 },
            { x: 0, z: 1, y: 0 },
            { x: 0, z: -1, y: 0 }
        ];

        this.direccionAleatoria = this.elegirDireccion();
    }

    mover(direccion) {
        this.caminar(direccion);
        this.movimiento.y = 0;
    }

    elegirDireccion() {
        const indice = Math.floor(Math.random() * this.direcciones.length);
        return this.direcciones[indice];
    }

    moverAleatorio(espacio_x, espacio_y) {
        const xAnterior = this.entidad.x;
        const yAnterior = this.entidad.y;


        this.moviendo(
            this.direccionAleatoria,
            espacio_x,
            espacio_y,
            this.entidad.id
        );


        if (
            this.entidad.x === xAnterior &&
            this.entidad.y === yAnterior
        ) {
            this.direccionAleatoria = this.elegirDireccion();
        }

        console.groupEnd();
    }

    comprobar(x, y, id) {

        console.log("Posición:", {
            x: this.entidad.x,
            y: this.entidad.y
        });

        // Comprobar eje X
        const inicioX = this.entidad.x + this.entidad.hitbox.x + this.movimiento.x;
        const finalX = inicioX + this.entidad.hitbox.ancho;


        for (let i = inicioX; i < finalX; i++) {

            if (!x[i] || !x[i].includes(this.idPermitido)) {
                console.warn("BLOQUEADO EN X: no pertenece al corral", i);
                console.groupEnd();
                return false;
            }

            if (x[i].some(espacio => espacio !== id && espacio !== this.idPermitido)) {
                
                return false;
            }
        }

        // Comprobar eje Y
        const inicioY = this.entidad.y + this.entidad.hitbox.y + this.movimiento.z;
        const finalY = inicioY + this.entidad.hitbox.alto;
;

        for (let i = inicioY; i < finalY; i++) {

            if (!y[i] || !y[i].includes(this.idPermitido)) {
                return false;
            }

            if (y[i].some(espacio => espacio !== id && espacio !== this.idPermitido)) {
                return false;
            }
        }


        return true;
    }
}