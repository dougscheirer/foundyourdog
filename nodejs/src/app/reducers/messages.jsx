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
		case 'NEW_MESSAGE':
			return { ...state,
						new_message_data: action.message_data }
		case 'CONVERSATION': 
			// action.conversation.messages might be a partial list, so prepend it on the existing one
			const msgList = (!!state.conversation && !!state.conversation.conversation.messages) ?
				action.conversation.messages.concat(state.conversation.conversation.messages) :
				action.conversation.messages
			return { ...state,
						conversation: {
							incident: action.incident,
							message: action.message,
							conversation: { ...action.conversation, messages: msgList }
						}
					}
		default:
			return state;
	}
}
