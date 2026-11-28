import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { jwtInterceptor } from './shared/helpers/interceptors/jwt-interceptor';
import { refreshInterceptor } from './shared/helpers/interceptors/refresh-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([jwtInterceptor, refreshInterceptor])),
    // withHashLocation: las rutas funcionan al recargar con el nginx por defecto del contenedor
    provideRouter(routes, withHashLocation())
  ]
};
