import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { showIncidentInfo } from '../actions';
import spinner from '../../spinner.svg';
import $ from 'jquery';
import no_image from '../../noimage.svg'

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
			return ("");
	}

	getNameRow(name) {
		if (!!name)
			return (<tr><td>Name</td><td>{ name }</td></tr>)
		else
			return("")
	}

	imageOrEmpty(incident_info) {
		const source = (!!incident_info.image && !!incident_info.image.uuid) ?
					"/api/images/" + incident_info.image.uuid :
					no_image;

			return (<img style={{display:"block", margin:"auto", width: "200px"}}
						 src={ source }
						 alt="dog" />)
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

		const image = this.imageOrEmpty(incident_info);

		return (
			<Modal isOpen={!!incident_info} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
			  <ModalHeader>
			    <ModalClose onClick={ this.hideModal.bind(this) }/>
			    <ModalTitle>Info for { !!incident_info.dog.name ? incident_info.dog.name : "unknown" }</ModalTitle>
			  </ModalHeader>
			  <ModalBody>
		  		<div>
					{ image }
				</div>
				<div>
					<p></p>
	            	<p>Reported <strong>{ incident_info.state === 'found' ? "found" : "lost" }</strong>
	            			{ " on " }<strong>{ Date(incident_info.incident.incident_date) }</strong>
			            	{!!incident_info.incident.resolution ? "(" + incident_info.incident.resolution + ")" : ""}
			            	<button style={{marginLeft: "20px"}} className="btn btn-default" onClick={ (e) => this.onContact.bind(this) }>
			            			{ "Contact " + (incident_info.state === 'found' ? "finder" : "owner") }
			            	</button></p>
				    <table width="100%">
		            	<thead>
		            		<tr><th>Dog profile</th></tr>
		            	</thead>
		            	<tbody>
							{ this.getNameRow(incident_info.dog.name) }
							<tr><td>Breed</td><td>{ incident_info.dog.basic_type }</td></tr>
							<tr><td>Color</td><td>{ incident_info.dog.color }</td></tr>
							{ this.getBreedingStatusRow(incident_info.dog.intact) }
							<tr><td>Added on</td><td>{ Date(incident_info.dog.added_date) }</td></tr>
							<tr><td></td><td>{ incident_info.dog.tags }</td></tr>
    	            	</tbody>
		            </table>
				</div>
	 	  </ModalBody>
		  <ModalFooter>
		  </ModalFooter>
		</Modal>);
	}
}

ShowInfoCard.propTypes = {
}

const mapStateToProps = (state, ownProps) => ({
	incident_info: state.incident_info
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	hide : () => { dispatch(showIncidentInfo(undefined)); }
});

export default ShowInfoCard=connect(mapStateToProps, mapDispatchToProps)(ShowInfoCard);
