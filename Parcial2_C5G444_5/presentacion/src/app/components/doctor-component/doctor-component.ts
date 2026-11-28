import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { form, FormField } from '@angular/forms/signals';
import { DoctorService } from '../../shared/services/doctor-service';
import { IDoctor } from '../../shared/models/interfaces';
import { Accion, mensajeResultado } from '../../shared/helpers/mensajes';
import { FrmDoctor } from '../forms/frm-doctor/frm-doctor';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';

type FilterForm = {
  nombre: string;
  especialidad: string;
};

@Component({
  imports: [MatButtonModule, MatTableModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, FormField],
  selector: 'app-doctor-component',
  templateUrl: './doctor-component.html',
})
export class DoctorComponent implements OnInit {
  displayedColumns: string[] = [
    'idUsuario',
    'nombre',
    'especialidad',
    'correo',
    'telefono',
    'celular',
    'ultima_consulta',
    'direccion',
    'botonera'
  ];
  dataSource = signal<IDoctor[]>([]);
  mensajeVacio = signal('');
  srvDoctor = inject(DoctorService);
  dialog = inject(MatDialog);

  objFilter = signal<FilterForm>({
    nombre : '',
    especialidad : ''
  });
  frmFilter = form(this.objFilter);

  ngOnInit(): void {
    this.buscar();
  }

  // Filtro: solo se envían los campos con valor; si ambos están vacíos, lista completa (GET /read)
  buscar() {
    const nombre = this.objFilter().nombre.trim();
    const especialidad = this.objFilter().especialidad.trim();
    const hayFiltro = nombre !== '' || especialidad !== '';
    const consulta = hayFiltro
      ? this.srvDoctor.filtrar({ nombre, especialidad })
      : this.srvDoctor.leer();

    consulta.subscribe({
      next: (res) => {
        this.dataSource.set(res.status === 200 && res.body ? res.body : []);
        this.mensajeVacio.set(hayFiltro ? 'No hay coincidencias' : 'No hay registros');
      },
      error: (err: HttpErrorResponse) => {
        this.dataSource.set([]);
        if (err.status !== 401) {
          this.alertar('No se pudo cargar la lista (código ' + err.status + ')');
        }
      }
    });
  }
  limpiarFiltro() {
    this.objFilter.set({ nombre: '', especialidad: '' });
    this.buscar();
  }

  private alertar(mensaje: string) {
    this.dialog.open(DialogoGeneral, {
      maxWidth: '24rem',
      data: { titulo: 'Resultado', texto: mensaje, textoAceptar: 'Aceptar' }
    });
  }
  private confirmar(mensaje: string) {
    return this.dialog.open(DialogoGeneral, {
      maxWidth: '24rem',
      data: { titulo: 'Confirmación', texto: mensaje, textoAceptar: 'Aceptar', textoCancelar: 'Cancelar' }
    }).afterClosed();
  }
  // Muestra el mensaje según el código de estado y actualiza la lista
  private resultado(accion: Accion, status: number) {
    if (status !== 401) { // con 401 la sesión ya se manejó en el interceptor
      this.alertar(mensajeResultado(accion, status));
    }
    this.buscar();
  }

  public mostrarDialogo(titulo: string, datos?: IDoctor) {
    const dialogRef = this.dialog.open<FrmDoctor, unknown, IDoctor | false | undefined>(FrmDoctor, {
      width: '100%',
      maxWidth: '35rem',
      data: {
        title: titulo,
        data: datos
      },
      disableClose : true
    });
    dialogRef.afterClosed().subscribe((doctor) => {
      if (doctor === undefined || doctor === false) {
        return;
      }
      const modificando = datos !== undefined;
      this.confirmar(modificando ? '¿Desea modificar los datos del doctor?' : '¿Desea guardar el nuevo doctor?')
        .subscribe((acepto) => {
          if (!acepto) {
            return;
          }
          if (modificando) {
            const { idUsuario, ...cuerpo } = doctor; // el idUsuario no se envía en el PUT
            this.srvDoctor.modificar(datos.idUsuario, cuerpo).subscribe({
              next: (res) => this.resultado('modificar', res.status),
              error: (err: HttpErrorResponse) => this.resultado('modificar', err.status)
            });
          } else {
            this.srvDoctor.crear(doctor).subscribe({
              next: (res) => this.resultado('crear', res.status),
              error: (err: HttpErrorResponse) => this.resultado('crear', err.status)
            });
          }
        });
    });
  }

  onCreate() {
    this.mostrarDialogo('Nuevo Doctor');
  }
  // Carga el registro (GET /read/{idUsuario}) en el formulario
  onEdit(id: string) {
    this.srvDoctor.leerPorId(id).subscribe({
      next: (res) => {
        const doctor = res.status === 200 && res.body ? res.body[0] : undefined;
        if (doctor) {
          this.mostrarDialogo('Modificar Doctor', doctor);
        } else {
          this.alertar('El registro no existe');
          this.buscar();
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 401) {
          this.alertar('No se pudo cargar el registro (código ' + err.status + ')');
        }
      }
    });
  }
  onDelete(doctor: IDoctor) {
    this.confirmar(`¿Desea eliminar a ${doctor.nombre}?`).subscribe((acepto) => {
      if (!acepto) {
        return;
      }
      this.srvDoctor.eliminar(doctor.idUsuario).subscribe({
        next: (res) => this.resultado('eliminar', res.status),
        error: (err: HttpErrorResponse) => this.resultado('eliminar', err.status)
      });
    });
  }
}
