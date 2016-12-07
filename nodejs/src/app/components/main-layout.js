import React, { Component } from 'react';
import { Link } from 'react-router';
import 'bootstrap-loader';
import AuthNavbar from './auth-navbar';
import { LoginPopup } from './login';
import Signup from './signup';
import { connect } from 'react-redux';
import DevTools from '../devtools';
import ShowInfoCard from './info-card'
import SendNotification from './send-notification'
import toastr from 'toastr'
import WSComponent from './wscomponent'

class MainLayout extends Component {

  state = { }

  componentDidMount() {
  }

  render() {
    toastr.options = { "positionClass": "toast-top-left", "timeOut": "5000" }

    return (
      <div className="app">
        <LoginPopup />
        <Signup />
        <DevTools />
        <ShowInfoCard />
        <SendNotification />
        <WSComponent />
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/" className="navbar-brand">Found your dog!</Link>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li><Link to="/">Home</Link></li>
              </ul>
              <AuthNavbar authenticated={false} />
            </div>
          </div>
        </nav>

        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state, myprops) => ({
})

const mapDispatchToProps = (dispatch, myprops) => ({
});

export default MainLayout = connect(mapStateToProps, mapDispatchToProps)(MainLayout);
