import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../../environments/environment';

const AUTH_URL = environment.servidor + '/auth';

// Agrega Authorization: Bearer a todas las peticiones, excepto las de /api/auth
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).token;
  if (token && !req.url.startsWith(AUTH_URL)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
