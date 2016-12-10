const initialState = {
};

export const websockets = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_WEBSOCKET':
			return { ...state,
				websocket: action.websocket
			}
		case 'REGISTER_SOCKET':
			return { ...state,
				socketID: action.socket_id
			}
		case 'WEBSOCK_ADDR':
			return { ...state,
				websockAddr: action.address
			}
		default:
			return state;
		}
	}
