const initialState = {}

export const login = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_LOGIN':
			return { ...state,
				status: action.show,
				data: action.userData };
		case 'CLEAR_POST_LOGIN_ACTIONS':
			return { ...state, post_login_actions: undefined }
		case 'POST_LOGIN_ACTION':
			let curActions = state.post_login_actions || []
			curActions.push(action.post_login_action)
			return { ...state,
				post_login_actions: curActions };
		default:
			return state;
	}
}