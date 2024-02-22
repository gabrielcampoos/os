import { OsDTO } from './OsState';
import { UsuarioState } from './UsuarioState';

export type RespostaCadastro = {
	sucesso: boolean;
	mensagem: string;
	dadoCadastrado?: UsuarioState & { id: string };
};

export type RespostaLogin = {
	sucesso: boolean;
	mensagem: string;
	dados?: {
		id: string;
		nome: string;
		username: string;
		token: string;
	};
};

export type RespostaOs = {
	sucesso: boolean;
	mensagem: string;
	dadoCadastrado?: OsDTO[];
};
