import fetch from 'isomorphic-fetch';

// method for queuing up requests that could fail for auth reasons
export const requires_login = (dispatch, fetch_func, process_func, error_func) => {
		fetch_func().then((res) => {
			switch (res.status) {
				case 403:
					dispatch(setPostLoginAction(() => { requires_login(dispatch, fetch_func, process_func, error_func) }))
					dispatch(showLogin('login', null))
					break;
				case 200:
					res.json().then((res) => dispatch(process_func(res)))
					break;
				default:
					if (!!error_func) dispatch(error_func(res))
					break;
			}
		})
}

export const setPostLoginAction = (postLoginAction) => {
	return {
		type: 'POST_LOGIN_ACTION',
		post_login_action: postLoginAction
	}
}

export const showLogin = (show, userData) => {
	return {
		type: 'SHOW_LOGIN',
		show: show,
		userData: userData
	}
}

export const logout = () => {
	return dispatch => {
		fetch('/api/logout', {
		  method: 'POST', credentials: 'include'
		}).then((res) => {
		  // TODO: check res for the status
		  dispatch(showLogin(undefined));
		});
	};
}

export const checkLoginStatus = () => {
	return dispatch => {
		fetch('/api/auth/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok)
				return res.json();
		}).then((res) => {
			if (!!res)
				dispatch(showLogin('success', res));
		});
	}
}

export const loginRequired = (postLoginAction) => {
	return dispatch => {
		fetch('/api/auth/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok) {
				postLoginAction();
			}
			else {
				dispatch(setPostLoginAction(postLoginAction));
				dispatch(showLogin('login', null));
			}
		});
	}
}

export const auth_fetch = (url, fn_complete) => {
	return dispatch => {
		requires_login(
			dispatch,
			() =>	{ return fetch(url, {credentials: 'include' }) },
			(res) => { return fn_complete(res) })
		}
}

export const auth_post = (url, fn_complete) => {
	return dispatch => {
		requires_login(
			dispatch,
			() =>	{ return fetch(url, {method: "POST", credentials: 'include' }) },
			(res) => { return fn_complete(res) })
		}
}


export const uploadReportImage = (image_info) => {
	return {
		type: 'upload_image',
		image_info : image_info
	}
}

export const reportFetched = (res) => {
	return
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