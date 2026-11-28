export interface IToken {
    token : string;
    tkRef : string;
}
export interface LoginForm {
    idUsuario : string;
    passw : string;
}
// Recurso asignado (5): Doctor  -> /api/doctor
export interface IDoctor {
    idUsuario : string;          // llave, máx. 15, no se modifica
    nombre : string;             // máx. 50
    especialidad : string;       // máx. 25
    correo : string;             // máx. 100
    telefono : string | null;    // máx. 10 (opcional)
    celular : string;            // máx. 10
    ultima_consulta : string | null; // AAAA-MM-DD (opcional)
    direccion : string | null;   // máx. 100 (opcional)
}
// Administrador (0) -> /api/admin
export interface IAdmin {
    idUsuario : string;          // llave, máx. 15, no se modifica
    nombre : string;             // máx. 70
    correo : string;             // máx. 100
    direccion : string;          // máx. 255
}
