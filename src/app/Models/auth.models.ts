export interface LoginRequest {
  Correo: string;
  Password: string;
}

export interface Modulo {
  idModulo: number;
  nombre: string;
  url: string;
  icono: string;
  idPadre: number | null;
  submenus?: Modulo[];
}

export interface LoginResponse {
  token: string;           
  idUsuario: number;      
  nombreCompleto: string;  
  correo: string;         
  idRol: number;          
  idTipoUsuario: number;  
  permisos: Modulo[];     
} 