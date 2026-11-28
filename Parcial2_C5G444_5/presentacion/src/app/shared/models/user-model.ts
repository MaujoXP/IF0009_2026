export class User {
    id : string;
    nombre : string;
    rol : number;
    constructor(usr? :  User) {
        this.id = usr !== undefined ? usr.id : '';
        this.nombre = usr !== undefined ? usr.nombre : '';
        this.rol = usr !== undefined ? usr.rol : -1;
    }
}
