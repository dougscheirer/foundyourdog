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
import { humanTimestamp, logged_in } from './helpers'
import { LoginPopup } from './login'

class SendMessage extends Component {
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
		const incident = this.props.message_data.incident
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
		const message_data = this.props.message_data;

		if (!!!message_data) {
			return (<div></div>)
		}

		const dog_name = "(name or unknown)"
		const state = message_data.incident.state;
		const incident_date = humanTimestamp(message_data.incident.incident_date)

		const btnClassNames = "button btn btn-primary " + (!!!this.state.submit && !!!this.state.submitting ? "disabled" : "")
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
					<a className={btnClassNames} onClick={ this.sendMessage.bind(this) } >Send</a>
					</form>
				</ModalBody>
				<ModalFooter>
				</ModalFooter>
			</Modal>);
	}
}

const mapStateToProps = (state, myprops) => ({
	message_data: state.messages.message_data,
	logged_in: logged_in(state)
})

const mapDispatchToProps = (dispatch, props) => ({
	clearSendMessage: () => { dispatch(sendMessage()) },
	postMessage : (postData) => { dispatch(postMessage(postData)) }
});

export default SendMessage = connect(mapStateToProps, mapDispatchToProps)(SendMessage)
