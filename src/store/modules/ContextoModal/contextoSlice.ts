import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import ContextoState from '../../types/ContextoState';

const initialState: ContextoState = {
	isOpen: false,
	contexto: 'adicionar',
};

export const contextoSlice = createSlice({
	name: 'contextoModal',
	initialState,
	reducers: {
		mostraModal: (
			state,
			action: PayloadAction<'adicionar' | 'editar' | 'excluir'>,
		) => {
			return {
				isOpen: true,
				contexto: action.payload,
			};
		},

		escondeModal: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { mostraModal, escondeModal } = contextoSlice.actions;

export default contextoSlice.reducer;
