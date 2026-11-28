import { Component, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { form, FormField, FormRoot, maxLength, readonly, required } from '@angular/forms/signals';
import { IDoctor } from '../../../shared/models/interfaces';

interface DoctorDialogData {
  title: string;
  data?: IDoctor;
}

type DoctorForm = {
  idUsuario: string;
  nombre: string;
  especialidad: string;
  correo: string;
  telefono: string;
  celular: string;
  ultima_consulta: string;
  direccion: string;
};

@Component({
  imports: [
    MatDialogModule, MatDividerModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormRoot, FormField
  ],
  selector: 'app-frm-doctor',
  templateUrl: './frm-doctor.html',
})
export class FrmDoctor {
  private readonly dialogRef = inject(MatDialogRef<FrmDoctor, IDoctor | false>);
  private readonly dialogData = inject<DoctorDialogData>(MAT_DIALOG_DATA);
  readonly titulo = this.dialogData.title;
  readonly isEditing = this.dialogData.data !== undefined;

  objDoctor = signal<DoctorForm>({
    idUsuario: this.dialogData.data?.idUsuario ?? '',
    nombre: this.dialogData.data?.nombre ?? '',
    especialidad: this.dialogData.data?.especialidad ?? '',
    correo: this.dialogData.data?.correo ?? '',
    telefono: this.dialogData.data?.telefono ?? '',
    celular: this.dialogData.data?.celular ?? '',
    ultima_consulta: (this.dialogData.data?.ultima_consulta ?? '').substring(0, 10),
    direccion: this.dialogData.data?.direccion ?? ''
  });

  frmDoctor = form(this.objDoctor, (s) => {
    required(s.idUsuario, {message: 'El idUsuario es requerido'});
    maxLength(s.idUsuario, 15, {message: 'El idUsuario no puede tener más de 15 caracteres'});
    if (this.isEditing) {
      readonly(s.idUsuario); // el idUsuario no se puede modificar
    }

    required(s.nombre, {message: 'El nombre es requerido'});
    maxLength(s.nombre, 50, {message: 'El nombre no puede tener más de 50 caracteres'});

    required(s.especialidad, {message: 'La especialidad es requerida'});
    maxLength(s.especialidad, 25, {message: 'La especialidad no puede tener más de 25 caracteres'});

    required(s.correo, {message: 'El correo es requerido'});
    maxLength(s.correo, 100, {message: 'El correo no puede tener más de 100 caracteres'});

    maxLength(s.telefono, 10, {message: 'El teléfono no puede tener más de 10 caracteres'});

    required(s.celular, {message: 'El celular es requerido'});
    maxLength(s.celular, 10, {message: 'El celular no puede tener más de 10 caracteres'});

    maxLength(s.direccion, 100, {message: 'La dirección no puede tener más de 100 caracteres'});
  }, {
    submission: {
      action: async () => {
        const v = this.objDoctor();
        // los campos opcionales vacíos se envían como null
        this.dialogRef.close({
          idUsuario: v.idUsuario.trim(),
          nombre: v.nombre.trim(),
          especialidad: v.especialidad.trim(),
          correo: v.correo.trim(),
          telefono: v.telefono.trim() || null,
          celular: v.celular.trim(),
          ultima_consulta: v.ultima_consulta || null,
          direccion: v.direccion.trim() || null
        } as IDoctor);
      }
    }
  });
}
