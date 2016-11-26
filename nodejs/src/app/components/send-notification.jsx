import React, { Component } from 'react'
import { sendNotification } from '../actions'
import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalBody,
	ModalFooter
} from 'react-modal-bootstrap';
import { connect } from 'react-redux'

class SendNotification extends Component {
	hideModal(e) {
		if (!!e) { 
			e.preventDefault();
		}
		this.props.clearSendMessage()
	}

	sendMessage(e) {
		e.preventDefault();
		// send it
	}

	render() {
		const dialogStyles = {
			base: {
				transition: "right 0.4s"
			},
			open: {
				right: 0
			}
		}
		const notification_data = this.props.notification_data;

		if (!!!notification_data) {
			return (<div></div>)
		}

		return (
			<Modal isOpen={true} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
				<ModalHeader>
					<ModalClose onClick={ this.hideModal.bind(this) }/>
					<ModalTitle>Send a message</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div>
					<textarea style={{width:"100%"}} name="message" rows="5"></textarea>
					<button className="btn btn-default disabled" onClick={ this.sendMessage.bind(this) }>Send</button>
					</div>
				</ModalBody>
				<ModalFooter>
				</ModalFooter>
			</Modal>);
	}
}

const mapStateToProps = (state, myprops) => ({
	notification_data: state.notification_data
})

const mapDispatchToProps = (dispatch, props) => ({
	clearSendMessage: () => { dispatch(sendNotification()) }
});

export default SendNotification = connect(mapStateToProps, mapDispatchToProps)(SendNotification)
