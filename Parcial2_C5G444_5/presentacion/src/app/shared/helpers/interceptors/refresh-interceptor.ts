import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';

const AUTH_URL = environment.servidor + '/auth';

// Ante un 401 intenta refrescar la sesión y repite la petición.
// Si el refresco también devuelve 401, elimina los tokens y envía al login.
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const srvAuth = inject(AuthService);

  if (req.url.startsWith(AUTH_URL)) {
    return next(req);
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      return srvAuth.refreshSession().pipe(
        switchMap((tokens) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${tokens.token}` } }))
        ),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            srvAuth.doLogOut();
          }
          return throwError(() => err);
        })
      );
    })
  );
};
