import React, { Component } from 'react'
import { connect } from 'react-redux'
import loading from './loading.svg'
import { browserHistory } from 'react-router'
import spinner from '../../spinner.svg';
import fetch from 'isomorphic-fetch'
import toastr from 'toastr'
import { resetPassword, showLogin, showSignup } from '../actions'

class ResetPasswordForm extends Component {
	state = {}

	componentDidMount() {
	}

	loadFailed(res) {
	}

	validateForm() {
		const form = {
			email: this.refs.email.value,
			password: this.refs.password.value,
			reset_token: this.props.params.reset_token
		}

		let failed = false
		if (!!!form.password || form.password !== this.refs.password_confirm.value)
							{ toastr.error("Passwords must match"); failed = true }
		if (!!!form.email) { toastr.error("Email is required"); failed = true }

		return (failed ? undefined : form)
	}

	sendReset(e) {
		if (!!e) e.preventDefault()
		browserHistory.push("/")
		this.props.showReset()
	}

	login(e) {
		if (!!e) e.preventDefault()
		browserHistory.push("/profile")
	}

	signup(e) {
		if (!!e) e.preventDefault()
		browserHistory.push("/")
		this.props.showSignup()
	}

	reset_password(e) {
		if (!!e) e.preventDefault()

		const form = this.validateForm()
		if (!!!form)
			return

		// TODO: put this in the actions?
		fetch("/api/reset_password", {
			method: "POST",
			body: JSON.stringify(form),
			headers:{ "Content-Type" : "application/json" },
			credentials: 'include' })
		.then((res) => {
			if (res.ok) {
				this.setState({password_reset: true})
			} else {
				res.text().then((text) => this.setState({error_msg: "Failed to reset password: " + text}));
			}
		});
	}

	resetForm() {
			const buttonClasses = "login-submit btn btn-primary " + ((this.state.login_wait) ? "disabled" : "");

			return (<form onSubmit={ this.reset_password.bind(this) }>
				<input type="text" className="form-control login-field" name="email" ref="email" placeholder="Email" autoFocus="true" />
				<input type="password" className="form-control login-field" name="password" ref="password" placeholder="Password" />
				<input type="password" className="form-control login-field" name="password_confirm" ref="password_confirm" placeholder="Confirm Password" />
				<button type="submit" name="login-btn" className={buttonClasses} id="reset-btn" value="Reset" onClick={ this.reset_password.bind(this) }>Reset password</button>
			</form>)
	}

	resetFooter() {
		const spinnerVis = (this.state.login_wait) ? (<img style={{ float: "left" }} src={spinner} alt="spinner" />) : undefined;
		const error_msg = this.state.error_msg;

		return (<div>{ spinnerVis }
					<div className="login-help">
						<div className={ "alert alert-danger " + (!!error_msg ? "visible" : "hidden") } role="alert">{ error_msg }</div>
					</div>
					<a href="" onClick={ this.sendReset.bind(this) }>Send reset email</a> -&nbsp;
					<a href="" onClick={ this.login.bind(this) }>Login</a> -&nbsp;
					<a href="" onClick={ this.signup.bind(this) }>Register</a>
				</div>)
	}

	render() {
		return (<div className="homemain">
			<label>Reset your password</label>
			{ this.resetForm() }
			<div className="footer">
				{ this.resetFooter() }
			</div>
		</div>);
	}
}

const mapStateToProps = (state, myprops) => ({
})

const mapDispatchToProps = (dispatch, props) => ({
	showReset : () => dispatch(resetPassword()),
	showLogin : () => dispatch(showLogin()),
	showSignup : () => dispatch(showSignup()),
})

export default ResetPasswordForm = connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm)