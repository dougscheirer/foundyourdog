const initialState = {
};

export const incidents = (state = initialState, action) => {
	switch (action.type) {
		case 'REPORT_FETCHED':
			return { ...state,
				report_detail: action.result
			}
		case 'SHOW_INCIDENT_INFO':
			return { ...state,
				incident_info: action.incident_info
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
		default:
			return state;
	}
}
