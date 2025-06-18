import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { LoginResponse, Modulo } from '../../../Models/auth.models';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-cliente',
  standalone: false,
  templateUrl: './login-cliente.component.html',
  styleUrl: './login-cliente.component.css'
})
export class LoginClienteComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  private construirMenu(permisos: Modulo[]): Modulo[] {
    // Menus principales
    const menusPrincipales = permisos.filter(modulo => modulo.idPadre === null);
    const submenus = permisos.filter(modulo => modulo.idPadre !== null);
    
    // Estructura menu
    const menuEstructurado = menusPrincipales.map(menu => {
      const submenusDelMenu = submenus.filter(submenu => submenu.idPadre === menu.idModulo);
      return {
        ...menu,
        submenus: submenusDelMenu
      };
    });
    
    return menuEstructurado;
  }

  private guardarDatosSesion(response: LoginResponse) {
    localStorage.setItem(environment.tokenKey, response.token);
    localStorage.setItem(environment.userKey, JSON.stringify({
      id: response.idUsuario,
      nombreCompleto: response.nombreCompleto,
      correo: response.correo,
      idRol: response.idRol,
      idTipoUsuario: response.idTipoUsuario
    }));

    if (response.permisos) {
      const menuEstructurado = this.construirMenu(response.permisos);
      localStorage.setItem('menu', JSON.stringify(menuEstructurado));
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      Swal.fire({
        title: 'Iniciando sesión...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.authService.login(this.loginForm.value).subscribe({
        next: (response: LoginResponse) => {
          this.guardarDatosSesion(response);
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/menu-empleado']);
          });
        },
        error: (error) => {
          let mensaje = '';
          if (error.status === 0) {
            mensaje = 'No se pudo conectar al servidor. Por favor, verifica que el servidor esté en ejecución.';
          } else if (error.status === 401) {
            mensaje = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
          } else {
            mensaje = `Error al iniciar sesión: ${error.message || 'Error desconocido'}`;
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#3085d6'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  loginWithGoogle() {
    Swal.fire({
      icon: 'info',
      title: 'Próximamente',
      text: 'La funcionalidad de inicio de sesión con Google estará disponible pronto',
      confirmButtonColor: '#3085d6'
    });
  }
}
