import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalBody,
	ModalFooter
} from 'react-modal-bootstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { hideLogin, loginSuccess, showSignup, resetPassword, clearPostLoginActions } from '../actions';
import spinner from '../../spinner.svg';
import fetch from 'isomorphic-fetch';
import { processPostLoginActions } from './helpers'

class LoginBase extends Component {

	state = {
		login_wait: false,
		error_msg: ''
	}

	signup(e) {
		e.preventDefault();
		this.props.onSignup();
	}

	passwordReset(e) {
		e.preventDefault();
		this.props.onPasswordReset();
	}

	loginForm() {
			const buttonClasses = "login-submit btn btn-primary " + ((this.state.login_wait) ? "disabled" : "");

			return (<form onSubmit={ this.login.bind(this) }>
				<input type="text" className="form-control login-field" name="user" ref="user" placeholder="Username" autoFocus="true" />
				<input type="password" className="form-control login-field" name="password" ref="password" placeholder="Password" />
				<button type="submit" name="login-btn" className={buttonClasses} id="login-btn" value="Log in" onClick={ this.login.bind(this) }>Log in</button>
			</form>)
	}

	loginFooter() {
		const spinnerVis = (this.state.login_wait) ? (<img style={{ float: "left" }} src={spinner} alt="spinner" />) : undefined;
		const error_msg = this.state.error_msg;

		return (<div>
							{ spinnerVis }
							<div className="login-help">
								<div className={ "alert alert-danger " + (!!error_msg ? "visible" : "hidden") } role="alert">{ error_msg }</div>
							</div>
							<a href="" onClick={ this.signup.bind(this) }>Register</a> - <a href="" onClick={ this.passwordReset.bind(this) }>Forgot Password</a>
						</div>)
	}

	subscribe(data) {
		if (!!this.props.websocket)
			this.props.websocket.send_message("LOGIN SUBSCRIBE " + data.uuid, "INFO", 5000, true)
	}

	login(e) {
		e.preventDefault();

		// first dispatch a spinner
		this.setState({login_wait: true, error_msg: ''});
		// now do the network call, dispatch the results

		// TODO: change this to use fetch() in the action folder?
		fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({ user: this.refs.user.value, password: this.refs.password.value }),
			headers:{ "Content-Type" : "application/json" },
			credentials: 'include'
		}).then((res) => {
			this.setState({login_wait: false});
			if (res.ok) {
				return res.json()
			} else {
				this.setState({error_msg: "Status " + res.status + " : " + res.statusText});
				return undefined
			}
		}).then((data) => {
			if (!!!data) return data
			this.props.onLoggedIn(data);
			this.subscribe(data)
			processPostLoginActions(this.props.postLoginActions)
		    this.props.onClearPostLoginActions()
		})
	}
}

class LoginPopupLocal extends LoginBase {
	hideModal() {
		this.props.onHide();
		this.setState({login_wait: false, error_msg: ''});
		this.props.onClearPostLoginActions()
	}

	render() {
		const dialogStyles = {
			base: {
				width: "300px",
				top: "-600px",
				transition: "top 0.4s"
			},
			open: {
				top: 0
			}
		}

		return (
			<Modal isOpen={this.props.isOpen} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
				<ModalHeader>
					<ModalClose onClick={ this.hideModal.bind(this) }/>
					<ModalTitle>Sign in to your account</ModalTitle>
				</ModalHeader>
				<ModalBody>
				{ this.loginForm() }
				</ModalBody>
				<ModalFooter>
					{ this.loginFooter() }
				</ModalFooter>
			</Modal>);
	}
}

class LoginViewLocal extends LoginBase {
	render() {
		return (
			<div className="homemain">
				<label>Sign in to your account</label>
				{ this.loginForm() }
				<div className="footer">
					{ this.loginFooter() }
				</div>
			</div>);
	}
}

const mapStateToProps = (state, ownProps) => ({
	isOpen: 			state.login.status === 'show',
	postLoginActions: 	state.login.post_login_actions,
	websocket: 			state.websockets.websocket
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onHide: () 			=> { dispatch(hideLogin()); },
	onSignup: () 		=> { dispatch(showSignup()); },
	onPasswordReset: () => { dispatch(resetPassword()); },
	onLoggedIn: (data)  => { dispatch(loginSuccess(data)); },
	onClearPostLoginActions: () => { dispatch(clearPostLoginActions()) }
});

export const LoginPopup = connect(mapStateToProps, mapDispatchToProps)(LoginPopupLocal)
export const LoginView = connect(mapStateToProps, mapDispatchToProps)(LoginViewLocal)
