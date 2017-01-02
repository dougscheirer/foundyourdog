import React from 'react'

class Websocket extends React.Component {

    constructor(props) {
        super(props);
        this.state = { ws: undefined, attempts: 1};
    }

    getRawSocket() {
      return this.state.ws
    }

    logging(logline) {
        if (this.props.debug === true) {
            console.log(logline);
        }
    }

    generateInterval (k) {
      return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
    }

    setupWebsocket() {
        let websocket = new WebSocket(this.props.url, (!!this.props.protocol ? this.props.protocol : []))
        this.setState({ws: websocket});

        websocket.onopen = () => {
          this.logging('Websocket connected');
          this.setState({attempts: 1})
          if (!!this.props.onConnect)
            this.props.onConnect(this)
        };

        websocket.onmessage = (evt) => {
          this.props.onMessage(evt.data);
        };

        websocket.onclose = () => {
          this.logging('Websocket disconnected');
          if (!!this.props.onClose)
            this.props.onClose(this)

          if (this.props.reconnect) {
            let time = this.generateInterval(this.state.attempts);
            setTimeout(() => {
              this.setState({attempts: this.state.attempts+1});
              this.setupWebsocket();
            }, time);
          }
        }
    }

    componentDidMount() {
      this.setupWebsocket();
    }

    componentWillUnmount() {
      let websocket = this.state.ws;
      websocket.close();
    }

    render() {
      return (
        <div></div>
      );
    }
}

Websocket.defaultProps = {
    debug: false,
    reconnect: true
};

Websocket.propTypes = {
    url: React.PropTypes.string.isRequired,
    onMessage: React.PropTypes.func.isRequired,
    debug: React.PropTypes.bool,
    reconnect: React.PropTypes.bool,
    onConnect: React.PropTypes.func,
    onClose: React.PropTypes.func,
    protocol: React.PropTypes.string
};

export default Websocket;

