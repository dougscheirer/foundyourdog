import React, { Component } from 'react';

export default class Signin extends Component {
  render() {
    return (
				<div className="modal fade" id="login-modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" 
					 style={{ display: 'none'}}>
				    	  <div className="modal-dialog">
								<div className="loginmodal-container">
									<h1>Sign in to your account</h1><br />
								  <form>
									<input type="text" name="user" placeholder="Username" />
									<input type="password" name="pass" placeholder="Password" />
									<input type="submit" name="login" className="login loginmodal-submit" value="Login" />
								  </form>

								  <div className="login-help">
									<a href="#">Register</a> - <a href="#">Forgot Password</a>
								  </div>
								</div>
							</div>
						  </div>
		);
  }
};
