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
				dispatch(setPostLoginAction(postLoginAction));
				dispatch(showLogin('login', null));
			}
		});
	}
}

export const auth_fetch = (url, fn_complete) => {
	return dispatch => {
		requires_login(
			dispatch,
			() =>	{ return fetch(url, {credentials: 'include' }) },
			(res) => { return fn_complete(res) })
		}
}

export const auth_post = (url, fn_complete) => {
	return dispatch => {
		requires_login(
			dispatch,
			() =>	{ return fetch(url, {method: "POST", credentials: 'include' }) },
			(res) => { return fn_complete(res) })
		}
}

export const checkLoginStatus = () => {
	return dispatch => {
		return fetch('/api/auth/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok)
				return res.json();
			else
				return undefined
		}).then((res) => {
			if (!!res)
				return dispatch(showLogin('success', res));
			else
				return undefined
		});
	}
}
