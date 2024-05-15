import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { escondeModal } from '../../../../store/modules/ContextoModal/contextoSlice';
import { apagaId } from '../../../../store/modules/ModalId/idSlice';
import {
	criarOs,
	editarOs,
	excluirOs,
	refresh,
} from '../../../../store/modules/Os/osSlice';

export const ModalMensagens: React.FC = () => {
	const [nomeCliente, setNomeCliente] = useState('');
	const [equipamento, setEquipamento] = useState('');
	const [descricao, setDescricao] = useState('');
	const [valor, setValor] = useState(0);

	const dispatch = useAppDispatch();
	const { contexto, isOpen } = useAppSelector((state) => state.contexto);

	const usuarioLogado = useAppSelector((usuario) => usuario.usuario);
	const osSelecionada = useAppSelector((state) => state.idOs);

	useEffect(() => {
		if (isOpen) {
			if (
				contexto === 'editar' &&
				osSelecionada.equipamento &&
				osSelecionada.descricao &&
				osSelecionada.valor
			) {
				setEquipamento(osSelecionada.equipamento);
				setDescricao(osSelecionada.descricao);
				setValor(osSelecionada.valor);
			}
		}
	}, [osSelecionada, contexto, isOpen]);

	const fechaModal = () => {
		dispatch(escondeModal());
	};

	const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		switch (contexto) {
			case 'adicionar':
				dispatch(
					criarOs({
						id: '',
						nomeCliente: nomeCliente,
						equipamento: equipamento,
						descricao: descricao,
						valor: valor,
						criadoPor: usuarioLogado.usuario.username,
					}),
				);
				setNomeCliente('');
				setEquipamento('');
				setDescricao('');
				setValor(0);
				fechaModal();
				break;
			case 'editar':
				//lógica para editar
				if (osSelecionada.id) {
					dispatch(
						editarOs({
							id: osSelecionada.id,
							equipamento: equipamento,
							descricao: descricao,
							valor: valor,
						}),
					);
				}
				setEquipamento('');
				setDescricao('');
				setValor(0);

				dispatch(apagaId());
				fechaModal();

				break;
			case 'excluir':
				//lógica de exclusão
				if (osSelecionada.id) {
					dispatch(excluirOs(osSelecionada.id));
				}
				dispatch(apagaId());
				fechaModal();
				dispatch(refresh);
				break;
		}
	};

	return (
		<Dialog open={isOpen}>
			<Box component={'form'} onSubmit={handleSubmit}>
				<DialogTitle>
					{contexto === 'adicionar' && 'Adicionar os'}
					{contexto === 'editar' && 'Editar os'}
					{contexto === 'excluir' && 'Excluir os'}
				</DialogTitle>
				{contexto !== 'excluir' && (
					<>
						<DialogContent>
							<TextField
								autoFocus
								margin="dense"
								id="nomeCliente"
								name="nomeCliente"
								label="Nome Cliente"
								type="text"
								fullWidth
								variant="filled"
								onChange={(ev) =>
									setNomeCliente(ev.target.value)
								}
								value={nomeCliente}
								multiline
								minRows={3}
							/>

							<TextField
								autoFocus
								margin="dense"
								id="equipamento"
								name="equipamento"
								label="Equipamento"
								type="text"
								fullWidth
								variant="filled"
								onChange={(ev) =>
									setEquipamento(ev.target.value)
								}
								value={equipamento}
								multiline
								minRows={3}
							/>

							<TextField
								autoFocus
								margin="dense"
								id="descricao"
								name="descricao"
								label="Descrição"
								type="text"
								fullWidth
								variant="filled"
								onChange={(ev) => setDescricao(ev.target.value)}
								value={descricao}
								multiline
								minRows={3}
							/>

							<TextField
								autoFocus
								margin="dense"
								id="valor"
								name="valor"
								label="Valor"
								type="number"
								fullWidth
								variant="filled"
								onChange={(ev) =>
									setValor(Number(ev.target.value))
								}
								value={valor}
								multiline
								minRows={3}
							/>
						</DialogContent>
						<DialogActions>
							<Button
								type="button"
								variant="outlined"
								onClick={fechaModal}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								color="success"
								variant="contained"
							>
								Salvar
							</Button>
						</DialogActions>
					</>
				)}

				{contexto === 'excluir' && (
					<>
						<DialogContent>
							<Typography variant="body1">
								Você deseja mesmo finalizar essa ordem de
								serviço?
							</Typography>
						</DialogContent>

						<DialogActions>
							<Button
								type="button"
								variant="outlined"
								onClick={fechaModal}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								color="error"
								variant="contained"
							>
								Finalizar
							</Button>
						</DialogActions>
					</>
				)}
			</Box>
		</Dialog>
	);
};
