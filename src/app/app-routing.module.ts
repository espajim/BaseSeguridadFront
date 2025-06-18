import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginClienteComponent } from './Components/LadoCliente/login-cliente/login-cliente.component';
import { MenuEmpleadoComponent } from './Components/LadoEmpleado/menu-empleado/menu-empleado.component';
import { RolesComponent } from './Components/LadoEmpleado/roles/roles.component';
import e from 'express';
import { EmpleadosComponent } from './Components/LadoEmpleado/empleados/empleados.component';
import { CategoriasComponent } from './Components/LadoEmpleado/Catalogos Precios/categorias/categorias.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginClienteComponent },
  { path: 'menu-empleado', component: MenuEmpleadoComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'usuarios', component: EmpleadosComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
