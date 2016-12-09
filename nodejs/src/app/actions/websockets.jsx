import { auth_fetch } from './login'

export const setWebsocket = (ws) => {
	return {
		type: "SET_WEBSOCKET",
		websocket: ws
	}
}

export const registerSocket = (id) => {
	return {
		type: "REGISTER_SOCKET",
		socket_id: id
	}
}

