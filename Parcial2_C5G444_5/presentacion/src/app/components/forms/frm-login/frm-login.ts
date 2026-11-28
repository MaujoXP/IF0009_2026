import { Component, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, FormRoot, form, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { LoginForm } from '../../../shared/models/interfaces';
import { AuthService } from '../../../shared/services/auth.service';
import { RUTA_ROL } from '../../../shared/models/roles';

@Component({
  selector: 'app-frm-login',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormRoot, FormField],
  templateUrl: './frm-login.html',
})
export class FrmLogin {

  private readonly srvAuth = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef<FrmLogin>);
  private readonly router = inject(Router);
  public mensajeError = signal('');
  objLogin = signal<LoginForm>({
    idUsuario : '',
    passw: ''
  });

  frmLogin = form(this.objLogin, (s)=> {
    required(s.idUsuario, { message: 'Usuario es requerido'});
    required(s.passw, { message: 'Contraseña es requerida'});
  },
  {
    submission: {
      action: async () => {
        this.login(this.objLogin());
      }
    }
  });

  login(datos : LoginForm) {
    this.srvAuth.login(datos)
      .subscribe({
        next: (res) => {
          if (res === true) {
            this.dialogRef.close();
            this.router.navigate(['/' + RUTA_ROL[this.srvAuth.userActual.rol]]);
          } else if (res === 401) {
            this.mensajeError.set('Usuario o contraseña incorrecto');
          } else {
            this.mensajeError.set('No se pudo iniciar sesión, intente de nuevo');
          }
        }
      })
  }
}
