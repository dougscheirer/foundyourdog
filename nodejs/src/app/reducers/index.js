import { toastr } from 'react-redux-toastr'
export { login } from './login'
export { messages } from './messages'
export { incidents } from './incidents'
export { images } from './images'

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
		case 'UPLOAD_IMAGE':
			return { ...state,
				image_info: action.image_info }
		case 'FOUND_UNASSIGNED_IMAGE':
			return { ...state,
				unassigned_image: action.image
			}
		case 'SHOW_WAIT_DIALOG':
			return { ...state,
				show_wait_dialog: action.show
			}

		default:
			return state;
		}
	}

export default reducerOne;