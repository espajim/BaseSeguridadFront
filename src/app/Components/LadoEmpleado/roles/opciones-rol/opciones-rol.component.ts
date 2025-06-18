import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeguridadService } from '../../../../Services/seguridad.service';
import { Modulo } from '../../../../Models/auth.models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModuloPorRolResponse, ModuloPorRolRequest } from '../../../../Models/modulo-por-rol.model';

@Component({
  selector: 'app-opciones-rol',
  standalone: false,
  
  templateUrl: './opciones-rol.component.html',
  styleUrl: './opciones-rol.component.css'
})
export class OpcionesRolComponent implements OnInit {
  modulos: Modulo[] = [];
  modulosSeleccionados: number[] = [];
  idRol: number = 0;

  constructor(
    private seguridadService: SeguridadService,
    private dialogRef: MatDialogRef<OpcionesRolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idRol: number }
  ) {
    this.idRol = data.idRol;
    console.log('ID del rol recibido:', this.idRol);
  }

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    console.log('Iniciando carga de módulos...');
    this.seguridadService.getModulos().subscribe({
      next: (modulos) => {
        console.log('Módulos recibidos:', modulos);
        this.modulos = this.organizarModulosEnArbol(modulos);
        if (this.idRol) {
          this.cargarModulosPorRol();
        }
      },
      error: (error) => {
        console.error('Error al cargar módulos:', error);
        let mensajeError = 'Error al cargar módulos';
        if (error.error && typeof error.error === 'string') {
          mensajeError = error.error;
        }
        console.error('Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          headers: error.headers,
          url: error.url
        });
      }
    });
  }

  cargarModulosPorRol(): void {
    this.seguridadService.getModulosPorRol(this.idRol).subscribe({
      next: (modulosRol: ModuloPorRolResponse[]) => {
        console.log('Módulos del rol recibidos:', modulosRol);
        this.modulosSeleccionados = modulosRol.map(m => m.idModulo);
      },
      error: (error) => {
        console.error('Error al cargar módulos del rol:', error);
        let mensajeError = 'Error al cargar módulos del rol';
        if (error.error && typeof error.error === 'string') {
          mensajeError = error.error;
        }
        console.error('Detalles del error:', error);
      }
    });
  }

  organizarModulosEnArbol(modulos: ModuloPorRolResponse[]): Modulo[] {
    const modulosMap = new Map<number, Modulo>();
    const modulosRaiz: Modulo[] = [];

    // Primero, mapeamos todos los módulos
    modulos.forEach(modulo => {
      modulosMap.set(modulo.idModulo, { 
        idModulo: modulo.idModulo,
        nombre: modulo.nombre,
        url: '',
        icono: '',
        idPadre: modulo.idPadre,
        submenus: []
      });
    });

    // Luego, organizamos la jerarquía
    modulos.forEach(modulo => {
      const moduloConSubmenus = modulosMap.get(modulo.idModulo)!;
      if (modulo.idPadre === null) {
        modulosRaiz.push(moduloConSubmenus);
      } else {
        const moduloPadre = modulosMap.get(modulo.idPadre);
        if (moduloPadre) {
          if (!moduloPadre.submenus) {
            moduloPadre.submenus = [];
          }
          moduloPadre.submenus.push(moduloConSubmenus);
        }
      }
    });

    return modulosRaiz;
  }

  onCheckboxChange(event: MatCheckboxChange, modulo: Modulo): void {
    if (event.checked) {
      this.modulosSeleccionados.push(modulo.idModulo);
    } else {
      const index = this.modulosSeleccionados.indexOf(modulo.idModulo);
      if (index > -1) {
        this.modulosSeleccionados.splice(index, 1);
      }
    }
  }

  estaSeleccionado(idModulo: number): boolean {
    return this.modulosSeleccionados.includes(idModulo);
  }

  guardarCambios(): void {
    if (!this.idRol) {
      console.error('No hay ID de rol seleccionado');
      return;
    }

    const opciones: ModuloPorRolRequest[] = this.modulosSeleccionados.map(idModulo => {
      const modulo = this.modulos.find(m => m.idModulo === idModulo) || 
                    this.modulos.flatMap(m => m.submenus || []).find(m => m.idModulo === idModulo);
      return {
        idRol: this.idRol,
        idModulo: idModulo,
        nombre: modulo?.nombre || ''
      };
    });

    console.log('Enviando opciones:', opciones);

    this.seguridadService.asignarOpcionesRol(opciones).subscribe({
      next: () => {
        this.dialogRef.close(this.modulosSeleccionados);
      },
      error: (error) => {
        console.error('Error al guardar las opciones:', error);
        let mensajeError = 'Error al guardar las opciones';
        if (error.error && typeof error.error === 'string') {
          mensajeError = error.error;
        }
        console.error('Detalles del error:', error);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
