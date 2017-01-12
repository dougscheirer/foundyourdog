import { auth_post, auth_fetch } from './login'

export const getReportInfo = (id) => {
	return auth_fetch('/api/reports/' + id + "?host=" + window.location.host,
		{
			success: (res) => {
				return {
						type: 'REPORT_FETCHED',
						result: res
					}
			},
			error: (res, dispatch) => {
				return { type: 'REPORT_NOT_FOUND', result: res }
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
		{
			success: (res) => showIncidentInfo(res)
		})
}

export const getDogIncidents = ( type, location, zoom ) => {
	return auth_fetch('/api/dogs/' + type + "?lat=" + location.lat + "&lng=" + location.lng + "&zoom=" + zoom,
		{
			success: (res) => {
        return {
        	type: 'INCIDENT_INFO',
        	filter: type,
        	incidents: res
        }
		  }
		})
}

export const getContactList = (id) => {
	return auth_fetch('/api/auth/contacts?incident=' + id,
		{
			success: (res) => {
				return {
					type: 'INCIDENT_CONTACTS',
					contacts: res
				}
			}
		})
}
export const getUserReports = (type) => {
	return auth_fetch('/api/auth/reports?type=' + type + '&user=current',
		{
			success: (res) => {
					return {
						type: 'USER_REPORTS',
						filter: type,
						incidents: res
					}
				}
		})
}

export const submitReportForm = (url, form, post) => {
	return auth_post(url,
		{
			body: form,
			success: (res) => {
				post(res)
				return { type: 'REPORT_SUBMITTED'}
			}
		})
}

export const resolveIncident = (id, form) => {
	return auth_post('/api/auth/reports/' + id + '/resolve',
		{
			body: form,
			success: (res) => {
				return { type: 'INCIDENT_RESOLVED' }
			}
		})
}