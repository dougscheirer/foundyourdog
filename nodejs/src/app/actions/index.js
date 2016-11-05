import fetch from 'isomorphic-fetch';

export const showLogin = (show, userData, postLoginAction) => {
	return {
		type: 'SHOW_LOGIN',
		show: show,
		userData: userData,
		postLoginAction: postLoginAction
	}
}

export const logout = () => {
	return dispatch => {
		fetch('/logout', {
		  method: 'POST', credentials: 'include'
		}).then((res) => {
		  // TODO: check res for the status
		  dispatch(showLogin(undefined));
		});
	};
}

export const checkLoginStatus = () => {
	return dispatch => {
		fetch('/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok)
				return res.json();
		}).then((res) => {
			if (!!res) 
				dispatch(showLogin('success', res));
		});
	}
}

export const loginRequired = (postLoginAction) => {
	return dispatch => {
		fetch('/authenticated', { credentials: 'include' }).then((res) => {
			if (res.ok) {
				postLoginAction();
			}
			else {
				dispatch(showLogin('login', null, postLoginAction));
			}
		});
	}
}