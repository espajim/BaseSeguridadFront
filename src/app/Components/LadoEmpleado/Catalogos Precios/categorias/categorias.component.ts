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
import { categoriasModel } from '../../../../Models/categorias.model';
import { CategoriasService } from '../../../../Services/categorias.service';
import { AgregarCrudSimpleComponent } from '../../modalesEmpleado/agregar-crud-simple/agregar-crud-simple.component';
import { EditarCrudSimpleComponent } from '../../modalesEmpleado/editar-crud-simple/editar-crud-simple.component';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-categorias',
  standalone: false,
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['IdTipoCategoria', 'Nombre', 'Descripcion', 'FechaCreacion', 'FechaModificacion', 'Estatus', 'acciones'];
  dataSource = new MatTableDataSource<categoriasModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriasService: CategoriasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarCategorias(): void {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (data: categoriasModel[]) => {
        console.log('Datos recibidos:', data);
        this.dataSource.data = data;
        console.log('DataSource:', this.dataSource.data);
      },
      error: (error: any) => {
        console.error('Error al cargar categorías:', error);
        this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AgregarCrudSimpleComponent, {
      width: '500px',
      data: {
        titulo: 'Nueva Categoría',
        campos: [
          { nombre: 'Nombre', label: 'Nombre', tipo: 'text', validadores: [Validators.required] },
          { nombre: 'Descripcion', label: 'Descripción', tipo: 'text', validadores: [Validators.required] }
        ],
        servicio: this.categoriasService,
        metodoCrear: 'crearCategorias'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCategorias();
      }
    });
  }

  editarCategoria(categoria: categoriasModel): void {
    const dialogRef = this.dialog.open(EditarCrudSimpleComponent, {
      width: '500px',
      data: {
        titulo: 'Editar Categoría',
        campos: [
          { nombre: 'IdTipoCategoria', label: 'ID', valor: categoria.IdTipoCategoria, tipo: 'number', validadores: [Validators.required], readonly: true },
          { nombre: 'Nombre', label: 'Nombre', valor: categoria.Nombre, tipo: 'text', validadores: [Validators.required] },
          { nombre: 'Descripcion', label: 'Descripción', valor: categoria.Descripcion, tipo: 'text', validadores: [Validators.required] }
        ],
        servicio: this.categoriasService,
        metodoEditar: 'editarCategorias',
        id: categoria.IdTipoCategoria
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCategorias();
      }
    });
  }

  eliminarCategoria(id: number): void {
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
        this.categoriasService.eliminarCategorias(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'La categoría ha sido eliminada.',
              'success'
            );
            this.cargarCategorias();
          },
          error: (error: any) => {
            console.error('Error al eliminar categoría:', error);
            let mensajeError = 'No se pudo eliminar la categoría';
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
