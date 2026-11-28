import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [MatDialogModule, MatButtonModule],
  selector: 'app-dialogo-general',
  templateUrl: './dialogo-general.html',
})
export class DialogoGeneral {
  readonly data = inject<any>(MAT_DIALOG_DATA);
}
