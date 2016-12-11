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
import { showLogin, resetPassword, signUp, auth_post } from '../actions';
import spinner from '../../spinner.svg';
import toastr from 'toastr';

class Signup extends Component {

	state = {
		signup_wait: false,
		error_msg: ''
	}

	login(e) {
		e.preventDefault();
		this.props.onLogin();
	}

	passwordReset(e) {
		e.preventDefault();
		this.props.onPasswordReset();
	}

	onSignedUp(e) {
		this.props.onLogin();
	}

	signup(e) {
		e.preventDefault();

		const form = this.validate();
		if (!!!form) return;

		// first dispatch a spinner
		this.setState({signup_wait: true, error_msg: ''});

		// TODO: change this to use fetch() in the action folder?
		fetch("/api/signup", {
			method: "POST",
			body: JSON.stringify(form),
			headers:{ "Content-Type" : "application/json" },
			credentials: 'include'
		}).then((res) => {
			this.setState({signup_wait: false});
			if (res.ok) {
				return res.json()
			} else {
				res.text().then((text) => this.setState({error_msg: "Status " + res.status + " : " + text}));
				return undefined
			}
		}).then((data) => {
			if (!!!data) return
			this.onSignedUp()
		})
	}

	validate() {
		const formdata = {
			email: 				this.refs.email.value,
			userid: 			this.refs.user.value,
			password: 		this.refs.password.value
		};
		const password_confirm = this.refs.password_confirm.value;

		let errors = false;
		if (!!!formdata.password || formdata.password !== password_confirm)
									{ toastr.error('Password is required or does not match'); errors = true; }
		if (!!!formdata.userid) 	{ toastr.error('User name is required'); errors = true; }
		if (!!!formdata.email) 		{ toastr.error('Email is required'); errors = true; }

		return errors ? null : formdata;
	}


	hideModal() {
		this.props.onHide();
		this.setState({signup_wait: false, error_msg: ''});
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
		const buttonClasses = "login-submit btn btn-primary " + ((this.state.signup_wait) ? "disabled" : "");
		const spinnerVis = (this.state.signup_wait) ? (<img style={{ float: "left" }} src={spinner} alt="spinner" />) : undefined;
		const error_msg = this.state.error_msg;

		return (
			<Modal isOpen={this.props.isOpen} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
		  <ModalHeader>
		    <ModalClose onClick={ this.hideModal.bind(this) }/>
		    <ModalTitle>Sign up for your account</ModalTitle>
		  </ModalHeader>
		  <ModalBody>
		  	<form onSubmit={ this.login.bind(this) }>
				<input type="email" className="form-control login-field" name="user" ref="email" placeholder="you@example.com" autoFocus="true" />
				<input type="text" className="form-control login-field" name="user" ref="user" placeholder="Username" />
				<input type="password" className="form-control login-field" name="password" ref="password" placeholder="Password" />
				<input type="password" className="form-control login-field" name="password-confirm" ref="password_confirm" placeholder="Confirm password" />
	        	<button type="submit" name="login-btn" className={buttonClasses} id="login-btn" value="Sign up" onClick={ this.signup.bind(this) }>Sign up</button>
	        </form>
	 	  </ModalBody>
		  <ModalFooter>
  		  	  { spinnerVis }
			  <div className="login-help">
  		  	  	<div className={ "alert alert-danger " + (!!error_msg ? "visible" : "hidden") } role="alert">{ error_msg }</div>
			  </div>
			<a href="#" onClick={ this.login.bind(this) }>Log in</a> - <a href="#" onClick={ this.passwordReset.bind(this) }>Forgot Password</a>
		  </ModalFooter>
		</Modal>);
	}
}

Signup.propTypes = {
	isOpen: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => ({
	isOpen: state.login.status === 'signup'
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onLogin: () 		=> { dispatch(showLogin()); },
	onPasswordReset: () => { dispatch(resetPassword()); },
	send_signup: (form) => { dispatch(signUp(form)) }
});

export default Signup=connect(mapStateToProps, mapDispatchToProps)(Signup);
