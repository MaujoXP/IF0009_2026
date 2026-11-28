import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { form, FormField } from '@angular/forms/signals';
import { AdminService } from '../../shared/services/admin-service';
import { IAdmin } from '../../shared/models/interfaces';
import { Accion, mensajeResultado } from '../../shared/helpers/mensajes';
import { FrmAdmin } from '../forms/frm-admin/frm-admin';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';

type FilterForm = {
  nombre: string;
  correo: string;
};

@Component({
  imports: [MatButtonModule, MatTableModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, FormField],
  selector: 'app-admin-component',
  templateUrl: './admin-component.html',
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = [
    'idUsuario',
    'nombre',
    'correo',
    'direccion',
    'botonera'
  ];
  dataSource = signal<IAdmin[]>([]);
  mensajeVacio = signal('');
  srvAdmin = inject(AdminService);
  dialog = inject(MatDialog);

  objFilter = signal<FilterForm>({
    nombre : '',
    correo : ''
  });
  frmFilter = form(this.objFilter);

  ngOnInit(): void {
    this.buscar();
  }

  // Filtro: solo se envían los campos con valor; si ambos están vacíos, lista completa (GET /read)
  buscar() {
    const nombre = this.objFilter().nombre.trim();
    const correo = this.objFilter().correo.trim();
    const hayFiltro = nombre !== '' || correo !== '';
    const consulta = hayFiltro
      ? this.srvAdmin.filtrar({ nombre, correo })
      : this.srvAdmin.leer();

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
    this.objFilter.set({ nombre: '', correo: '' });
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

  public mostrarDialogo(titulo: string, datos?: IAdmin) {
    const dialogRef = this.dialog.open<FrmAdmin, unknown, IAdmin | false | undefined>(FrmAdmin, {
      width: '100%',
      maxWidth: '35rem',
      data: {
        title: titulo,
        data: datos
      },
      disableClose : true
    });
    dialogRef.afterClosed().subscribe((admin) => {
      if (admin === undefined || admin === false) {
        return;
      }
      const modificando = datos !== undefined;
      this.confirmar(modificando ? '¿Desea modificar los datos del administrador?' : '¿Desea guardar el nuevo administrador?')
        .subscribe((acepto) => {
          if (!acepto) {
            return;
          }
          if (modificando) {
            const { idUsuario, ...cuerpo } = admin; // el idUsuario no se envía en el PUT
            this.srvAdmin.modificar(datos.idUsuario, cuerpo).subscribe({
              next: (res) => this.resultado('modificar', res.status),
              error: (err: HttpErrorResponse) => this.resultado('modificar', err.status)
            });
          } else {
            this.srvAdmin.crear(admin).subscribe({
              next: (res) => this.resultado('crear', res.status),
              error: (err: HttpErrorResponse) => this.resultado('crear', err.status)
            });
          }
        });
    });
  }

  onCreate() {
    this.mostrarDialogo('Nuevo Administrador');
  }
  // Carga el registro (GET /read/{idUsuario}) en el formulario
  onEdit(id: string) {
    this.srvAdmin.leerPorId(id).subscribe({
      next: (res) => {
        const admin = res.status === 200 && res.body ? res.body[0] : undefined;
        if (admin) {
          this.mostrarDialogo('Modificar Administrador', admin);
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
  onDelete(admin: IAdmin) {
    this.confirmar(`¿Desea eliminar a ${admin.nombre}?`).subscribe((acepto) => {
      if (!acepto) {
        return;
      }
      this.srvAdmin.eliminar(admin.idUsuario).subscribe({
        next: (res) => this.resultado('eliminar', res.status),
        error: (err: HttpErrorResponse) => this.resultado('eliminar', err.status)
      });
    });
  }
}
