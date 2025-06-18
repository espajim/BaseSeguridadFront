import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-crud-simple',
  standalone: false,
  
  templateUrl: './editar-crud-simple.component.html',
  styleUrl: './editar-crud-simple.component.css'
})
export class EditarCrudSimpleComponent implements OnInit {
  form!: FormGroup;
  titulo: string = 'Editar';
  campos: any[] = [];
  servicio: any;
  id: number = 0;
  metodoEditar: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarCrudSimpleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.campos = data.campos || [];
    this.titulo = data.titulo || 'Editar';
    this.servicio = data.servicio;
    this.id = data.id;
    this.metodoEditar = data.metodoEditar || 'editar';
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    const group: any = {};
    this.campos.forEach(campo => {
      group[campo.nombre] = [campo.valor || '', campo.validadores || []];
    });
    this.form = this.fb.group(group);
  }

  guardar(): void {
    if (this.form.valid) {
      const datos = this.form.value;
      this.servicio[this.metodoEditar](datos).subscribe({
        next: () => {
          this.snackBar.open('Registro actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error al actualizar el registro:', error);
          let mensajeError = 'Error al actualizar el registro';
          if (error.error && typeof error.error === 'string') {
            mensajeError = error.error;
          }
          this.snackBar.open(mensajeError, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
