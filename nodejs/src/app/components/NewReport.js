import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { DateField } from "react-date-picker";
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import 'react-date-picker/index.css';
import SimpleMap from "./simple_map";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { showLogin } from "../actions";

class NewFormBase extends Component {

	getSelected = 				this.getSelected.bind(this);
	handleValidateAndSubmit = 	this.handleValidateAndSubmit.bind(this);
	validate = 					this.validate.bind(this);
	uploadPhoto = 				this.uploadPhoto.bind(this);

	uploadPhoto(files) {
		console.log("TODO: photo upload");
	}

	requireLoginCheck() {
		if (!!!this.props.logged_in)
			this.props.onLoginRequired();
	}

	componentDidMount() {
		this.requireLoginCheck();
	}

	validate() {
		this.requireLoginCheck();

		const formdata = {
			date: 				this.refs.date.getInput().value,
			name: 				ReactDOM.findDOMNode(this.refs.name).value,
			basic_type: 		ReactDOM.findDOMNode(this.refs.basic_type).value,
			color: 				ReactDOM.findDOMNode(this.refs.color).value,
			other_info: 		ReactDOM.findDOMNode(this.refs.other_info).value,
			breeding_status: 	ReactDOM.findDOMNode(this.refs.breeding_status).value,
			gender: 			this.getSelected('gender')
		};

		// required: date, name (sometimes), basic_type, color
		let errors = false;
		if (!!!formdata.color) 		{ toastr.error('Color is required'); errors = true; }
		if (!!!formdata.basic_type) { toastr.error('Breed is required'); errors = true; }
		if (!!!formdata.name && this.props.nameRequired)
									{ toastr.error('Name is required'); errors = true; }
		if (!!!formdata.date) 		{ toastr.error('Date is required'); errors = true; }

		return errors ? null : formdata;
	}

	handleValidateAndSubmit(e) {
		e.preventDefault();
		let formdata = this.validate();
		if (!!!formdata) {
			return;
		}

		$.ajax({
		    url: this.props.submitUrl,
		    type: "POST",
		    data: JSON.stringify(formdata),
    		dataType: "json",
    		contentType: "application/json; charset=utf-8",
    		success: function (x,h,r) {
				console.log('success');
			}}).fail(function(e) {
				if (e.status === 403) {
					toastr.error("You have to be signed in to file a report");
				} else {
					toastr.error("The server responded with an error, please try again later.")
				}
			});
	}

	getSelected(fieldName) {
		let fields = document.getElementsByName(fieldName);
		let selectedFields = [];
		for (let i = 0; i < fields.length; i++) {
		  if (fields[i].checked === true) {
		    selectedFields.push(fields[i].value);
		  }
		}
		return selectedFields.join(', ');
	}

    render() {
    	const name_placeholder = this.props.nameRequired ? "dog's name" : "dog's name, if known";
    	const center = { lat: parseFloat(this.props.location.query['lat']),
    					 lng: parseFloat(this.props.location.query['lng']) };
    	console.log(center);
	  	const markers = [
	  	{
	  		key: 0,
	  		position: { lat: center.lat, lng: center.lng }
	  	}];

        return (
        	<div>
	        	<form className="form-horizontal" action="new" method="post">
					<fieldset>

					<legend style={{textAlign: "center"}}>{ this.props.title }</legend>

    			<div>
				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="date">Date when it happened</label>
				  <div className="col-md-4">
  				    <DateField dateFormat="YYYY-MM-DD" defaultValue={new Date()} ref="date" name="date" type="text" placeholder="datepicker" required="" />
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="name">Name</label>
				  <div className="col-md-4">
				  <input name="name" ref="name" type="text" placeholder={ name_placeholder } className="form-control input-md" />

				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="basic_type">Breed</label>
				  <div className="col-md-4">
				  <input ref="basic_type" name="basic_type" type="text" placeholder="labrador mix, german shepard, etc." className="form-control input-md" required="" />

				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="color">Color</label>
				  <div className="col-md-4">
				  <input ref="color" name="color" type="text" placeholder="brown, grey and white, brindle, etc." className="form-control input-md" required="" />

				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="gender">Gender</label>
				  <div className="col-md-4">
				    <label className="radio-inline" htmlFor="gender">
				      <input name="gender" type="radio" ref="gender" value="M" defaultChecked="true" />
				      M
				    </label>
				    <label className="radio-inline" htmlFor="gender">
				      <input name="gender" type="radio" ref="gender" value="F" />
				      F
				    </label>
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="uploadPhoto">Add Photo</label>
				  <div className="col-md-4">
					<Dropzone multiple={false} accept="image/*" onDrop={() => this.uploadPhoto() }>
						<p>Drop an image or click to select a file to upload.</p>
    				</Dropzone>
    			  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="breeding_status">Breeding status</label>
				  <div className="col-md-4">
				  <input ref="breeding_status" name="breeding_status" type="text" placeholder="intact, fixed, or unknown" className="form-control input-md" />
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="other_info">Other info</label>
				  <div className="col-md-4">
				  <input name="other_info" ref="other_info" type="text" placeholder="anything additional you want to add" className="form-control input-md" />

				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="submit"></label>
				  <div className="col-md-4">
				    <button id="submit" onClick={this.handleValidateAndSubmit} name="submit" className="btn btn-primary">Send report</button>
				  </div>
				</div>

	    		<div className="form-group">
	    			<label className="col-md-4 control-label" htmlFor="reportMap">Report location</label>
	    			<div className="col-md-4 report-map">
	        		<SimpleMap
	                  ref={(map) => this.map = map}
	                  onMapClick={ () => { console.log("do nothing"); }}
	                  onCenterChanged={ () => { console.log("do nothing"); }}
	                  onMarkerClick={ () => { console.log("do nothing"); }}
	                  center={center}
	                  markers={markers} />
	                </div>
                 </div>
				</div>
			</fieldset>
			</form>
		</div>);
    }
}

const mapFoundStateToProps = (state, myprops) => ({
	logged_in: state.login_status === 'success',
	nameRequired : false,
	submitUrl : "/api/found/new",
	title : "I found a dog",
});

const mapLostStateToProps = (state, myprops) => ({
	logged_in: state.login_status === 'success',
	nameRequired : true,
	submitUrl : "/api/lost/new",
	title : "I lost a dog",
});

const mapDispatchToProps = (dispatch, myprops) => ({
	onLoginRequired : () => { dispatch(showLogin('login')); }
});

export const NewFound = connect(mapFoundStateToProps, mapDispatchToProps)(NewFormBase);
export const NewLost = connect(mapLostStateToProps, mapDispatchToProps)(NewFormBase);

