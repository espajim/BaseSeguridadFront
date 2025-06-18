export interface EmpleadoRequest {
    idUsuario: number;
    nombreCompleto: string;
    correo: string;
    usuarioCreacion?: number;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    usuarioModificacion?: number;
    deleted: number;
    cambioContrasenia: number;
    idRol: number;
    rol: string;
    idTipoUsuario: number;
} 