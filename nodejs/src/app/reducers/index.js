export { login } from './login'
export { messages } from './messages'
export { incidents } from './incidents'
export { images } from './images'

/*
	{
		hidden_elements : [
			... ids of elements
		],
		changeCount: integer,
		login_status: undefined | 'login' | 'signup' | 'reset_password'
	}
*/

const initialState = {
};

const reducerOne = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_WAIT_DIALOG':
			return { ...state,
				show_wait_dialog: action.show
			}
		case 'SET_WEBSOCKET':
			return { ...state,
				websocket: action.websocket
			}
		case 'REGISTER_SOCKET':
			return { ...state,
				socketID: action.socket_id
			}
		default:
			return state;
		}
	}

export default reducerOne;