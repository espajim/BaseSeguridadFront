import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { categoriasModel } from '../Models/categorias.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(    private http: HttpClient,
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

  obtenerCategorias() {
    return this.http.get<categoriasModel[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  crearCategorias(categoria: categoriasModel) {
    return this.http.post<categoriasModel>(`${this.apiUrl}`, categoria, { headers: this.getHeaders() });
  }

  editarCategorias(categoria: categoriasModel) {
    return this.http.put<categoriasModel>(`${this.apiUrl}`, categoria, { headers: this.getHeaders() });
  }

  eliminarCategorias(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
