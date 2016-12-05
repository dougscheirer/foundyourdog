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
import { ws_ping, ws_send, auth_user } from './helpers'
import { setWebsocket } from '../actions'

class MainLayout extends React.Component {

  state = { }

  componentDidMount() {
    this.props.setWebsocket(this.refs.websocket.state.ws)
    this.props.checkLogin(this.subscribe.bind(this));
    this.state = { pingpong : setInterval(() => { ws_ping(this.props.websocket) }, 60000) }
  }

  componentWillUnmount() {
    this.props.setWebsocket(undefined)
    clearInterval(this.state.pingpong)
  }

  handleData(data) {
    const result = JSON.parse(data)
    if (!!!result) return
    switch (result.type) {
      case "PONG":
        return;
      case "USER_MESSAGE": {
        const options = { "positionClass": "toast-top-left", "timeOut": "0", "closeButton" : true }
        toastr.info(result.messageText, "USER MESSAGE", options)
        return;
      }
      case "BROADCAST_MESSAGE": {
        const options = { "positionClass": "toast-top-center", "timeout" : "0", "closeButton" : true }
        toastr.success(result.messageText, "BROADCAST MESSAGE", options)
        return;
      }
      default:
        console.log(result.messageText)
    }
  }

  subscribe(res) {
    ws_send(this.props.websocket, "MAIN SUBSCRIBE " + res.uuid, "BROADCAST_MESSAGE")
  }

  createToastContainer(id) {
    return (<div id={ id } aria-live polite role="alert"></div>)
  }

  render() {
    toastr.options = { "positionClass": "toast-top-left", "timeOut": "5000" }

    // TODO: this should come from somewhere...
    const wsAddress = "ws://localhost:4567/ws"
    return (
      <div className="app">
        <LoginPopup />
        <Signup />
        <DevTools />
        <ShowInfoCard />
        <SendNotification />
        <Websocket ref="websocket" url={ wsAddress } onMessage={this.handleData.bind(this)}/>
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
  login_data : auth_user(state),
  websocket: state.reducerOne.websocket
})

const mapDispatchToProps = (dispatch, myprops) => ({
  checkLogin : (after) => { dispatch(checkLoginStatus(after)); },
  setWebsocket: (ws) => { dispatch(setWebsocket(ws)) }
});

export default MainLayout = connect(mapStateToProps, mapDispatchToProps)(MainLayout);
