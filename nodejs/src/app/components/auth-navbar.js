import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { showLogin } from '../actions';
import { connect } from 'react-redux';

class AuthNavbar extends Component {
    static propTypes = {
   		authenticated: PropTypes.bool.isRequired
    };

    handleSignin(e) {
      e.preventDefault();
      this.props.onSignin();
    }

    handleSignout(e) {
      e.preventDefault();
      this.props.onSignout();
    }

    handleSignup(e) {
      e.preventDefault();
      this.props.onSignup();
    }

    signedInRows() {
    	return [ (<li key="signout"><a href="" onClick={ this.handleSignout.bind(this) }>Sign out<span className="sr-only"></span></a></li>),
       		  	 (<li key="myprofile"><Link to="/profile">My profile<span className="sr-only"></span></Link></li>) ];
    }

    signedOutRows() {
    	return [ (<li key="signin"><a href="" onClick={ this.handleSignin.bind(this) }>Sign in<span className="sr-only"></span></a></li>),
               (<li key="signup"><a href="" onClick={ this.handleSignup.bind(this) }>Sign up<span className="sr-only"></span></a></li>) ];
    }
    render() {
		const varRows = (this.props.authenticated) ? this.signedInRows() : this.signedOutRows();

        return (
              <ul className="nav navbar-nav navbar-right">
              	{ varRows }
                <li><Link to="/feedback">Feedback<span className="sr-only">(current)</span></Link></li>
              </ul>
            );
    }
};

const mapStateToProps = (state, myprops) => ({
  authenticated: state.login_status === 'success'
});

const mapDispatchToProps = (dispatch, myprops) => ({
  onSignin    : () => { dispatch(showLogin('login')); },
  onSignup    : () => { dispatch(showLogin('signup')); },
  onSignout    : () => { dispatch(showLogin(undefined)); }
});

export default AuthNavbar = connect(mapStateToProps, mapDispatchToProps)(AuthNavbar);