import React, { Component } from 'react'
import { getConversation } from '../actions'
import { connect } from 'react-redux'
import { auth_user } from './helpers'
import './chat.css'
import loading from './loading.svg'

class Conversation extends Component {
	componentDidMount() {
		this.props.getConversation(this.props.params.incident, this.props.params.message_id)
	}

	render() {
		if (!!!this.props.conversation || !!!this.props.login_data)
			return (<div><img  style={{display:"block",margin: "0 auto"}} src={ loading }></img></div>)

		const rows = this.props.conversation.conversation.messages.map((val,key) => {
			let className = "col-sm-6 bubble "
			if (val.sender_id === this.props.login_data.uuid)
				className += "bubble-alt green"
			return (<div className="row" key={ key }>
								<div className={ className }>
									{ val.message }
								</div>
							</div>)
		})

		return (<div className="container">
			<div className="row">
				<div className="col-sm-12" style={{textAlign:"center"}}>Conversation between <strong>You</strong> and <strong>{ this.props.conversation.conversation.partner_handle }</strong></div>
			</div>
			<div className="row">
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
				<div style={{float:"left"}}>{ this.props.conversation.conversation.partner_handle }</div>
				<div style={{float:"right"}}> You </div>
				</div>
				<div className="col-sm-3"></div>
			</div>
			<div className="col-sm-3"></div>
			<div className="col-sm-6">
			{ rows }
			</div>
			<div className="col-sm-3"></div>
			<div className="row">
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
					<form>
						<input type="text" placeholder="Send a message"></input>
						<button className="btn btn-primary">Send</button>
					</form>
				</div>
				<div className="col-sm-3"></div>
			</div>
			</div>)
	}
}

const mapStateToProps = (state, myprops) => ({
	conversation: state.messages.conversation,
	login_data: auth_user(state)
	// TODO: add in a "new message" handler somehow
})

const mapDispatchToProps = (dispatch, props) => ({
	getConversation : (incident_id, msg_id) => { dispatch(getConversation(incident_id, msg_id)) }
})

export default Conversation = connect(mapStateToProps, mapDispatchToProps)(Conversation)