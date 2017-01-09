const initialState = {
};

export const incidents = (state = initialState, action) => {
	switch (action.type) {
		case 'REPORT_FETCHED':
			return { ...state,
				report_detail: action.result
			}
		case 'REPORT_NOT_FOUND':
			return { ...state,
				report_detail: { error: action.result }
			}
		case 'SHOW_INCIDENT_INFO':
		case 'INCIDENT_RESOLVED':
			return { ...state,
				incident_info: action.incident_info
			}
		case 'INCIDENT_INFO':
			// incidents is an array of lost or found
			let incidents = state.incidents || []
			incidents[action.filter] = action.incidents
			return { ...state,
				incidents: incidents }
		case 'INCIDENT_CONTACTS':
			return { ...state,
				contacts: action.contacts
			}
		case 'USER_REPORTS':
			if (action.filter === 'open') {
				return { ...state,
					myOpenReports: action.incidents	}
			} else {
				return { ...state,
					myClosedReports: action.incidents	}
			}
		default:
			return state;
	}
}
