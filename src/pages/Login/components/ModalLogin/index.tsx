import { Close } from '@mui/icons-material';
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { cadastrarUsuario } from '../../../../store/modules/Usuarios/usuariosSlice';
import { IsValidCredentials } from '../../../../store/types/IsValidCredentials';
import { nomeRegex } from '../../../../store/types/RegexData';
import { Usuario } from '../../../../store/types/Usuario';

export interface ModalSignUpUserProps {
	aberto: boolean;
	mudarAberto: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalSignUpUser = ({
	aberto,
	mudarAberto,
}: ModalSignUpUserProps) => {
	const [nome, setNome] = useState('');
	const [username, setUsername] = useState('');
	const [senha, setSenha] = useState('');

	const estadoUsuario = useAppSelector((estado) => estado.usuario);
	const dispatch = useAppDispatch();

	const [errorNome, setErrorNome] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const [errorUsername, setErrorUsername] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const [errorSenha, setErrorSenha] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const handleClose = () => {
		mudarAberto(false);
	};

	const usuario: Usuario = {
		nome,
		username,
		senha,
	};

	const handleSignupUser = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		if (!ev.currentTarget.checkValidity()) {
			return;
		}

		dispatch(cadastrarUsuario(usuario));
		setTimeout(() => {
			setUsername('');
			setSenha('');
			setNome('');

			handleClose();
		}, 3000);
	};

	useEffect(() => {
		if (!nome.length && !nomeRegex.test(nome)) {
			setErrorNome({
				helperText: 'Informe um nome.',
				isValid: false,
			});
		} else {
			setErrorNome({
				helperText: 'Utilize seu nome para criar uma conta.',
				isValid: true,
			});
		}
	}, [nome]);

	useEffect(() => {
		if (username.length && username.length < 3) {
			setErrorUsername({
				helperText: 'Informe um username válido.',
				isValid: false,
			});
		} else {
			setErrorUsername({
				helperText: 'Utilize um username para criar uma conta.',
				isValid: true,
			});
		}
	}, [username]);

	useEffect(() => {
		if (senha.length && senha.length < 6) {
			setErrorSenha({
				helperText: 'Cadastre uma senha com no mínimo 6 caracteres.',
				isValid: false,
			});
		} else {
			setErrorSenha({
				helperText:
					'Utilize uma senha fácil de lembrar e anote para não esquecer.',
				isValid: true,
			});
		}
	}, [senha]);

	return (
		<Dialog
			open={aberto}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<IconButton
				aria-label="close"
				onClick={handleClose}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<Close />
			</IconButton>
			<DialogTitle id="alert-dialog-title">
				{'Criar uma conta'}
			</DialogTitle>
			<Divider />
			<Box component="form" onSubmit={handleSignupUser}>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<TextField
							label="Nome"
							type="text"
							error={!errorNome.isValid}
							helperText={errorNome.helperText}
							fullWidth
							sx={{ marginY: 3 }}
							onChange={(event) => {
								setNome(event.currentTarget.value);
							}}
							required
							value={nome}
						/>
						<TextField
							label="Username"
							type="text"
							error={!errorUsername.isValid}
							helperText={errorUsername.helperText}
							fullWidth
							sx={{ marginY: 3 }}
							onChange={(event) => {
								setUsername(event.currentTarget.value);
							}}
							required
							value={username}
						/>
						<TextField
							label="Senha"
							error={!errorSenha.isValid}
							helperText={errorSenha.helperText}
							type="password"
							fullWidth
							sx={{ marginY: 3 }}
							onChange={(event) => {
								setSenha(event.currentTarget.value);
							}}
							required
							inputProps={{ minLength: 6 }}
							value={senha}
						/>
					</DialogContentText>
				</DialogContent>
				<Divider />
				<DialogActions
					sx={{
						paddingY: 3,
					}}
				>
					<Button
						type="button"
						variant="outlined"
						onClick={handleClose}
					>
						Cancelar
					</Button>
					<Button
						disabled={!errorUsername.isValid || !errorSenha.isValid}
						type="submit"
						variant="contained"
						autoFocus
						startIcon={
							estadoUsuario.loading ? (
								<CircularProgress color="inherit" />
							) : (
								<></>
							)
						}
					>
						Cadastrar
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};
