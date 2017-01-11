import React, { Component } from 'react'
import { newMessage,
         getWebSocketAddr,
         setWebsocket,
         registerSocket,
         checkLoginStatus,
         setUnreadMessages,
         clearPostLoginActions } from '../actions'
import cookie from 'react-cookie'
import Websocket from './websocket';
import toastr from 'toastr'
import { getUserData, processPostLoginActions } from './helpers'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

class WSComponent extends Component {
  state = { }

  componentDidMount() {
    this.getWebSocketAddr()
    this.props.setWebsocket(this)
    this.state = { pingpong : setInterval(this.pingpong.bind(this), 10000) }
  }

  componentWillUnmount() {
    this.props.setWebsocket(undefined)
    clearInterval(this.state.pingpong)
  }

  getWebSocketAddr() {
    try {
      // TODO: either make dev mode forward websockets, or switch to pusher
      const useSSL = window.location.protocol === "https:"
      fetch("/api/wsaddr?ssl=" + useSSL + "&host=" + window.location.hostname,
        { credentials: 'include' }).then((res) => {
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

  toastMessage(data) {
      if (data.broadcast) {
        const options = { "timeout" : data.duration || 5000, "closeButton" : true }
        toastr.success(data.message, "BROADCAST MESSAGE", options)
      }
      else {
        const options = { "timeOut": data.duration || 0, "closeButton" : true }
        toastr.info(data.message, "USER MESSAGE", options)
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
        this.props.checkLogin(() => {
          processPostLoginActions(this.props.postLoginActions);
          this.props.clearPostLoginActions();
        });
        break;
      case "SYSTEM_MESSAGE":
        if (process.env.NODE_ENV === 'development') {
          this.toastMessage(result.data)
          console.log(result.data)
        }
        break
      case "USER_MESSAGE":
        this.toastMessage(result.data)
        break
      case "NEW_MESSAGE":
        // display a toast if the meesage fromHandle is not you
        if (!!this.props.login_data && !!result.data.fromHandle && this.props.login_data.handle !== result.data.fromHandle) {
          const options = { onclick: () => {
            console.log("clicked a toast link")
            browserHistory.push("/conversation/" + result.data.incidentID + "/" + result.data.messageID) }
          }
          toastr.info("You have a new message from " + result.data.fromHandle, undefined, options)
        }
        // refresh conversation?
        if (!!this.props.conversation && this.props.conversation.incident === result.data.incidentID)
          this.props.newMessage(result.data, this.props.conversation.conversation.messages[0].ordinal);
        // refresh unread count?
        if (result.data.unread >= 0) {
          this.props.setUnreadMessages(result.data.unread)
        }
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
    login_data : getUserData(state),
    conversation: state.messages.conversation,
    postLoginActions: state.login.post_login_actions
})

const mapDispatchToProps = (dispatch, myprops) => ({
  setWebsocket: (ws) => { dispatch(setWebsocket(ws)) },
  checkLogin : (after) => { dispatch(checkLoginStatus(after)); },
  getWebSocketAddr : () => { dispatch(getWebSocketAddr()) },
  registerSocket: (sockid) => { dispatch(registerSocket(sockid)) },
  newMessage: (message_data, ordinal) => { dispatch(newMessage(message_data, ordinal)); },
  clearPostLoginActions: () => { dispatch(clearPostLoginActions()) },
  setUnreadMessages: (unread) => dispatch(setUnreadMessages(unread))
});

export default WSComponent = connect(mapStateToProps, mapDispatchToProps)(WSComponent)
