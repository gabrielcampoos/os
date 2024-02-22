import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { mostraModal } from '../../store/modules/ContextoModal/contextoSlice';
import { showNotification } from '../../store/modules/Notification/notificationSlice';
import { listarOs, listarTodasOs } from '../../store/modules/Os/osSlice';
import {
	logoutUsuario,
	obterUsuario,
} from '../../store/modules/Usuarios/usuariosSlice';
import Appbar from './components/Appbar';
import { Cards } from './components/Cards';
import { ModalMensagens } from './components/ModalMensagens';

export const Home = () => {
	const [nomeCliente, setNomeCliente] = useState('');
	const [equipamento, setEquipamento] = useState('');
	const [valor, setValor] = useState(0);
	const [username, setUsername] = useState('');
	const [idUserLogged, setIdUserLogged] = useState('');
	const [tokenUserLogged, setTokenUserLogged] = useState('');

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const selectOs = useAppSelector(listarTodasOs);
	const selectUser = useAppSelector((s) => s.usuario);

	useEffect(() => {
		setUsername(selectUser.usuario.username);
		setIdUserLogged(selectUser.usuario.id);
		setTokenUserLogged(selectUser.usuario.token);
	}, [
		selectUser.usuario.username,
		selectUser.usuario.id,
		selectUser.usuario.token,
		username,
		idUserLogged,
		tokenUserLogged,
	]);

	useEffect(() => {
		if (!localStorage.getItem('userLogged')) {
			dispatch(
				showNotification({
					success: false,
					message: 'You shall not pass!',
				}),
			);

			dispatch(logoutUsuario());
			localStorage.clear();
			navigate('/');
		}
		dispatch(obterUsuario());
	}, [dispatch, navigate]);

	useEffect(() => {
		dispatch(
			listarOs({
				nomeCliente: nomeCliente,
				equipamento: equipamento,
				valor: valor,
			}),
		);
	}, [dispatch, equipamento, nomeCliente, valor]);

	return (
		<>
			<Box
				sx={{
					width: '100%',
					height: '895px',
				}}
			>
				<Appbar />
				<Grid
					container
					spacing={{ xs: 2, sm: 2, md: 0 }}
					columns={{ xs: 12, sm: 12, md: 12 }}
					sx={{
						width: '100%',
						height: '100%',
					}}
				>
					<Grid
						item
						xs={2}
						sm={2}
						md={2}
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							background: '#e8e8e8',
						}}
					>
						<Typography
							component="h1"
							variant="h6"
							sx={{ fontWeight: 700, mt: 2 }}
						>
							Filtros
						</Typography>
						<TextField
							label="Nome Cliente"
							onChange={(ev) =>
								setNomeCliente(ev.currentTarget.value)
							}
							value={nomeCliente}
							sx={{
								mt: 1,
							}}
						/>

						<TextField
							label="Equipamento"
							onChange={(ev) =>
								setEquipamento(ev.currentTarget.value)
							}
							value={equipamento}
							sx={{
								mt: 1,
							}}
						/>

						<TextField
							label="Valor"
							onChange={(ev) =>
								setValor(Number(ev.currentTarget.value))
							}
							value={valor}
							sx={{
								mt: 1,
							}}
						/>
					</Grid>
					<Grid item xs={2} sm={2} md={10}>
						{nomeCliente !== '' || equipamento !== '' || valor !== 0
							? selectOs
									.filter(
										(os) =>
											os.nomeCliente === nomeCliente ||
											os.equipamento === equipamento ||
											os.valor === valor,
									)

									.map(
										({
											id,
											nomeCliente,
											equipamento,
											descricao,
											valor,
											criadoEm,
										}) => (
											<Cards
												key={id}
												id={id}
												nomeCliente={nomeCliente}
												equipamento={equipamento}
												descricao={descricao}
												valor={valor}
												criadoEm={criadoEm.toString()}
											/>
										),
									)
							: selectOs.map(
									({
										id,
										nomeCliente,
										equipamento,
										descricao,
										valor,
										criadoEm,
									}) => (
										<Cards
											key={id}
											id={id}
											nomeCliente={nomeCliente}
											equipamento={equipamento}
											descricao={descricao}
											valor={valor}
											criadoEm={criadoEm.toString()}
										/>
									),
							  )}
					</Grid>
				</Grid>
			</Box>
			<Box
				sx={{
					position: 'fixed',
					bottom: '24px',
					right: '24px',
					display: 'flex',
					flexDirection: 'column-reverse',
					gap: 2,
				}}
			>
				<Fab
					color="primary"
					aria-label="add"
					onClick={() => {
						dispatch(mostraModal('adicionar'));
					}}
				>
					<AddIcon />
				</Fab>
			</Box>
			<ModalMensagens />
		</>
	);
};
