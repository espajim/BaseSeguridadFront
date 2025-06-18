import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol } from '../Models/rol.model';
import { isPlatformBrowser } from '@angular/common';
import { ModuloPorRolResponse, ModuloPorRolRequest } from '../Models/modulo-por-rol.model';
import { EmpleadoRequest } from '../Models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  private apiUrl = `${environment.apiUrl}/seguridad`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem(environment.tokenKey);
      token = storedToken ? storedToken : '';
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }

  crearRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/roles`, rol, { headers: this.getHeaders() });
  }

  editarRol(rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/roles`, rol, { headers: this.getHeaders() });
  }

  eliminarRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`, { headers: this.getHeaders() });
  }

  getModulos(): Observable<ModuloPorRolResponse[]> {
    return this.http.get<ModuloPorRolResponse[]>(`${this.apiUrl}/modulos`, { headers: this.getHeaders() });
  }

  getModulosPorRol(idRol: number): Observable<ModuloPorRolResponse[]> {
    return this.http.get<ModuloPorRolResponse[]>(`${this.apiUrl}/modulos-por-rol/${idRol}`, { headers: this.getHeaders() });
  }

  asignarOpcionesRol(opciones: ModuloPorRolRequest[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/asignar-opciones`, opciones, { headers: this.getHeaders() });
  }

  obtenerEmpleados() {
    return this.http.get<EmpleadoRequest[]>(`${this.apiUrl}/empleados`, { headers: this.getHeaders() });
  }

  crearEmpleado(empleado: EmpleadoRequest) {
    return this.http.post<EmpleadoRequest>(`${this.apiUrl}/empleados`, empleado, { headers: this.getHeaders() });
  }

  editarEmpleado(empleado: EmpleadoRequest) {
    return this.http.put<EmpleadoRequest>(`${this.apiUrl}/empleados`, empleado, { headers: this.getHeaders() });
  }

  eliminarEmpleado(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/empleados/${id}`, { headers: this.getHeaders() });
  }

}
