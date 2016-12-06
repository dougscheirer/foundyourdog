export { showLogin,
				 clearPostLoginActions,
				 auth_fetch,
				 auth_post,
				 auth_delete,
				 checkLoginStatus,
				 loginRequired,
				 logout } from './login'

export { getUserNotifications,
		 sendMessage,
		 postMessage,
		 getConversation } from './messages'

export { getReportInfo,
		 showIncidentInfo,
		 getIncidentInfo,
		 getDogIncidents,
		 getUserReports,
		 submitReportForm } from './incidents'

export { uploadImage,
		 uploadReportImage,
		 getUnassignedImages } from './images'

export const wait_dialog = (show) => {
	return {
		type: 'SHOW_WAIT_DIALOG',
		show: show
	}
}

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
