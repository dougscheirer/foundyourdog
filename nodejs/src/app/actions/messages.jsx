import { auth_fetch, auth_post } from './login'
import toastr from 'toastr'

export const getUserNotifications = (type) => {
	return auth_fetch('/api/auth/messages?type=' + type + '&user=current',
			(res) => {
					return {
						type: 'USER_MESSAGES',
						filter: type,
						notifications: res
					}
				})
}

export const sendMessage = (userid, incident, reply_to) => {
	return {
		type: 'SEND_MESSAGE',
		notification_data: { target_user: userid, incident: incident, reply_to: reply_to }
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