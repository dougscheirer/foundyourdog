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

class ShowInfoCard extends Component {

	state = {
	}

	hideModal() {
		this.props.hide();
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

		return (
			<Modal isOpen={!!incident_info} onRequestHide={ this.hideModal.bind(this) } dialogStyles={dialogStyles}>
			  <ModalHeader>
			    <ModalClose onClick={ this.hideModal.bind(this) }/>
			    <ModalTitle>Info for { "dog name" }</ModalTitle>
			  </ModalHeader>
			  <ModalBody>
		  		<div>
					<img style={{display:"block", margin:"auto", width: "200px"}} src={ "/api/images/" + incident_info.image.uuid } alt="dog" />
				</div>
				<div>
					<div>
			            <table width="100%">
			            	<thead>
			            		<tr><th>Report details</th></tr>
			            	</thead>
			            	<tbody>
			            		<tr><td>Date</td><td>{ incident_info.incident.incident_date }</td></tr>
			            		<tr><td>Status</td><td>{ incident_info.incident.state }</td></tr>
			            		<tr><td>Resolution</td><td>{ incident_info.incident.resolution }</td></tr>
			            		<tr><td>Reporter</td><td>Contact reporter</td></tr>
			            	</tbody>
			            </table>
					</div>
					<div>
					    <table width="100%">
			            	<thead>
			            		<tr><th>Dog profile</th></tr>
			            	</thead>
			            	<tbody>
								<tr><td>Basic type</td><td>{ incident_info.dog.basic_type }</td></tr>
								<tr><td>Color</td><td>{ incident_info.dog.color }</td></tr>
								<tr><td>Breeding status</td><td>{ incident_info.dog.intact }</td></tr>
								<tr><td>Name</td><td>{ incident_info.dog.name }</td></tr>
								<tr><td>Added on</td><td>{ incident_info.dog.added_date }</td></tr>
								<tr><td>Tags</td><td>{ incident_info.dog.tags }</td></tr>
								<tr><td>Owner</td><td>Contact owner</td></tr>
	    	            	</tbody>
			            </table>
					</div>
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
