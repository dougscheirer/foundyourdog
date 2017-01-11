import fetch from 'isomorphic-fetch';

export const hideLogin = () => {
	return {
		type: 'HIDE_LOGIN'
	}
}

export const showLogin = () => {
	return {
		type: 'SHOW_LOGIN'
	}
}

export const showSignup = () => {
	return {
		type: 'SHOW_SIGNUP'
	}
}

export const loginSuccess = (userData) => {
	return {
		type: 'LOGIN_OK',
		userData: userData
	}
}

export const loggedOut = () => {
	return {
		type: 'LOGGED_OUT'
	}
}

export const resetPassword = () => {
	return {
		type: 'RESET_PASSWORD'
	}
}

export const setPostLoginAction = (postLoginAction) => {
	return {
		type: 'POST_LOGIN_ACTION',
		post_login_action: postLoginAction
	}
}

export const clearPostLoginActions = () => {
	return {
		type: 'CLEAR_POST_LOGIN_ACTIONS'
	}
}

// method for queuing up requests that could fail for auth reasons
export const requires_login = (dispatch, fetch_func, process_func, error_func) => {
		fetch_func().then((res) => {
			switch (res.status) {
				case 401: // unauthorized, you need to log in
					dispatch(setPostLoginAction(() => { requires_login(dispatch, fetch_func, process_func, error_func) }))
					dispatch(showLogin())
					break;
				case 200:
					res.json().then((res) => dispatch(process_func(res)))
					break;
				case 403: // forbidden, login will not help
				default:
					if (!!error_func) error_func(res)
					break;
			}
		})
}

export const logout = () => {
	return dispatch => {
		fetch('/api/logout', {
		  method: 'POST', credentials: 'include'
		}).then((res) => {
		  // TODO: check res for the status
		  dispatch(loggedOut());
		});
	};
}

export const loginRequired = (postLoginAction) => {
	return dispatch => {
		fetch('/api/auth/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok) {
				postLoginAction();
			}
			else {
				if (!!postLoginAction)
					dispatch(setPostLoginAction(postLoginAction));
				dispatch(showLogin());
			}
		});
	}
}

export const auth_method = (url, optionsIn) => {
	// options: method, success, error, body
	const options = (!!optionsIn ? optionsIn : {})
	return dispatch => {
		const headers = !!options.headers ? options.headers :
											(typeof body === "string") ? { 'Content-Type': 'application/json' } : undefined
		requires_login(
			dispatch,
			() =>	{ return fetch(url, { method: options.method, credentials: 'include', body: options.body, headers: headers})},
			(res) => { return options.success(res) },
			(res) => {
				if (!!!options.error)
					res.text().then((res) => console.log("auth_method error: " + res))
				else
					options.error(res)
			})
		}
}

export const auth_fetch = (url, options) => {
	return auth_method(url, { ...options, method: "GET"} )
}

export const auth_post = (url, options) => {
	return auth_method(url, { ...options, method: "POST" })
}

export const auth_put = (url, options) => {
	return auth_method(url, { ...options, method: "PUT"})
}

export const auth_delete = (url, options) => {
	return auth_method(url, { ...options, method: "DELETE" })
}

// login is not technically required here, it's just a check
export const checkLoginStatus = (after) => {
	return dispatch => {
		return fetch('/api/auth/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok)
				return res.json();
			else
				return undefined
		}).then((res) => {
			if (!!res) {
				if (!!after) after(res);
				return dispatch(loginSuccess(res));
			}
			else
				dispatch(loggedOut());
		});
	}
}
