export type Accion = 'crear' | 'modificar' | 'eliminar';

// Mensaje de resultado según el código de estado devuelto por la API
export function mensajeResultado(accion: Accion, status: number): string {
  switch (accion) {
    case 'crear':
      if (status === 201) return 'Registro creado correctamente';
      if (status === 400) return 'Datos inválidos: falta el idUsuario';
      if (status === 409) return 'El idUsuario o el correo ya existe';
      break;
    case 'modificar':
      if (status === 200) return 'Registro modificado correctamente';
      if (status === 204) return 'El registro no existe o no hubo cambios';
      if (status === 400) return 'No se enviaron campos válidos';
      if (status === 409) return 'El correo ya existe';
      break;
    case 'eliminar':
      if (status === 200) return 'Registro eliminado correctamente';
      if (status === 204) return 'El registro no existe';
      break;
  }
  if (status === 0) return 'No se pudo conectar con el servidor';
  return `Error inesperado (código ${status})`;
}
