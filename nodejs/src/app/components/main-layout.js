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
import Websocket from './websocket';
import { ws_ping, ws_send, auth_user } from './helpers'
import { getWebSocketAddr, setWebsocket, registerSocket, checkLoginStatus } from '../actions'
import cookie from 'react-cookie'

class WSComponent extends Component {
  componentDidMount() {
    this.props.setWebsocket(this.refs.websocket.state.ws)
    this.state = { pingpong : setInterval(() => { ws_ping(this.refs.websocket.state.ws) }, 60000) }
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
      case 'REGISTER':
        this.props.registerSocket(result.messageText);
        cookie.save('ws', result.messageText, { path: '/' });
        this.props.checkLogin();
        break;
      case "USER_MESSAGE": {
        const options = { "timeOut": result.duration || 0, "closeButton" : true }
        toastr.info(result.messageText, "USER MESSAGE", options)
        return;
      }
      case "BROADCAST_MESSAGE": {
        const options = { "timeout" : result.duration || 5000, "closeButton" : true }
        toastr.success(result.messageText, "BROADCAST MESSAGE", options)
        return;
      }
      default:
        console.log(result.messageText)
    }
  }

  handleConnect(ws) {
    if (!!this.props.login_data)
      this.subscribe(this.props.login_data)
  }

  handleClose(ws) {
    console.log("WS disconnected")
  }

  subscribe(res) {
    ws_send(this.props.websocket, "MAIN SUBSCRIBE " + res.uuid, "BROADCAST_MESSAGE")
  }

  render() {
    return <Websocket ref="websocket" url={ this.props.wsAddr }
              onMessage={this.handleData.bind(this)} onConnect={this.handleConnect.bind(this)}
              onClose={this.handleClose.bind(this)} />
  }
}

const mapWSDispatchToProps = (dispatch, myprops) => ({
  setWebsocket: (ws) => { dispatch(setWebsocket(ws)) },
  checkLogin : (after) => { dispatch(checkLoginStatus(after)); },
  registerSocket: (sockid) => { dispatch(registerSocket(sockid)) }
});

WSComponent = connect(undefined, mapWSDispatchToProps)(WSComponent)

class MainLayout extends Component {

  state = { }

  componentDidMount() {
    this.props.getWebSocketAddr()
  }

  websocketRender() {
    if (!!this.props.websocketAddr)
      return (<WSComponent wsAddr={ this.props.websocketAddr } />)
    else
      return (<div></div>)
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
        { this.websocketRender() }
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
  websocket: state.reducerOne.websocket,
  websocketAddr: state.reducerOne.websockAddr
})

const mapDispatchToProps = (dispatch, myprops) => ({
  getWebSocketAddr : () => { dispatch(getWebSocketAddr()) }
});

export default MainLayout = connect(mapStateToProps, mapDispatchToProps)(MainLayout);
