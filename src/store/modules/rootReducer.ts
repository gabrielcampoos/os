import { combineReducers } from '@reduxjs/toolkit';

import contextoSlice from './ContextoModal/contextoSlice';
import loadingSlice from './Loading/loadingSlice';
import ModalId from './ModalId/idSlice';
import notificationSlice from './Notification/notificationSlice';
import osSlice from './Os/osSlice';
import usuarioSlice from './Usuarios/usuariosSlice';

const rootReducer = combineReducers({
	// a cada novo slice, adicionamos uma nova propriedade neste objeto
	// propriedade - nome na store
	// valor - reducer/manager deste estado global
	// modal: modalSlice,
	notification: notificationSlice,
	usuario: usuarioSlice,
	os: osSlice,
	loading: loadingSlice,
	contexto: contextoSlice,
	idOs: ModalId,

	// modal: modalTarefasSlice,
});

export default rootReducer;
