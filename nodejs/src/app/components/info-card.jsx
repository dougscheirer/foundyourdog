import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalBody,
	ModalFooter
} from 'react-modal-bootstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { showIncidentInfo } from '../actions';
import no_image from '../../noimage.svg'
import { logged_in, auth_user, humanTimestamp, optionalColor, coatDescription } from './helpers'

class ShowInfoCard extends Component {

	state = {
	}

	hideModal() {
		this.props.hide();
	}

	onContact(e) {
		e.preventDefault();
		// this.props.dispatch(contact_options(uuid));
	}

	getBreedingStatusRow(status) {
		if (!!status)
			return (<tr><td>Breeding status</td><td>{ status }</td></tr>);
		else
			return undefined
	}

	getNameRow(name) {
		if (!!name)
			return (<tr><td>Name</td><td>{ name }</td></tr>)
		else
			return undefined
	}

	imageOrEmpty(incident_info) {
		const source = (!!incident_info.image && !!incident_info.image.uuid) ?
		"/api/images/" + incident_info.image.uuid :
		no_image;

		return (<img style={{display:"block", margin:"auto", width: "200px"}}
			src={ source }
			alt="dog" />)
	}

	isLoggedInUser(id) {
		return (this.props.login_status && this.props.login_data.uuid === id)
	}

	getContactControl(incident) {
		const classes="btn btn-default " + (this.isLoggedInUser(incident.reporter_id) ? "disabled" : "")
		return (<button style={{marginLeft: "20px"}} className={ classes } onClick={ (e) => this.onContact.bind(this) }>
							{ "Contact " + (incident.state === 'found' ? "finder" : "owner") }
						</button>)
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
		const incident_info = this.props.incident_info;

		if (!!!incident_info) {
			return (<div></div>)
		}

		const incident = incident_info.incident;
		const dog = incident_info.dog;
		const image = this.imageOrEmpty(incident_info);

		return (
			<Modal isOpen={!!incident_info} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
				<ModalHeader>
					<ModalClose onClick={ this.hideModal.bind(this) }/>
					<ModalTitle>Info for &quot;{ !!dog.name ? dog.name : "unknown" }&quot;</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div>
						{ image }
					</div>
					<div>
						<p></p>
						<p>Reported <strong>{ incident.state === 'found' ? "found" : "lost" }</strong>
							{ " on " }<strong>{ humanTimestamp(incident.incident_date) }</strong>
							{!!incident.resolution ? "(" + incident.resolution + ")" : ""}
							{ this.getContactControl(incident) }
						</p>
						<table className="table">
							<thead>
								<tr><th>Dog profile</th></tr>
							</thead>
							<tbody>
								{ this.getNameRow(dog.name) }
								<tr><td>Breed</td><td>{ optionalColor(dog.primary_type, dog.secondary_type) }</td></tr>
								<tr><td>Coat</td><td>{ coatDescription(dog.primary_color, dog.secondary_color, dog.coat_type) }</td></tr>
								{ this.getBreedingStatusRow(dog.intact) }
								<tr><td>Reported on</td><td>{ humanTimestamp(incident.incident_date) }</td></tr>
								<tr><td></td><td>{ dog.tags }</td></tr>
							</tbody>
						</table>
					</div>
				</ModalBody>
				<ModalFooter>
				</ModalFooter>
			</Modal>);
	}
}

const mapStateToProps = (state, ownProps) => ({
	incident_info: state.incident_info,
	login_status: logged_in(state),
	login_data: auth_user(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	hide : () => { dispatch(showIncidentInfo(undefined)); }
});

export default ShowInfoCard=connect(mapStateToProps, mapDispatchToProps)(ShowInfoCard);
