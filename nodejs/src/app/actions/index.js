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
		 postMessage } from './messages'

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
