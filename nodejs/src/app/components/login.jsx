import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalBody,
	ModalFooter
} from 'react-modal-bootstrap';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { showLogin, clearPostLoginActions } from '../actions';
import spinner from '../../spinner.svg';
import fetch from 'isomorphic-fetch';

class Login extends Component {

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
			if (!!this.props.postLoginActions) {
				for (let i = 0; i < this.props.postLoginActions.length; i++) {
					this.props.postLoginActions[i]()
				}
				this.props.onClearPostLoginActions()
			}
		})
	}

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
			const buttonClasses = "login-submit btn btn-primary " + ((this.state.login_wait) ? "disabled" : "");
			const spinnerVis = (this.state.login_wait) ? (<img style={{ float: "left" }} src={spinner} alt="spinner" />) : undefined;
			const error_msg = this.state.error_msg;

			return (
				<Modal isOpen={this.props.isOpen} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
					<ModalHeader>
						<ModalClose onClick={ this.hideModal.bind(this) }/>
						<ModalTitle>Sign in to your account</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<form onSubmit={ this.login.bind(this) }>
							<input type="text" className="form-control login-field" name="user" ref="user" placeholder="Username" autoFocus="true" />
							<input type="password" className="form-control login-field" name="password" ref="password" placeholder="Password" />
							<button type="submit" name="login-btn" className={buttonClasses} id="login-btn" value="Log in" onClick={ this.login.bind(this) }>Log in</button>
						</form>
					</ModalBody>
					<ModalFooter>
						{ spinnerVis }
						<div className="login-help">
							<div className={ "alert alert-danger " + (!!error_msg ? "visible" : "hidden") } role="alert">{ error_msg }</div>
						</div>
						<a href="" onClick={ this.signup.bind(this) }>Register</a> - <a href="" onClick={ this.passwordReset.bind(this) }>Forgot Password</a>
					</ModalFooter>
				</Modal>);
		}
	}

	Login.propTypes = {
		isOpen: PropTypes.bool.isRequired
	}

	const mapStateToProps = (state, ownProps) => ({
		isOpen: 						state.login_status === 'login',
		postLoginActions: 	state.post_login_actions
	});

	const mapDispatchToProps = (dispatch, ownProps) => ({
		onHide: () 			=> { dispatch(showLogin(undefined)); },
		onSignup: () 		=> { dispatch(showLogin('signup')); },
		onPasswordReset: () => { dispatch(showLogin('reset_password')); },
		onLoggedIn: (data)  => { dispatch(showLogin('success', data)); },
		onClearPostLoginActions: () => { dispatch(clearPostLoginActions()) }
	});

	export default Login=connect(mapStateToProps, mapDispatchToProps)(Login);
