/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface OsProps {
	id: string | undefined;
	nomeCliente: string | undefined;
	equipamento: string | undefined;
	descricao: string | undefined;
	valor: number | undefined;
}

const initialState: OsProps = {
	id: '',
	nomeCliente: '',
	equipamento: '',
	descricao: '',
	valor: 0,
};

export const idOsSlice = createSlice({
	name: 'idOs',
	initialState,
	reducers: {
		capturaId: (state, action: PayloadAction<OsProps>) => {
			return {
				id: action.payload.id ?? '',
				nomeCliente: action.payload.nomeCliente ?? '',
				equipamento: action.payload.equipamento ?? '',
				descricao: action.payload.descricao ?? '',
				valor: action.payload.valor ?? 0,
			};
		},
		apagaId: (state) => {
			return initialState;
		},
	},
});

export const { apagaId, capturaId } = idOsSlice.actions;

export default idOsSlice.reducer;
