import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Signin from './signin';

export default class AuthNavbar extends Component {
    static propTypes = {
   		authenticated: PropTypes.bool.isRequired
    };

    signedInRows = this.signedInRows.bind(this);
    signedOutRows = this.signedOutRows.bind(this);

    signedInRows() {
    	return [ (<li key="signout"><Link to="/signout">Sign out<span className="sr-only">(current)</span></Link></li>),
       		  	 (<li key="myprofile"><Link to="/profile">My profile<span className="sr-only">(current)</span></Link></li>) ];
    }

    signedOutRows() {
    	return [ (<li key="signin"><a href="#" data-toggle="modal" data-target="#login-modal">Sign in<span className="sr-only">(current)</span></a></li>),
                 (<li key="signup"><Link to="/signup">Sign up<span className="sr-only">(current)</span></Link></li>) ];
    }
    render() {
		const varRows = (this.props.authenticated) ? this.signedInRows() : this.signedOutRows();

        return (
              <ul className="nav navbar-nav navbar-right">
              	{ varRows }
                <li><Link to="/feedback">Feedback<span className="sr-only">(current)</span></Link></li>
                <Signin />
              </ul>
            );
    }
};
