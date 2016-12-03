import React, { Component } from 'react'
import { sendMessage, postMessage } from '../actions'
import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalBody,
	ModalFooter
} from 'react-modal-bootstrap';
import { connect } from 'react-redux'
import { humanTimestamp } from './helpers'

class SendNotification extends Component {
	state = {
		submit: false,
		submitting: false
	}

	hideModal(e) {
		if (!!e) {
			e.preventDefault();
		}
		this.props.clearSendMessage()
		this.setState({ submit: false })
	}

	sendMessage(e) {
		e.preventDefault();
		// send it
		this.setState({submitting: true})
		const incident = this.props.notification_data.incident
		const postData = {
		    receiver_id : incident.reporter_id,
    		message : this.refs.message_input.value,
    		incident_id : incident.uuid,
		}

		this.props.postMessage(postData)
	}

	messageChanged(e) {
		this.setState({ submit: (!!this.refs.message_input.value) })
	}

	render() {
		const dialogStyles = {
			base: {
				transition: "left 0.4s"
			},
			open: {
				right: 0
			}
		}
		const notification_data = this.props.notification_data;

		if (!!!notification_data) {
			return (<div></div>)
		}

		const dog_name = "(name or unknown)"
		const state = notification_data.incident.state;
		const incident_date = humanTimestamp(notification_data.incident.incident_date)

		const btnClassNames = "btn btn-primary " + (!!!this.state.submit && !!!this.state.submitting ? "disabled" : "")
		let editClassStyles = { width: "100%", resize: "vertical" }
		if (!!this.state.submitting)
			editClassStyles = {...editClassStyles, disabled: "true" }

		return (
			<Modal isOpen={true} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
				<ModalHeader>
					<ModalClose onClick={ this.hideModal.bind(this) }/>
					<ModalTitle>Send a message</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<form>
					<label>Regarding the dog { dog_name } reported { state} on { incident_date }</label>
					<textarea style={ editClassStyles }
						name="message"
						rows="5"
						onChange={ this.messageChanged.bind(this) }
						ref="message_input"
						placeholder="Send contact info or arrange a place nearby to meet">
					</textarea>
					<button className={btnClassNames} onClick={ this.sendMessage.bind(this) } >Send</button>
					</form>
				</ModalBody>
				<ModalFooter>
				</ModalFooter>
			</Modal>);
	}
}

const mapStateToProps = (state, myprops) => ({
	notification_data: state.messages.notification_data
})

const mapDispatchToProps = (dispatch, props) => ({
	clearSendMessage: () => { dispatch(sendMessage()) },
	postMessage : (postData) => { dispatch(postMessage(postData)) }
});

export default SendNotification = connect(mapStateToProps, mapDispatchToProps)(SendNotification)
