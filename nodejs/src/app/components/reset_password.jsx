import React, { Component } from 'react'
import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalBody,
	ModalFooter
} from 'react-modal-bootstrap';
import { showLogin, showSignup, hideLogin } from '../actions'
import spinner from '../../spinner.svg';
import { connect } from 'react-redux'

class ResetPassword extends Component {
	state = { login_wait: false }

	hideModal() {
		this.props.hideModal();
	}

	login(e) {
		if (!!e) e.preventDefault()
		this.props.login()
	}

	signup(e) {
		if (!!e) e.preventDefault()
		this.props.signup()
	}

	reset(e) {
		if (!!e) e.preventDefault()
		// TODO: POST a reset for the email address
	}

	loginFooter() {
		const spinnerVis = (this.state.login_wait) ? (<img style={{ float: "left" }} src={spinner} alt="spinner" />) : undefined;
		const error_msg = this.state.error_msg;

		return (<div>{ spinnerVis }
							<div className="login-help">
								<div className={ "alert alert-danger " + (!!error_msg ? "visible" : "hidden") } role="alert">{ error_msg }</div>
							</div>
							<a href="" onClick={ this.signup.bind(this) }>Register</a> - <a href="" onClick={ this.login.bind(this) }>Login</a>
						</div>)
	}

	resetForm() {
		const buttonClasses = "login-submit btn btn-primary " + ((this.state.login_wait) ? "disabled" : "");

		return (<form onSubmit={ this.login.bind(this) }>
			<label>Enter your registered email address</label>
			<input type="text" className="form-control login-field" name="email" ref="email" placeholder="email address" autoFocus="true" />
			<button type="submit" name="login-btn" className={buttonClasses} id="login-btn" value="Log in" onClick={ this.reset.bind(this) }>Send reset code</button>
		</form>)
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
					<ModalTitle>Forgot your password?</ModalTitle>
				</ModalHeader>
				<ModalBody>
				{ this.resetForm() }
				</ModalBody>
				<ModalFooter>
					{ this.loginFooter() }
				</ModalFooter>
			</Modal>);
	}
}

const mapStateToProps = (state, myprops) => ({
	isOpen: state.login.status === "reset_pwd"
})

const mapDispatchToProps = (dispatch, props) => ({
	login : () => dispatch(showLogin()),
	signup : () => dispatch(showSignup()),
	hideModal : () => dispatch(hideLogin())
})

export default ResetPassword = connect(mapStateToProps, mapDispatchToProps)(ResetPassword)