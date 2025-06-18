export interface ModuloPorRolResponse {
    idModulo: number;
    nombre: string;
    idPadre: number | null;
}

export interface ModuloPorRolRequest {
    idRol: number;
    idModulo: number;
    nombre: string;
    
} 