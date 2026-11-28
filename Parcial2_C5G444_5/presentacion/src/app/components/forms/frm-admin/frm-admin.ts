import { Component, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { form, FormField, FormRoot, maxLength, readonly, required } from '@angular/forms/signals';
import { IAdmin } from '../../../shared/models/interfaces';

interface AdminDialogData {
  title: string;
  data?: IAdmin;
}

@Component({
  imports: [
    MatDialogModule, MatDividerModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormRoot, FormField
  ],
  selector: 'app-frm-admin',
  templateUrl: './frm-admin.html',
})
export class FrmAdmin {
  private readonly dialogRef = inject(MatDialogRef<FrmAdmin, IAdmin | false>);
  private readonly dialogData = inject<AdminDialogData>(MAT_DIALOG_DATA);
  readonly titulo = this.dialogData.title;
  readonly isEditing = this.dialogData.data !== undefined;

  objAdmin = signal<IAdmin>({
    idUsuario: this.dialogData.data?.idUsuario ?? '',
    nombre: this.dialogData.data?.nombre ?? '',
    correo: this.dialogData.data?.correo ?? '',
    direccion: this.dialogData.data?.direccion ?? ''
  });

  frmAdmin = form(this.objAdmin, (s) => {
    required(s.idUsuario, {message: 'El idUsuario es requerido'});
    maxLength(s.idUsuario, 15, {message: 'El idUsuario no puede tener más de 15 caracteres'});
    if (this.isEditing) {
      readonly(s.idUsuario); // el idUsuario no se puede modificar
    }

    required(s.nombre, {message: 'El nombre es requerido'});
    maxLength(s.nombre, 70, {message: 'El nombre no puede tener más de 70 caracteres'});

    required(s.correo, {message: 'El correo es requerido'});
    maxLength(s.correo, 100, {message: 'El correo no puede tener más de 100 caracteres'});

    required(s.direccion, {message: 'La dirección es requerida'});
    maxLength(s.direccion, 255, {message: 'La dirección no puede tener más de 255 caracteres'});
  }, {
    submission: {
      action: async () => {
        const v = this.objAdmin();
        this.dialogRef.close({
          idUsuario: v.idUsuario.trim(),
          nombre: v.nombre.trim(),
          correo: v.correo.trim(),
          direccion: v.direccion.trim()
        } as IAdmin);
      }
    }
  });
}
