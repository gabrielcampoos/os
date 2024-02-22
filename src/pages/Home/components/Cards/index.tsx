import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';

import { useAppDispatch } from '../../../../store/hooks';
import { mostraModal } from '../../../../store/modules/ContextoModal/contextoSlice';
import { capturaId } from '../../../../store/modules/ModalId/idSlice';

interface CardsProps {
	id: string;
	nomeCliente: string;
	equipamento: string;
	descricao: string;
	valor: number;
	criadoEm: string;
}

export const Cards = ({
	nomeCliente,
	equipamento,
	id,
	descricao,
	valor,
	criadoEm,
}: CardsProps) => {
	const dispatch = useAppDispatch();

	const showModal = (tipo: string) => {
		switch (tipo) {
			case 'editar':
				dispatch(mostraModal('editar'));
				dispatch(
					capturaId({
						id: id,
						nomeCliente: nomeCliente,
						equipamento: equipamento,
						descricao: descricao,
						valor: valor,
					}),
				);

				break;
			case 'excluir':
				dispatch(mostraModal('excluir'));
				dispatch(
					capturaId({
						id: id,
						nomeCliente: nomeCliente,
						equipamento: equipamento,
						descricao: descricao,
						valor: valor,
					}),
				);
		}
	};

	const newData = new Date();
	const dataFormatada =
		newData.getDate() +
		'/' +
		(newData.getMonth() + 1) +
		'/' +
		newData.getFullYear();

	return (
		<>
			<Grid item xs={12} md={12} lg={4}>
				<Card
					variant="outlined"
					id={id}
					sx={{
						boxShadow: '1px 1px 10px  #6e5fa2',
					}}
				>
					<CardHeader title={`Nome Cliente: ${nomeCliente}`} />

					<CardContent>
						<Typography>{`Equipamento: ${equipamento}`}</Typography>
					</CardContent>
					<CardContent>
						<Typography>Descrição: {descricao}</Typography>
						<Typography>Valor: {valor}</Typography>
						<Typography>{(criadoEm = dataFormatada)}</Typography>
					</CardContent>
					<CardActions>
						<IconButton onClick={() => showModal('editar')}>
							<EditNoteIcon />
						</IconButton>
						<IconButton onClick={() => showModal('excluir')}>
							<DeleteIcon />
						</IconButton>
					</CardActions>
				</Card>
			</Grid>
		</>
	);
};
