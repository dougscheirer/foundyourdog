const initialState = {}

export const login = (state = initialState, action) => {
	switch (action.type) {
		// status: 		the status of the authentication
		// show_auth: whether or not the auth/reset/signup dialogs should be visible
		case 'SHOW_LOGIN':
			return { ...state,
				show_auth: "login"
			}
		case 'SHOW_SIGNUP':
			return { ...state,
				show_auth: "signup"
			}
		// don't show the UI
		case 'HIDE_LOGIN':
			return { ...state,
				show_auth: undefined
		 	}
		// logged in
		case 'LOGIN_OK':
			return { ...state,
				status: "success",
				show_auth: undefined,
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
				show_auth: "reset_pwd"
			}
		case 'CLEAR_POST_LOGIN_ACTIONS':
			return { ...state,
				post_login_actions: undefined
			}
		case 'POST_LOGIN_ACTION':
			let curActions = state.post_login_actions || []
			curActions.push(action.post_login_action)
			return { ...state,
				post_login_actions: curActions
			};
		default:
			return state;
	}
}