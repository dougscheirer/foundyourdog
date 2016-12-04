import React from 'react';
import { Link } from 'react-router';
import 'bootstrap-loader';
import AuthNavbar from './auth-navbar';
import { LoginPopup } from './login';
import Signup from './signup';
import { connect } from 'react-redux';
import { checkLoginStatus } from '../actions';
import DevTools from '../devtools';
import ShowInfoCard from './info-card'
import SendNotification from './send-notification'
import toastr from 'toastr'
import Websocket from 'react-websocket';

class MainLayout extends React.Component {

  componentDidMount() {
    this.props.checkLogin();
  }

  handleData(data) {
    const result = JSON.parse(data)
    toastr.message(result.userMessage)
  }

  render() {
    toastr.options = { "positionClass": "toast-top-center" }
    const wsAddress = "ws://" + location.host + "/ws"
    return (
      <div className="app">
        <LoginPopup />
        <Signup />
        <DevTools />
        <ShowInfoCard />
        <SendNotification />
        <Websocket url={ wsAddress } onMessage={this.handleData.bind(this)}/>
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
    );
  }
}

const mapStateToProps = (state, myprops) => ({
})

const mapDispatchToProps = (dispatch, myprops) => ({
  checkLogin : () => { dispatch(checkLoginStatus()); }
});

export default MainLayout = connect(mapStateToProps, mapDispatchToProps)(MainLayout);
