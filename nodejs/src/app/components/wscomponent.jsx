import React, { Component } from 'react'
import { getWebSocketAddr, setWebsocket, registerSocket, checkLoginStatus } from '../actions'
import cookie from 'react-cookie'
import Websocket from './websocket';
import toastr from 'toastr'
import { auth_user } from './helpers'
import { connect } from 'react-redux'

class WSComponent extends Component {
  state = { }

  componentDidMount() {
    this.getWebSocketAddr()
    this.props.setWebsocket(this)
    this.state = { pingpong : setInterval(this.pingpong.bind(this), 60000) }
  }

  componentWillUnmount() {
    this.props.setWebsocket(undefined)
    clearInterval(this.state.pingpong)
  }

  getWebSocketAddr() {
    // this seems like a thing to put in actions...but really it's only us that manages this bit, so why bother?
    try {
      fetch("/api/wsaddr").then((res) => {
        if (!res.ok) {
          this.setState({wsaddr_timer: setTimeout(() => { this.getWebSocketAddr() }, 5000)})
          toastr.error("Error connecting to server, retrying", undefined, { preventDuplicates : true, timeout: 0 })
          return undefined
        } else {
          return res.json()
        }
      }).then((res) => {
        if (!!res)
          this.setState({wsaddr: res.address})
      })
    } catch (e) {
      console.log(e)
    }
  }

  getRawSocket() {
    return this.refs.websocket.state.ws
  }

  send(message, type = "USER_MESSAGE", displayType: undefined, duration = undefined) {
    const ws = this.getRawSocket()
    if (!!ws && ws.readyState === 1)
      ws.send(JSON.stringify({type: type, messageText: message, displayType: undefined, duration: duration}));
    else {
      console.log("Could not send to socket: " + ((!!!ws) ? "socket undefined" : "readyState = " + ws.readyState))
    }
  }

  ping() {
    this.send(undefined, "PING");
  }

  pingpong() {
    try {
      this.ping(this.refs.websocket)
    } catch (e) {
    }
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
    toastr.error("Socket disconnected, retrying...", { timeout: 0, preventDuplicates: true } )
  }

  subscribe(res) {
    this.send("MAIN SUBSCRIBE " + res.uuid, "BROADCAST_MESSAGE")
  }

  render() {
    if (!!this.state.wsaddr)
      return <Websocket ref="websocket" url={ this.state.wsaddr }
              onMessage={this.handleData.bind(this)} onConnect={this.handleConnect.bind(this)}
              onClose={this.handleClose.bind(this)} />
    else
      return <div></div>
  }
}

const mapStateToProps = (state, myprops) => ({
    login_data : auth_user(state),
})

const mapDispatchToProps = (dispatch, myprops) => ({
  setWebsocket: (ws) => { dispatch(setWebsocket(ws)) },
  checkLogin : (after) => { dispatch(checkLoginStatus(after)); },
  getWebSocketAddr : () => { dispatch(getWebSocketAddr()) },
  registerSocket: (sockid) => { dispatch(registerSocket(sockid)) }
});

export default WSComponent = connect(mapStateToProps, mapDispatchToProps)(WSComponent)
