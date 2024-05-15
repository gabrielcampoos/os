import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '../..';
import servicoAPI from '../../../configs/services/api';
import { FiltrarOsDTO, OsDTO } from '../../types/OsState';
import { RespostaOs } from '../../types/RetornoRequest';
import { showNotification } from '../Notification/notificationSlice';

type CadastrarOsDTO = {
	id: string;
	nomeCliente: string;
	equipamento: string;
	descricao: string;
	valor: number;
	criadoPor: string;
};

interface AtualizarOsDTO {
	id: string;
	equipamento: string;
	descricao: string;
	valor: number;
}

export const criarOs = createAsyncThunk(
	'os/criar',
	async (dados: CadastrarOsDTO, { dispatch }) => {
		try {
			const headers = {
				'Content-Type': 'application/json',
				token: localStorage.getItem('userLogged'),
			};
			const resposta = await servicoAPI.post('/os', dados, {
				headers,
			});

			dispatch(
				showNotification({
					success: resposta.data.sucesso,
					message: resposta.data.mensagem,
				}),
			);

			return resposta.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const retorno: RespostaOs = {
					sucesso: error.response?.data.successo,
					mensagem: error.response?.data.mensagem,
				};

				dispatch(
					showNotification({
						message: error.response?.data.mensagem,
						success: false,
					}),
				);
				return retorno;
			}

			return {
				sucesso: false,
				mensagem: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

export const listarOs = createAsyncThunk(
	'os/listar',
	async (filtros: FiltrarOsDTO, { dispatch }) => {
		try {
			const headers = {
				'Content-Type': 'application/json',
				token: localStorage.getItem('userLogged'),
			};

			const resposta = await servicoAPI('/os', {
				headers,
				params: {
					nomeCliente: filtros.nomeCliente,
					equipamento: filtros.equipamento,
					valor: filtros.valor,
				},
			});
			dispatch(
				showNotification({
					message: resposta.data.mensagem,
					success: resposta.data.sucesso,
				}),
			);
			return resposta.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const retorno: RespostaOs = {
					sucesso: error.response?.data.sucesso,
					mensagem: error.response?.data.mensagem,
				};
				dispatch(
					showNotification({
						message: error.response?.data.mensagem,
						success: false,
					}),
				);
				return retorno;
			}
			return {
				sucesso: false,
				mensagem: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

export const editarOs = createAsyncThunk(
	'os/editar',
	async (dados: AtualizarOsDTO, { dispatch }) => {
		try {
			const headers = {
				'Content-Type': 'application/json',
				token: localStorage.getItem('userLogged'),
			};

			const retorno = await servicoAPI.put(`/os/${dados.id}`, dados, {
				headers,
			});

			dispatch(
				showNotification({
					success: retorno.data.sucesso,
					message: retorno.data.mensagem,
				}),
			);
			return retorno.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const retorno: RespostaOs = {
					sucesso: error.response?.data.sucesso,
					mensagem: error.response?.data.mensagem,
				};
				dispatch(
					showNotification({
						message: error.response?.data.mensagem,
						success: false,
					}),
				);
				return retorno;
			}
			return {
				sucesso: false,
				mensagem: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

export const excluirOs = createAsyncThunk(
	'os/excluir',
	async (id: string, { dispatch }) => {
		try {
			const headers = {
				'Content-Type': 'application/json',
				token: localStorage.getItem('userLogged'),
			};

			const retorno = await servicoAPI.delete(`/os/${id}`, {
				headers,
			});

			dispatch(
				showNotification({
					message: retorno.data.mensagem,
					success: retorno.data.sucesso,
				}),
			);
			return retorno.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const retorno: RespostaOs = {
					sucesso: error.response?.data.sucesso,
					mensagem: error.response?.data.mensagem,
				};
				dispatch(
					showNotification({
						message: error.response?.data.mensagem,
						success: false,
					}),
				);
				return retorno;
			}
			return {
				sucesso: false,
				mensagem: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

const osAdapter = createEntityAdapter<OsDTO>({
	selectId: (state) => state.id,
});

export const { selectAll: listarTodasOs } = osAdapter.getSelectors(
	(global: RootState) => global.os,
);

const osSlice = createSlice({
	name: 'os',
	initialState: osAdapter.getInitialState({
		loading: false,
		mensagem: '',
	}),
	reducers: {
		refresh(estadoAtual) {
			return { ...estadoAtual };
		},
	},

	extraReducers: (builder) => {
		builder.addCase(listarOs.pending, (estadoAtual) => {
			estadoAtual.loading = true;
			estadoAtual.mensagem = 'Carregando os.';
		});

		builder.addCase(listarOs.fulfilled, (estadoAtual, acao) => {
			const { mensagem, dados } = acao.payload;

			estadoAtual.loading = false;
			estadoAtual.mensagem = mensagem;

			if (!dados || dados.length === 0) {
				estadoAtual.mensagem = 'Nada encontrado.';
				return;
			}

			osAdapter.setAll(estadoAtual, dados);
		});

		builder.addCase(criarOs.pending, (estadoAtual) => {
			estadoAtual.loading = true;
			estadoAtual.mensagem = 'Carregando os.';
		});

		builder.addCase(criarOs.fulfilled, (estadoAtual, acao) => {
			const { mensagem, dados } = acao.payload;

			estadoAtual.loading = false;
			estadoAtual.mensagem = mensagem;

			if (!dados?.id) {
				console.log(acao.payload);
				return;
			}

			osAdapter.addOne(estadoAtual, dados);
		});

		builder.addCase(criarOs.rejected, (estadoAtual) => {
			estadoAtual.loading = false;
			estadoAtual.mensagem = 'Os não criada.';
		});

		builder.addCase(editarOs.pending, (estadoAtual) => {
			estadoAtual.loading = true;
			estadoAtual.mensagem = 'Atualizando os';
		});

		builder.addCase(editarOs.fulfilled, (estadoAtual, acao) => {
			const { mensagem, dados } = acao.payload;
			estadoAtual.loading = false;
			estadoAtual.mensagem = mensagem;

			if (!dados || !dados.id) {
				console.log(acao.payload);
				return;
			}

			osAdapter.updateOne(estadoAtual, {
				id: dados.id,
				changes: dados,
			});
		});

		builder.addCase(editarOs.rejected, (estadoAtual) => {
			estadoAtual.loading = false;
			estadoAtual.mensagem = 'Os não atualizada.';
		});

		builder.addCase(excluirOs.pending, (estadoAtual) => {
			estadoAtual.loading = true;
			estadoAtual.mensagem = 'Apagando os.';
		});

		builder.addCase(excluirOs.fulfilled, (estadoAtual, acao) => {
			const { mensagem, sucesso, dados } = acao.payload;
			estadoAtual.loading = false;
			estadoAtual.mensagem = mensagem;

			if (sucesso) {
				osAdapter.removeOne(estadoAtual, dados);
			}
		});

		builder.addCase(excluirOs.rejected, (estadoAtual) => {
			estadoAtual.loading = false;
			estadoAtual.mensagem = 'Os não excluida';
		});
	},
});

export default osSlice.reducer;
export const { refresh } = osSlice.actions;
