import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EmpleadoRequest } from '../../../Models/empleado.model';
import { SeguridadService } from '../../../Services/seguridad.service';
import { AgregarCrudSimpleComponent } from '../modalesEmpleado/agregar-crud-simple/agregar-crud-simple.component';
import { EditarCrudSimpleComponent } from '../modalesEmpleado/editar-crud-simple/editar-crud-simple.component';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empleados',
  standalone: false,
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idUsuario', 'nombreCompleto', 'correo', 'rol', 'fechaCreacion', 'fechaModificacion', 'deleted', 'acciones'];
  dataSource = new MatTableDataSource<EmpleadoRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private seguridadService: SeguridadService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarEmpleados(): void {
    this.seguridadService.obtenerEmpleados().subscribe({
      next: (data: EmpleadoRequest[]) => {
        console.log('Datos recibidos:', data);
        this.dataSource.data = data;
        console.log('DataSource:', this.dataSource.data);
      },
      error: (error: any) => {
        console.error('Error al cargar empleados:', error);
        this.snackBar.open('Error al cargar empleados', 'Cerrar', { duration: 3000 });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    this.seguridadService.getRoles().subscribe(roles => {
      const opcionesRol = roles.map(r => ({ value: r.idRol, label: r.nombre }));
      const dialogRef = this.dialog.open(AgregarCrudSimpleComponent, {
        width: '500px',
        data: {
          titulo: 'Nuevo Empleado',
          campos: [
            { nombre: 'nombre', label: 'Nombre Completo', tipo: 'text', validadores: [Validators.required] },
            { nombre: 'correo', label: 'Correo', tipo: 'email', validadores: [Validators.required, Validators.email] },
            { nombre: 'idRol', label: 'Rol', tipo: 'select', opciones: opcionesRol, validadores: [Validators.required] }
          ],
          servicio: this.seguridadService,
          metodoCrear: 'crearEmpleado'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cargarEmpleados();
        }
      });
    });
  }

  editarEmpleado(empleado: EmpleadoRequest): void {
    this.seguridadService.getRoles().subscribe(roles => {
      const opcionesRol = roles.map(r => ({ value: r.idRol, label: r.nombre }));
      const dialogRef = this.dialog.open(EditarCrudSimpleComponent, {
        width: '500px',
        data: {
          titulo: 'Editar Empleado',
          campos: [
            { nombre: 'idUsuario', label: 'ID', valor: empleado.idUsuario, tipo: 'number', validadores: [Validators.required], readonly: true },
            { nombre: 'nombreCompleto', label: 'Nombre Completo', valor: empleado.nombreCompleto, tipo: 'text', validadores: [Validators.required] },
            { nombre: 'correo', label: 'Correo', valor: empleado.correo, tipo: 'email', validadores: [Validators.required, Validators.email] },
            { nombre: 'idRol', label: 'Rol', valor: empleado.idRol, tipo: 'select', opciones: opcionesRol, validadores: [Validators.required] }
          ],
          servicio: this.seguridadService,
          metodoEditar: 'editarEmpleado',
          id: empleado.idUsuario
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cargarEmpleados();
        }
      });
    });
  }

  eliminarEmpleado(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.seguridadService.eliminarEmpleado(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'El empleado ha sido eliminado.',
              'success'
            );
            this.cargarEmpleados();
          },
          error: (error: any) => {
            console.error('Error al eliminar empleado:', error);
            let mensajeError = 'No se pudo eliminar el empleado';
            if (error.error && typeof error.error === 'string') {
              mensajeError = error.error;
            }
            Swal.fire(
              'Error',
              mensajeError,
              'error'
            );
          }
        });
      }
    });
  }
}
