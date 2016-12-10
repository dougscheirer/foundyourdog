import React, { Component } from 'react'
import { newMessage,
         getWebSocketAddr,
         setWebsocket,
         registerSocket,
         checkLoginStatus } from '../actions'
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
    try {
      // TODO: either make dev mode forward websockets, or switch to pusher
      fetch("/api/wsaddr?host=" + window.location.hostname).then((res) => {
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

  send(type, data) {
    const ws = this.getRawSocket()
    if (!!ws && ws.readyState === 1)
      ws.send(JSON.stringify({type: type, data: data}));
    else {
      console.log("Could not send to socket: " + ((!!!ws) ? "socket undefined" : "readyState = " + ws.readyState))
    }
  }

  send_message(message, displayType = undefined, duration = undefined, broadcast = undefined) {
    this.send("USER_MESSAGE", {
        message: message,
        displayType: undefined,
        duration: duration,
        broadcast: broadcast});
  }

  ping() {
    this.send("PING");
  }

  pingpong() {
    try {
      this.ping(this.refs.websocket)
    } catch (e) {
    }
  }

  // our message format is:
  // { type: (type of message),
  //   data: { ...depends on type }
  // }
  handleData(data) {
    const result = JSON.parse(data)
    if (!!!result) return
    switch (result.type) {
      case "PONG":
        break;
      case 'REGISTER':
        this.props.registerSocket(result.data.id);
        cookie.save('ws', result.data.id, { path: '/' });
        this.props.checkLogin();
        break;
      case "USER_MESSAGE":
        if (result.data.broadcast) {
          const options = { "timeout" : result.data.duration || 5000, "closeButton" : true }
          toastr.success(result.data.message, "BROADCAST MESSAGE", options)
        }
        else {
          const options = { "timeOut": result.data.duration || 0, "closeButton" : true }
          toastr.info(result.data.message, "USER MESSAGE", options)
        }
        break;
      case "NEW_MESSAGE":
        // display a toast if the meesage fromHandle is not you
        if (!!this.props.login_data && this.props.login_data.handle !== result.data.fromHandle)
          toastr.info("<a href=\"/conversation/" + 
            result.data.incidentID + "/" + result.data.messageID + 
            "\">You have a new message from " + result.data.fromHandle + "</a>")
        // refresh conversation?
        if (this.props.conversation.incident === result.data.incidentID)
          this.props.newMessage(result.data, this.props.conversation.conversation.messages[0].ordinal);
        break;
      default:
        console.log(result.message)
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
    this.send_message("MAIN SUBSCRIBE " + res.uuid, "INFO", 0, true)
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
    conversation: state.messages.conversation
})

const mapDispatchToProps = (dispatch, myprops) => ({
  setWebsocket: (ws) => { dispatch(setWebsocket(ws)) },
  checkLogin : (after) => { dispatch(checkLoginStatus(after)); },
  getWebSocketAddr : () => { dispatch(getWebSocketAddr()) },
  registerSocket: (sockid) => { dispatch(registerSocket(sockid)) },
  newMessage: (message_data, ordinal) => { dispatch(newMessage(message_data, ordinal)); }
});

export default WSComponent = connect(mapStateToProps, mapDispatchToProps)(WSComponent)
