import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../Models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            console.error('Error de conexión - No se pudo conectar al servidor');
          }
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(environment.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(environment.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
} 