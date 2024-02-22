export interface OsDTO {
	id: string;
	nomeCliente: string;
	equipamento: string;
	descricao: string;
	valor: number;
	criadoEm: Date;
}

export interface FiltrarOsDTO {
	nomeCliente?: string;
	equipamento?: string;
	valor?: number;
}
