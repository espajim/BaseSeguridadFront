export interface categoriasModel {
    IdTipoCategoria: number;
    Nombre: string;
    Descripcion: string;
    IdUsuarioCreacion?: number;
    FechaCreacion: Date;
    IdUsuarioModificacion?: number;
    FechaModificacion?: Date;
    Estatus: string;
} 