import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';

import { IToken, LoginForm } from '../models/interfaces';
import { TokenService } from './token.service';
import { User } from '../models/user-model';
import { environment } from '../../../environments/environment';

const API_URL = environment.servidor + '/auth';

@Service()
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly srvTokens = inject(TokenService);
  private readonly router = inject(Router);
  public sesionActiva = signal(this.isLoggedIn());
  public userActualS = signal(this.userActual);
  private refrescando$?: Observable<IToken>;

  // PATCH /api/auth/login  -> devuelve true si inició sesión, o el código de estado del error
  public login(datos : LoginForm) {
    return this.http.patch<IToken>(`${API_URL}/login`, datos)
      .pipe(
        tap((tokens) => {
          this.doLogin(tokens);
        }),
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      )
  }
  // PATCH /api/auth/logout/{idUsuario}
  public loggout() {
    if (this.srvTokens.token) {
      this.http.patch(`${API_URL}/logout/${this.userActual.id}`, null)
        .subscribe({ error: () => {} });
    }
    this.doLogOut();
  }
  // PATCH /api/auth/refresh. Si varias peticiones fallan a la vez, comparten un solo refresco
  public refreshSession() : Observable<IToken> {
    if (!this.refrescando$) {
      this.refrescando$ = this.http.patch<IToken>(`${API_URL}/refresh`,
        { idUsuario: this.userActual.id, tkRef: this.srvTokens.refreshToken })
        .pipe(
          tap((tokens) => this.doLogin(tokens)),
          finalize(() => this.refrescando$ = undefined),
          shareReplay(1)
        );
    }
    return this.refrescando$;
  }
  doLogin(tokens  : IToken) {
    //guardar los tokens
    this.srvTokens.setTokens(tokens);
    //actualizar datos globales para usuario y rol
    this.userActualS.set(this.userActual);
    this.sesionActiva.set(true);
  }
  doLogOut() {
    //Eliminar los tokens
    this.srvTokens.removeTokens();
    //limpiar datos globales para usuario y rol
    this.userActualS.set(this.userActual);
    this.sesionActiva.set(false);
    //navegar a la página de login
    this.router.navigate(['/login']);
  }
  public isLoggedIn() : boolean {
    return !!this.srvTokens.token;
  }
  // Datos del usuario tomados del token (sub = usuario, nom = nombre, rol = rol)
  public get userActual() : User {
    if(!this.srvTokens.token) {
      return new User();
    }
    try {
      const tokenD = this.srvTokens.decodeToken();
      return new User({id: tokenD.sub, nombre: tokenD.nom, rol: Number(tokenD.rol)});
    } catch {
      return new User();
    }
  }
}
