import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// Material Design
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginClienteComponent } from './Components/LadoCliente/login-cliente/login-cliente.component';
import { RegistroClienteComponent } from './Components/LadoCliente/registro-cliente/registro-cliente.component';
import { MenuEmpleadoComponent } from './Components/LadoEmpleado/menu-empleado/menu-empleado.component';
import { RolesComponent } from './Components/LadoEmpleado/roles/roles.component';
import { EditarCrudSimpleComponent } from './Components/LadoEmpleado/modalesEmpleado/editar-crud-simple/editar-crud-simple.component';
import { AgregarCrudSimpleComponent } from './Components/LadoEmpleado/modalesEmpleado/agregar-crud-simple/agregar-crud-simple.component';
import { OpcionesRolComponent } from './Components/LadoEmpleado/roles/opciones-rol/opciones-rol.component';
import { EmpleadosComponent } from './Components/LadoEmpleado/empleados/empleados.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CategoriasComponent } from './Components/LadoEmpleado/Catalogos Precios/categorias/categorias.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginClienteComponent,
    RegistroClienteComponent,
    MenuEmpleadoComponent,
    RolesComponent,
    EditarCrudSimpleComponent,
    AgregarCrudSimpleComponent,
    OpcionesRolComponent,
    EmpleadosComponent,
    CategoriasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SweetAlert2Module,
    // Material Design
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
