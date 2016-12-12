const initialState = {
};

export const messages = (state = initialState, action) => {
	switch (action.type) {
		case 'USER_MESSAGES':
			if (action.filter === 'read') {
				return { ...state,
					myReadMessages: action.messages	}
			} else {
				return { ...state,
					myUnreadMessages: action.messages	}
			}
		case 'SEND_MESSAGE':
			const value = (action.message_data && action.message_data.incident && action.message_data.target_user) ?
							action.message_data : undefined
			return { ...state,
						message_data: value }
		case 'MESSAGE_SENT':
			return { ...state,
						message_data: undefined }
		case 'UNREAD_MESSAGES':
			return { ...state,
						unread: action.unread }
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
