import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SeguridadService } from '../../../Services/seguridad.service';
import { Rol } from '../../../Models/rol.model';
import { MenuEmpleadoComponent } from '../menu-empleado/menu-empleado.component';
import { AgregarCrudSimpleComponent } from '../modalesEmpleado/agregar-crud-simple/agregar-crud-simple.component';
import { EditarCrudSimpleComponent } from '../modalesEmpleado/editar-crud-simple/editar-crud-simple.component';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { OpcionesRolComponent } from './opciones-rol/opciones-rol.component';

@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idRol', 'nombre', 'fechaCreacion', 'fechaModificacion', 'deleted', 'acciones'];
  dataSource: Rol[] = [];
  filteredData: Rol[] = [];
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private seguridadService: SeguridadService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  ngAfterViewInit() {
    // Configurar el paginador después de que la vista se haya inicializado
    if (this.paginator) {
      this.paginator.pageSize = 10; // Tamaño de página por defecto
      this.paginator.pageSizeOptions = [5, 10, 25, 50]; // Opciones de tamaño de página
    }
  }

  cargarRoles(): void {
    this.seguridadService.getRoles().subscribe({
      next: (roles) => {
        this.dataSource = roles;
        this.filteredData = roles;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = filterValue;
    
    this.filteredData = this.dataSource.filter(rol => {
      return rol.nombre.toLowerCase().includes(filterValue) ||
             rol.idRol.toString().includes(filterValue) ||
             (rol.deleted === 0 ? 'activo' : 'inactivo').includes(filterValue);
    });

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AgregarCrudSimpleComponent, {
      data: {
        titulo: 'Nuevo Rol',
        campos: [
          {
            nombre: 'nombre',
            label: 'Nombre del Rol',
            tipo: 'text',
            validadores: [Validators.required]
          }
        ],
        servicio: this.seguridadService,
        metodoCrear: 'crearRol'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRoles();
      }
    });
  }

  editarRol(rol: Rol): void {
    const dialogRef = this.dialog.open(EditarCrudSimpleComponent, {
      data: {
        titulo: 'Editar Rol',
        id: rol.idRol,
        campos: [
          {
            nombre: 'idRol',
            label: 'ID',
            valor: rol.idRol,
            tipo: 'number',
            validadores: [Validators.required],
            readonly: true
          },
          {
            nombre: 'nombre',
            label: 'Nombre del Rol',
            valor: rol.nombre,
            tipo: 'text',
            validadores: [Validators.required]
          }
        ],
        servicio: this.seguridadService,
        metodoEditar: 'editarRol'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRoles();
      }
    });
  }

  eliminarRol(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.seguridadService.eliminarRol(id).subscribe({
          next: () => {
            this.cargarRoles();
            Swal.fire(
              '¡Eliminado!',
              'El rol ha sido eliminado exitosamente.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el rol.',
              'error'
            );
            console.error('Error al eliminar rol:', error);
          }
        });
      }
    });
  }

  asignarModulos(rol: Rol): void {
    const dialogRef = this.dialog.open(OpcionesRolComponent, {
      width: '600px',
      data: { idRol: rol.idRol }
    });

    
  }
}
