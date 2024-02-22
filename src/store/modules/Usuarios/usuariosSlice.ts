import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import servicoAPI from '../../../configs/services/api';
import { RespostaCadastro, RespostaLogin } from '../../types/RetornoRequest';
import { Usuario } from '../../types/Usuario';
import { showNotification } from '../Notification/notificationSlice';

export type UsuarioLogado = {
	id: string;
	nome: string;
	isLogged: boolean;
};

const initialState = {
	usuario: {
		id: '',
		nome: '',
		username: '',
		token: '',
		isLogged: false,
	},
	loading: false,
};

export const cadastrarUsuario = createAsyncThunk(
	'usuarios/cadastro',
	async (novoUsuario: Usuario, { dispatch }) => {
		try {
			const resposta = await servicoAPI.post('/usuarios', novoUsuario);

			const respostaAPI = resposta.data as RespostaCadastro;

			dispatch(
				showNotification({
					message: respostaAPI.mensagem,
					success: respostaAPI.sucesso,
				}),
			);

			return respostaAPI;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as RespostaCadastro;

				dispatch(
					showNotification({
						message: response.mensagem,
						success: response.sucesso,
					}),
				);

				return response;
			}

			return {
				sucesso: false,
				mensagem: 'Erro inesperado.',
			};
		}
	},
);

export const loginUsuario = createAsyncThunk(
	'usuarios/login',
	async (login: Omit<Usuario, 'nome'>, { dispatch }) => {
		try {
			const resposta = await servicoAPI.post('/login', login);

			const respostaAPI = resposta.data as RespostaLogin;

			dispatch(
				showNotification({
					success: respostaAPI.sucesso,
					message: respostaAPI.mensagem,
				}),
			);
			return respostaAPI;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as RespostaLogin;

				dispatch(
					showNotification({
						message: response.mensagem,
						success: response.sucesso,
					}),
				);

				return response;
			}

			return {
				sucesso: false,
				mensagem: 'Erro inesperado.',
			};
		}
	},
);

export const obterUsuario = createAsyncThunk(
	'usuarios/obterUsuario',
	async (_, { dispatch }) => {
		try {
			const headers = {
				'Content-Type': 'application/json',
				token: localStorage.getItem('userLogged'),
			};
			const resposta = await servicoAPI.get('/validarDadosUsuarios', {
				headers,
			});

			const respostaAPI = resposta.data as RespostaLogin;
			console.log(respostaAPI);

			dispatch(
				showNotification({
					message: respostaAPI.mensagem,
					success: respostaAPI.sucesso,
				}),
			);

			return respostaAPI;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as RespostaLogin;

				dispatch(
					showNotification({
						message: response.mensagem,
						success: response.sucesso,
					}),
				);

				return response;
			}

			return {
				success: false,
				message: 'Erro inesperado.',
			};
		}
	},
);

export const usuarioSlice = createSlice({
	name: 'usuario',
	initialState: initialState,
	reducers: {
		setUsuario: (estadoAtual, action) => {
			return {
				...estadoAtual,
				usuario: {
					id: action.payload.id,
					nome: action.payload.nome,
					username: action.payload.username,
					token: action.payload.token,
					isLogged: true,
				},
			};
		},

		logoutUsuario: () => {
			return initialState;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(cadastrarUsuario.pending, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: true,
			};
		});

		builder.addCase(cadastrarUsuario.fulfilled, (estadoAtual, action) => {
			const payload = action.payload as RespostaCadastro;

			if (payload.sucesso && payload.dadoCadastrado) {
				return {
					usuario: {
						id: payload.dadoCadastrado?.id,
						nome: payload.dadoCadastrado.nome,
						username: payload.dadoCadastrado.username,
						token: payload.dadoCadastrado.token,
						isLogged: false,
					},
					loading: false,
				};
			}

			if (!payload.sucesso) {
				return {
					...estadoAtual,
					loading: false,
				};
			}
		});

		builder.addCase(cadastrarUsuario.rejected, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: false,
			};
		});

		//LOGIN
		builder.addCase(loginUsuario.pending, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: true,
			};
		});

		builder.addCase(loginUsuario.fulfilled, (estadoAtual, action) => {
			const payload = action.payload as RespostaLogin;

			if (payload.sucesso && payload.dados) {
				localStorage.setItem('userLogged', payload.dados.token);

				return {
					usuario: {
						id: payload.dados.id,
						nome: payload.dados.nome,
						username: payload.dados.username,
						token: payload.dados.token,
						isLogged: true,
					},
					loading: false,
				};
			}

			if (!payload.sucesso) {
				return initialState;
			}
		});

		builder.addCase(loginUsuario.rejected, () => {
			return initialState;
		});

		builder.addCase(obterUsuario.pending, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: true,
			};
		});

		builder.addCase(obterUsuario.fulfilled, (estadoAtual, action) => {
			const payload = action.payload as RespostaLogin;

			if (payload.sucesso && payload.dados) {
				return {
					usuario: {
						id: payload.dados.id,
						nome: payload.dados.nome,
						username: payload.dados.username,
						token: payload.dados.token,
						isLogged: true,
					},
					loading: false,
				};
			}

			if (!payload.sucesso) {
				return initialState;
			}
		});

		builder.addCase(obterUsuario.rejected, () => {
			return initialState;
		});
	},
});

export const { setUsuario, logoutUsuario } = usuarioSlice.actions;

export default usuarioSlice.reducer;
