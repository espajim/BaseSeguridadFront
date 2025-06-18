import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Modulo } from '../../../Models/auth.models';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-menu-empleado',
  standalone: false,
  
  templateUrl: './menu-empleado.component.html',
  styleUrl: './menu-empleado.component.css'
})
export class MenuEmpleadoComponent implements OnInit {
  menuItems: Modulo[] = [];
  userData: any;
  isMenuOpen: boolean = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Verificar si el usuario está autenticado y es tipo 1
      const userDataStr = localStorage.getItem(environment.userKey);
      
      if (!userDataStr) {
        this.router.navigate(['/login']);
        return;
      }

      this.userData = JSON.parse(userDataStr);
   
      if (this.userData.idTipoUsuario !== 1) {
        this.router.navigate(['/login']);
        return;
      }

      // Cargar el menú desde localStorage
      const menuStr = localStorage.getItem('menu');
      
      if (menuStr) {
        const todosLosModulos = JSON.parse(menuStr);
        // Filtrar solo los módulos principales (idPadre es null)
        this.menuItems = todosLosModulos.filter((modulo: Modulo) => modulo.idPadre === null);
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(url: string | null) {
    if (url) {
      this.router.navigate([url]);
    }
  }

  getSubmenus(idModulo: number): Modulo[] {
    const menuItem = this.menuItems.find(item => item.idModulo === idModulo);
    return menuItem?.submenus || [];
  }

  isSubmenu(item: Modulo): boolean {
    return item.idPadre !== null;
  }

  isMenuPrincipal(item: Modulo): boolean {
    return !this.hasSubmenus(item) && item.url !== '';
  }

  hasSubmenus(item: Modulo): boolean {
    return Array.isArray(item.submenus) && item.submenus.length > 0;
  }

  cerrarSesion() {
    // Limpiar todos los datos del localStorage usando las claves del environment
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
    localStorage.removeItem('menu');
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
