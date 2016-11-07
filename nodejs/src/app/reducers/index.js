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
		case 'POST_LOGIN_ACTION':
			return { ...state,
				post_login_action: action.post_login_action };
		case 'UPLOAD_IMAGE':
			return { ...state,
				image_info: action.image_info }
		default:
			return state;
		}
	}

export default reducerOne;