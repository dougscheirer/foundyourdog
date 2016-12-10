import React, { Component } from 'react'
import { postMessage, getConversation } from '../actions'
import { connect } from 'react-redux'
import './chat.css'
import loading from './loading.svg'
import { auth_user, waiting_login, humanDaytime } from './helpers'
import moment from 'moment'
import { LoginView } from './login'
import { browserHistory } from 'react-router'

class Conversation extends Component {
	state = {}
	componentDidMount() {
		this.refreshConversation()
	}

	refreshConversation(from_ordinal = 0) {
		this.setState({fetch_result: undefined})
		this.props.getConversation(this.props.params.incident, this.props.params.message_id, from_ordinal, this.loadFailed.bind(this))
	}

	loadFailed(res) {
		this.setState({fetch_result: res})
	}

	formatMessage(yourMessage, message) {
		const time = (<span className="message-timestamp">{ humanDaytime(message.sent_date) }</span>)
		const msg = (<span className="message-text">{ message.message }</span>)
		if (yourMessage)
			return (<div>{ msg } { time } </div>)
		else
			return (<div>{ time } { msg }</div>)
	}

	dateChanged(last, cur) {
		const lastM = moment(last), curM = moment(cur)
		return (lastM.year() !== curM.year() || lastM.dayOfYear() !== curM.dayOfYear())
	}

	sendMessage(e) {
		e.preventDefault()
		const message = this.refs.message.value.trim();
		if (!!!message)
			return;
		const postData = {
		    receiver_id : this.props.conversation.conversation.partner_id,
    		message : message,
    		incident_id : this.props.params.incident,
		}
		this.refs.message.value = ""
		this.props.postMessage(postData)
		this.refreshConversation()
	}

	returnToNotifications(e) {
		e.preventDefault();
		browserHistory.push("/profile/notifications")
	}

	render() {
		// determine login status?
		if (!!this.props.waiting_login)
			return (<div>
				<img alt="loading" style={{display:"block",margin: "0 auto"}} src={ loading }></img>
				</div>)

		// not logged in?
		if (!!!this.props.login_data)
			return (<LoginView />)

		// failed?
		if (!!this.state.fetch_result) {
			return (<div>
			<div className="container">
			<div className="row">
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
					<a onClick={ this.returnToNotifications.bind(this) }>
						<span className="glyphicon glyphicon-chevron-left back-to-notifications" />
						Back to notifications
					</a>
				</div>
			</div>
			</div>
			<div className="container">
			<div className="row">
				<div className="col-sm-12" style={{textAlign:"center", lineHeight: "4"}}><strong>Failed to load conversation</strong></div>
			</div>
			</div>
			</div>)
		}

		// waiting on page load?
		if (!!!this.props.conversation)
			return (<div>
				<img alt="loading" style={{display:"block",margin: "0 auto"}} src={ loading }></img>
				</div>)

		let lastTime = 0
		const rows = this.props.conversation.conversation.messages.map((val,key) => {
			const divider = this.dateChanged(lastTime, val.sent_date) ?
				(<div className="chat-divider"><span>{ moment(val.sent_date).format("ddd MMM Do YYYY") }</span></div>) :
				(<div></div>)

			lastTime = val.sent_date
			let className = "col-sm-6 bubble "
			const yourMessage = (val.sender_id === this.props.login_data.uuid)
			if (yourMessage)
				className += "bubble-alt green"
			return (<div className="row" key={ key }>
								{ divider }
								<div className={ className }>
									{ this.formatMessage(yourMessage, val) }
								</div>
							</div>)
		})

		return (<div>
			<div className="container">
			<div className="row">
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
					<a onClick={ this.returnToNotifications.bind(this) }>
						<span className="glyphicon glyphicon-chevron-left back-to-notifications" />
						Back to notifications
					</a>
				</div>
			</div>
			</div>
			<div className="container">
			<div className="row">
				<div className="col-sm-12" style={{textAlign:"center", lineHeight: "4"}}>Conversation between <strong>You</strong> and <strong>{ this.props.conversation.conversation.partner_handle }</strong></div>
			</div>
			</div>
			<div className="container">
			<div className="row">
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
					<form>
						<textarea ref="message" rows="3"
							style={{resize: "none", width:"85%", lineHeight:"2", marginRight: "20px"}}
							placeholder="Send a message"></textarea>
						<button onClick={ this.sendMessage.bind(this) } style={{position:"absolute"}} className="btn btn-primary">Send</button>
					</form>
					<div style={{float:"left"}}>{ this.props.conversation.conversation.partner_handle }</div>
					<div style={{float:"right"}}> You </div>
				</div>
				<div className="col-sm-3"></div>
			</div>
			</div>
			<div className="container">
			<div className="row">
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
					{ rows }
				</div>
				<div className="col-sm-3"></div>
			</div>
			</div>
			</div>)
	}
}

const mapStateToProps = (state, myprops) => ({
	conversation: state.messages.conversation,
	waiting_login: waiting_login(state),
	login_data: auth_user(state),
  new_message_data: state.messages.new_message_data
})

const mapDispatchToProps = (dispatch, props) => ({
	getConversation : (incident_id, msg_id, from_ordinal, failed) => { dispatch(getConversation(incident_id, msg_id, from_ordinal, failed)) },
	postMessage : (data) => { dispatch(postMessage(data)) }
})

export default Conversation = connect(mapStateToProps, mapDispatchToProps)(Conversation)