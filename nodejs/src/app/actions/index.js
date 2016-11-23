import fetch from 'isomorphic-fetch';

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

export const uploadReportImage = (image_info) => {
	return {
		type: 'upload_image',
		image_info : image_info
	}
}

export const reportFetched = (res) => {
	return {
		type: 'REPORT_FETCHED',
		result: res
	}
}

export const wait_dialog = (show) => {
	return {
		type: 'SHOW_WAIT_DIALOG',
		show: show
	}
}

export const getReportInfo = (id) => {
	return dispatch => {
		fetch('/api/reports/' + id, { credentials: 'include'}).then((res) => {
			switch (res.status) {
				default:
					return null;
				case 200:
					return res.json();
			}
		}).then((res) => {
			dispatch(reportFetched(res));
		});
	}
}

export const showIncidentInfo = (incident) => {
	return {
		type: 'SHOW_INCIDENT_INFO',
		incident_info: incident
	}
}

// TODO: needless copy pasta
export const getIncidentInfo = (id) => {
	return dispatch => {
		dispatch(wait_dialog(true))
		fetch('/api/reports/' + id, { credentials: 'include'}).then((res) => {
			switch (res.status) {
				default:
					return null;
				case 200:
					return res.json();
			}
		}).then((res) => {
			dispatch(showIncidentInfo(res));
		});
	}
}

export const getUnassignedImages = () => {
	return dispatch => {
		fetch('/api/auth/reports/images/unassigned', { credentials: 'include' }).then((res) => {
			switch (res.status) {
				default:
					return null;
				case 200:
					return res.json();
			}
		}).then((res) => {
			if (!!res) {
				const image_block = (res.uuid !== undefined) ? res : undefined;
				return dispatch({
					type: 'FOUND_UNASSIGNED_IMAGE',
					image: image_block
				});
			}
		});
	}
}

export const getDogIncidents = ( type, location, zoom ) => {
	return dispatch => {
		fetch('/api/dogs/' + type + "?lat=" + location.lat + "&lng=" + location.lng + "&zoom=" + zoom,
					{ credentials : 'include' }).then((res) => {
						switch (res.status) {
							default:
								console.log("failed to get server data");
								return null
							case 200:
								return res.json()
						}
					}).then((res) => {
						if (!!res) {
		          return dispatch({
		          	type: 'INCIDENT_INFO',
		          	filter: type,
		          	incidents: res
		          })
		        }
		      })
  }
}

export const getUserReports = (type) => {
	return dispatch => {
		fetch('/api/auth/reports?type=' + type + '&user=current', { credentials: 'include' }).then((res) => {
			switch (res.status) {
				default:
					console.log("failed: " + res);
					return null
				case 200:
					return res.json()
				}
			}).then((res) => {
				if (!!res) {
					return dispatch({
						type: 'USER_REPORTS',
						filter: type,
						incidents: res
					})
				}
			})
		}
}

export const getUserNotifications = (type) => {
	return dispatch => {
		fetch('/api/auth/notifications?type=' + type + '&user=current', { credentials: 'include' }).then((res) => {
			switch (res.status) {
				default:
					console.log("failed: " + res);
					return null
				case 200:
					return res.json()
				}
			}).then((res) => {
				if (!!res) {
					return dispatch({
						type: 'USER_NOTIFICATIONS',
						filter: type,
						notifications: res
					})
				}
			})
		}
}
