import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './shared/services/auth.service';

type MenuItem = {
  label : string;
  route : string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MatToolbarModule, MatSidenavModule,
    MatListModule, MatButtonModule, MatDividerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly authService = inject(AuthService);

  menuItems : MenuItem[] = [
    {label: 'Administrador', route: 'admin'},
    {label: 'Persona', route: 'persona'},
    {label: 'Alumno', route: 'alumno'},
    {label: 'Profesor', route: 'profesor'},
    {label: 'Socio', route: 'socio'},
    {label: 'Doctor', route: 'doctor'}
  ];

  loggout(){
    this.authService.loggout();
  }
}
