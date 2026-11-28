// El número coincide con el campo "rol" del token
export enum Roles {
  Admin = 0,
  Persona,
  Alumno,
  Profesor,
  Socio,
  Doctor
}
// Ruta del recurso propio de cada rol
export const RUTA_ROL: Record<number, string> = {
  [Roles.Admin]: 'admin',
  [Roles.Persona]: 'persona',
  [Roles.Alumno]: 'alumno',
  [Roles.Profesor]: 'profesor',
  [Roles.Socio]: 'socio',
  [Roles.Doctor]: 'doctor'
};
