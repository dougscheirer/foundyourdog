const initialState = {}

export const login = (state = initialState, action) => {
	switch (action.type) {
		// need a login UI
		case 'SHOW_LOGIN':
			return { ...state,
				status: "show"
			}
		// don't show the UI
		case 'HIDE_LOGIN':
			return { ...state,
				status: undefined
		 	}
		// logged in
		case 'LOGIN_OK':
			return { ...state,
				status: "success",
				data: action.userData
			}
		// logged out
		case 'LOGGED_OUT':
			return { ...state,
				status: "failed",
				data: undefined
			}
		case 'RESET_PASSWORD':
			return { ...state,
				status: "reset_pwd"
			}
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