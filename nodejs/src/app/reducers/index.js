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
			return { ...state, login_status: action.show, login_data: action.userData };
		default:
			return state;
		}
	}

export default reducerOne;