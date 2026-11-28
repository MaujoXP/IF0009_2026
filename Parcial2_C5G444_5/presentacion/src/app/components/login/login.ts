import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FrmLogin } from '../forms/frm-login/frm-login';
import { AuthService } from '../../shared/services/auth.service';
import { RUTA_ROL } from '../../shared/models/roles';

@Component({
  selector: 'app-login',
  template: '',
})
export class Login implements OnInit, OnDestroy {
  private readonly dialogo = inject(MatDialog);
  private readonly srvAuth = inject(AuthService);
  private readonly router = inject(Router);
  private dialogoRef?: MatDialogRef<FrmLogin>;

  mostrarDialogo() {
    this.dialogoRef = this.dialogo.open(FrmLogin, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      closeOnNavigation: false
    });
  }

  ngOnInit(): void {
    // con sesión vigente se va directo al recurso del usuario
    if (this.srvAuth.isLoggedIn()) {
      this.router.navigate(['/' + RUTA_ROL[this.srvAuth.userActual.rol]]);
      return;
    }
    this.mostrarDialogo();
  }

  ngOnDestroy(): void {
    this.dialogoRef?.close();
  }
}
