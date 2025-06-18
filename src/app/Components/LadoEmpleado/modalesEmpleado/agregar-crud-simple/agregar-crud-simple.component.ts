import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-crud-simple',
  standalone: false,
  
  templateUrl: './agregar-crud-simple.component.html',
  styleUrl: './agregar-crud-simple.component.css'
})
export class AgregarCrudSimpleComponent implements OnInit {
  form!: FormGroup;
  titulo: string = 'Agregar';
  campos: any[] = [];
  servicio: any;
  metodoCrear: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarCrudSimpleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.campos = data.campos || [];
    this.titulo = data.titulo || 'Agregar';
    this.servicio = data.servicio;
    this.metodoCrear = data.metodoCrear || 'crear';
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
      this.servicio[this.metodoCrear](datos).subscribe({
        next: () => {
          this.snackBar.open('Registro creado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error al crear el registro:', error);
          let mensajeError = 'Error al crear el registro';
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
