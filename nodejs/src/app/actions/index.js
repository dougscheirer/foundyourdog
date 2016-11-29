import { auth_fetch, auth_post } from './login'

export { showLogin,
				 clearPostLoginActions,
				 checkLoginStatus,
				 loginRequired,
				 logout } from './login'

export const uploadReportImage = (image_info) => {
	return {
		type: 'upload_image',
		image_info : image_info
	}
}

export const wait_dialog = (show) => {
	return {
		type: 'SHOW_WAIT_DIALOG',
		show: show
	}
}

export const getReportInfo = (id) => {
	return auth_fetch(
			'/api/reports/' + id,
			(res) => {
				return {
					type: 'REPORT_FETCHED',
					result: res
				}
		})
}

export const showIncidentInfo = (incident) => {
	return {
		type: 'SHOW_INCIDENT_INFO',
		incident_info: incident
	}
}

export const getIncidentInfo = (id) => {
	return auth_fetch('/api/reports/' + id,
			(res) => showIncidentInfo(res))
}

export const getUnassignedImages = () => {
	return auth_fetch(
			'/api/auth/reports/images/unassigned',
			(res) => {
				const image_block = (res.uuid !== undefined) ? res : undefined;
				return {
					type: 'FOUND_UNASSIGNED_IMAGE',
					image: image_block
				}
			})
}

export const getDogIncidents = ( type, location, zoom ) => {
	return auth_fetch('/api/dogs/' + type + "?lat=" + location.lat + "&lng=" + location.lng + "&zoom=" + zoom,
					(res) => {
		          return {
		          	type: 'INCIDENT_INFO',
		          	filter: type,
		          	incidents: res
		          }
		        })
}

export const getUserReports = (type) => {
	return auth_fetch('/api/auth/reports?type=' + type + '&user=current',
			(res) => {
					return {
						type: 'USER_REPORTS',
						filter: type,
						incidents: res
					}
				}
			)
}

export const getUserNotifications = (type) => {
	return auth_fetch('/api/auth/notifications?type=' + type + '&user=current',
			(res) => {
					return {
						type: 'USER_NOTIFICATIONS',
						filter: type,
						notifications: res
					}
				})
}

export const sendNotification = (userid, incident, reply_to) => {
	return {
		type: 'SEND_NOTIFICATION',
		notification_data: { target_user: userid, incident: incident, reply_to: reply_to }
	}
}

export const postNotification = (incident, reply_to, data) => {
	return auth_post('/api/notify',
			(res) => {
			  return {type: 'NOTIFCATION_SENT', result: res}
			})
}
