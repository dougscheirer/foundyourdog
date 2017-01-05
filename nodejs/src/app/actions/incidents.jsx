import { auth_post, auth_fetch } from './login'

export const getReportInfo = (id) => {
	return auth_fetch(
			'/api/reports/' + id + "?host=" + window.location.host,
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
	return auth_fetch('/api/reports/' + id + "?host=" + window.location.host,
			(res) => showIncidentInfo(res))
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


export const submitReportForm = (url, form, post) => {
	return auth_post(url, form, (res) => {
			post(res)
			return { type: 'REPORT_SUBMITTED'}
	})
}