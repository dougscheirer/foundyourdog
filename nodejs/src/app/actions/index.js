import { auth_fetch, auth_post } from './login'

export { showLogin,
				 clearPostLoginActions,
				 auth_fetch,
				 auth_post,
				 auth_delete,
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
	return auth_fetch('/api/auth/messages?type=' + type + '&user=current',
			(res) => {
					return {
						type: 'USER_MESSAGES',
						filter: type,
						notifications: res
					}
				})
}

export const sendMessage = (userid, incident, reply_to) => {
	return {
		type: 'SEND_MESSAGE',
		notification_data: { target_user: userid, incident: incident, reply_to: reply_to }
	}
}

export const postMessage = (data) => {
	if (typeof data !== "string") {
		data = JSON.stringify(data)
	}
	return auth_post('/api/auth/message', data,
			(res) => {
			  return {type: 'NOTIFCATION_SENT', result: res}
			})
}

export const uploadImage = (imageForm) => {
	return auth_post('/api/auth/report/images/new', imageForm, (res) => {
		return getUnassignedImages()
	})
}

export const submitReportForm = (url, form, post) => {
	return auth_post(url, form, (res) => {
			post(res)
			return {}
	})
}