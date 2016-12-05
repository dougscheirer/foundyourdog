import fetch from 'isomorphic-fetch';

export const showLogin = (show, userData) => {
	return {
		type: 'SHOW_LOGIN',
		show: show,
		userData: userData
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
				case 403:
					dispatch(setPostLoginAction(() => { requires_login(dispatch, fetch_func, process_func, error_func) }))
					dispatch(showLogin('login', null))
					break;
				case 200:
					res.json().then((res) => dispatch(process_func(res)))
					break;
				default:
					if (!!error_func) dispatch(error_func(res))
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
		  dispatch(showLogin(undefined));
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
				dispatch(showLogin('login', null));
			}
		});
	}
}

export const auth_method = (url, method, fn_complete, body) => {
	return dispatch => {
		const headers = (typeof body === "string") ? { 'Content-Type': 'application/json' } : undefined
		requires_login(
			dispatch,
			() =>	{ return fetch(url, { method: method, credentials: 'include', body: body, headers: headers})},
			(res) => { return fn_complete(res) })
		}
}

export const auth_fetch = (url, fn_complete) => {
	return auth_method(url, "GET", fn_complete)
}

export const auth_post = (url, data, fn_complete) => {
	return auth_method(url, "POST", fn_complete, data)
}

export const auth_delete = (url, fn_complete) => {
	return auth_method(url, "DELETE", fn_complete)
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
				return dispatch(showLogin('success', res));
			}
			else
				return undefined
		});
	}
}
