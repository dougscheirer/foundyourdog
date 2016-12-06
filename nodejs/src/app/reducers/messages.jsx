const initialState = {
};

export const messages = (state = initialState, action) => {
	switch (action.type) {
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
		case 'MESSAGE_SENT':
			return { ...state,
						notification_data: undefined }
		case 'CONVERSATION':
			return { ...state,
						conversation: { 
							incident: action.incident,
							message: action.message,
							conversation: action.conversation }
						}
		default:
			return state;
	}
}
