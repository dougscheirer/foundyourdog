/*
	{
		hidden_elements : [
			... ids of elements
		],
		changeCount: integer,
		login_status: undefined | 'login' | 'signup' | 'reset_password'
	}
*/

const initialState = {
	login_status: undefined
};

const reducerOne = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_LOGIN':
			return { ...state,
				login_status: action.show,
				login_data: action.userData };
		case 'CLEAR_POST_LOGIN_ACTIONS':
			return { ...state, post_login_actions: undefined }
		case 'POST_LOGIN_ACTION':
			let curActions = state.post_login_actions || []
			curActions.push(action.post_login_action)
			return { ...state,
				post_login_actions: curActions };
		case 'UPLOAD_IMAGE':
			return { ...state,
				image_info: action.image_info }
		case 'REPORT_FETCHED':
			return { ...state,
				report_detail: action.result
			}
		case 'SHOW_INCIDENT_INFO':
			return { ...state,
				incident_info: action.incident_info
			}
		case 'FOUND_UNASSIGNED_IMAGE':
			return { ...state,
				unassigned_image: action.image
			}
		case 'SHOW_WAIT_DIALOG':
			return { ...state,
				show_wait_dialog: action.show
			}
		case 'INCIDENT_INFO':
			// incidents is an array of lost or found
			let incidents = state.incidents || []
			incidents[action.filter] = action.incidents
			return { ...state,
				incidents: incidents }
		case 'USER_REPORTS':
			if (action.filter === 'open') {
				return { ...state,
					myOpenReports: action.incidents	}
			} else {
				return { ...state,
					myClosedReports: action.incidents	}
			}
		case 'USER_MESSAGES':
			if (action.filter === 'read') {
				return { ...state,
					myReadNotifications: action.notifications	}
			} else {
				return { ...state,
					myUnreadNotifications: action.notifications	}
			}
		case 'SEND_MESSAGE':
			const value = (action.notification_data && action.notification_data.incident && action.notification_data.target_user) ?
							action.notification_data : undefined
			return { ...state,
						notification_data: value }
		default:
			return state;
		}
	}

export default reducerOne;