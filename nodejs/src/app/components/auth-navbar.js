import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { showSignup, showLogin, logout } from '../actions';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'
import { logged_in, auth_user } from './helpers'

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

    getMessageCount() {
      // TODO: display the message count that the server returns
      return (!!!this.props.unread || this.props.unread <= 0) ? undefined :
        (<div className="numberCircle">
          { this.props.unread }
        </div>);
    }

    signedInRows() {
    	return [ (<li key="myprofile"><Link to="/profile">{ this.props.userInfo.handle }&rsquo;s profile{ this.getMessageCount() }<span className="sr-only"></span></Link></li>),
              (<li key="signout"><a href="" onClick={ this.handleSignout.bind(this) }>Sign out<span className="sr-only"></span></a></li>) ];
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
  authenticated: logged_in(state),
  userInfo : auth_user(state),
  unread: state.messages.unread
});

const mapDispatchToProps = (dispatch, myprops) => ({
  onSignin    : () => { dispatch(showLogin()); },
  onSignup    : () => { dispatch(showSignup()); },
  onSignout    : () => { dispatch(logout()); browserHistory.push("/") }
});

export default AuthNavbar = connect(mapStateToProps, mapDispatchToProps)(AuthNavbar);