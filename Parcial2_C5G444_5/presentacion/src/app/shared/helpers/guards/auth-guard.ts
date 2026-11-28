import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Roles } from '../../models/roles';

// Sin sesión -> login. El administrador (rol 0) accede a todo; los demás roles,
// solo a las rutas que declaran su rol en data.roles. El rol sale del token (JWT).
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  const rol = authService.userActual.rol;
  const roles: number[] = route.data['roles'] ?? [];
  if (rol === Roles.Admin || roles.includes(rol)) {
    return true;
  }
  return router.createUrlTree(['/error403']);
};
