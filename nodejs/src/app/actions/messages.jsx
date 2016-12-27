import { auth_fetch, auth_post } from './login'
import toastr from 'toastr'

export const getUserMessages = (type) => {
	return auth_fetch('/api/auth/messages?type=' + type + '&user=current',
			(res) => {
					return {
						type: 'USER_MESSAGES',
						filter: type,
						messages: res
					}
				})
}

export const sendMessage = (userid, incident, reply_to) => {
	return {
		type: 'SEND_MESSAGE',
		message_data: { target_user: userid, incident: incident, reply_to: reply_to }
	}
}

export const postMessage = (data) => {
	if (typeof data !== "string") {
		data = JSON.stringify(data)
	}
	return auth_post('/api/auth/message', data,
			(res) => {
				toastr.success("Message sent");
			  	return {type: 'MESSAGE_SENT', result: res}
			})
}

export const clearConversation = () => {
	return {
		type: "CLEAR_CONVERSATION"
	}
}

export const markConversation = (incident_id, msg_id, from_ordinal, read) => {
	return auth_post('/api/auth/mark?incident=' + incident_id + "&msg=" + msg_id + "&ordinal=" + from_ordinal + "&read="+read, undefined,
		(res) => {
			return {
				type: 'UNREAD_MESSAGES',
				unread: res.unread
			}
		},
		(res) => {
			return {
				type: 'UNREAD_MESSAGES',
				unread: -1
			}
		})
}

export const getConversation = (incident_id, msg_id, from_ordinal, success, err_fn) => {
	return auth_fetch('/api/auth/conversation?incident=' + incident_id + "&msg=" + msg_id + "&ordinal=" + from_ordinal,
		(res) => {
			success(res)
			return {
				type: 'CONVERSATION',
				incident: incident_id,
				message: msg_id,
				conversation: res
			}
		}, err_fn)
}

export const newMessage = (msg_data, ordinal_start) => {
	return getConversation(msg_data.incidentID, msg_data.messageID, ordinal_start)
}

export const setUnreadMessages = (unread) => {
	return {
		type: 'UNREAD_MESSAGES',
		unread: unread
	}
}