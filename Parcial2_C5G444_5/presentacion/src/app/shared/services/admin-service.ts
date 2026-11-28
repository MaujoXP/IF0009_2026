import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IAdmin } from '../models/interfaces';
import { environment } from '../../../environments/environment';

const API_URL = environment.servidor + '/admin';

export type FiltroAdmin = { nombre?: string; correo?: string };

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  // GET /read  (200 lista, 204 sin registros)
  leer() {
    return this.http.get<IAdmin[]>(`${API_URL}/read`, { observe: 'response' });
  }
  // GET /read/{idUsuario}  (200 arreglo con un registro, 204 no existe)
  leerPorId(id: string) {
    return this.http.get<IAdmin[]>(`${API_URL}/read/${encodeURIComponent(id)}`, { observe: 'response' });
  }
  // GET /filtro?nombre=..&correo=..  (solo se envían los campos con valor)
  filtrar(filtro: FiltroAdmin) {
    let params = new HttpParams();
    if (filtro.nombre) { params = params.set('nombre', filtro.nombre); }
    if (filtro.correo) { params = params.set('correo', filtro.correo); }
    return this.http.get<IAdmin[]>(`${API_URL}/filtro`, { params, observe: 'response' });
  }
  // POST  (201 creado, 400, 409)
  crear(datos: IAdmin) {
    return this.http.post<unknown>(API_URL, datos, { observe: 'response' });
  }
  // PUT /{idUsuario}  (200 modificado, 204, 400, 409). El cuerpo no lleva idUsuario
  modificar(id: string, datos: Omit<IAdmin, 'idUsuario'>) {
    return this.http.put<unknown>(`${API_URL}/${encodeURIComponent(id)}`, datos, { observe: 'response' });
  }
  // DELETE /{idUsuario}  (200 eliminado, 204 no existe)
  eliminar(id: string) {
    return this.http.delete<unknown>(`${API_URL}/${encodeURIComponent(id)}`, { observe: 'response' });
  }
}
