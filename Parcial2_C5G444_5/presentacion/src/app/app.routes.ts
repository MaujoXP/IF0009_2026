import { Routes } from '@angular/router';
import { authGuard } from './shared/helpers/guards/auth-guard';
import { Roles } from './shared/models/roles';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login',
        loadComponent: () => import('./components/login/login')
        .then(m => m.Login)
    },
    { path: 'admin',
        canActivate: [authGuard], data: {roles: [Roles.Admin]},
        loadComponent: () => import('./components/admin-component/admin-component')
        .then(m => m.AdminComponent)
    },
    { path: 'persona',
        canActivate: [authGuard], data: {roles: [Roles.Admin, Roles.Persona]},
        loadComponent: () => import('./components/persona-component/persona-component')
        .then(m => m.PersonaComponent)
    },
    { path: 'alumno',
        canActivate: [authGuard], data: {roles: [Roles.Admin, Roles.Alumno]},
        loadComponent: () => import('./components/alumno-component/alumno-component')
        .then(m => m.AlumnoComponent)
    },
    { path: 'profesor',
        canActivate: [authGuard], data: {roles: [Roles.Admin, Roles.Profesor]},
        loadComponent: () => import('./components/profesor-component/profesor-component')
        .then(m => m.ProfesorComponent)
    },
    { path: 'socio',
        canActivate: [authGuard], data: {roles: [Roles.Admin, Roles.Socio]},
        loadComponent: () => import('./components/socio-component/socio-component')
        .then(m => m.SocioComponent)
    },
    { path: 'doctor',
        canActivate: [authGuard], data: {roles: [Roles.Admin, Roles.Doctor]},
        loadComponent: () => import('./components/doctor-component/doctor-component')
        .then(m => m.DoctorComponent)
    },
    { path: 'error403', loadComponent: () => import ('./components/error403-component/error403-component')
        .then(m => m.Error403Component)
    },
    { path: '**', loadComponent: () => import ('./components/error404-component/error404-component')
        .then(m => m.Error404Component)
    },
];
