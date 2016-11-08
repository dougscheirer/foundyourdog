import React, { Component } from 'react'
import $ from 'jquery'
import { DateField } from "react-date-picker"
import toastr from 'toastr'
import 'toastr/build/toastr.css'
import 'react-date-picker/index.css'
import SimpleMap from "./simple_map"
import Dropzone from "react-dropzone"
import { connect } from "react-redux"
import { showLogin, uploadReportImage } from "../actions"
import fetch from 'isomorphic-fetch'
import FormData from 'form-data'
import { browserHistory } from 'react-router';
import checkbox from "../../checkbox.svg"

class NewFormBase extends Component {
	state = {
		image_preview: undefined,
		uploaded_image: undefined
	};

	getSelected = 				this.getSelected.bind(this);
	handleValidateAndSubmit = 	this.handleValidateAndSubmit.bind(this);
	validate = 					this.validate.bind(this);
	uploadImage = 				this.uploadImage.bind(this);

	doNothing(e) {
		e.preventDefault();
		console.log("do nothing");
	}

	previewImage(files) {
		this.setState({image_preview: files[0]});
	}

	uploadImage(e) {
		e.preventDefault();
		if (this.requireLoginCheck()) {
			return;
		}

		var data = new FormData()
		data.append('file', this.state.image_preview)

		fetch('/report/images/new', {
		  credentials: 'include',
		  method: 'POST',
		  body: data
		}).then((res) => {
			switch (res.status) {
				case 403:
					this.props.onLoginRequired();
					return null;
				case 500:
					return null;
				default:
					return res.json();
			}
		}).then((res) => {
			if (!!res) {
				this.props.onUploadComplete(res);
				this.setState({uploaded_image: res});
			}
		});
	}

	requireLoginCheck() {
		if (!!!this.props.logged_in) {
			this.props.onLoginRequired();
			return true;
		}
	}

	componentDidMount() {
		this.requireLoginCheck();
	}

	validate() {
		if (this.requireLoginCheck()) {
			return null;
		}

		const formdata = {
			map_latitude: 		parseFloat(this.props.location.query['lat']),
			map_longitude: 		parseFloat(this.props.location.query['lng']),
			incident_date: 		this.refs.date.getInput().value,
			dog_name: 			this.refs.name.value,
			dog_basic_type: 	this.refs.basic_type.value,
			dog_color: 			this.refs.color.value,
			other_info: 		this.refs.other_info.value,
			dog_breeding_status:this.refs.breeding_status.value,
			dog_gender:			this.getSelected('gender'),
			photo_id: 			null
		};

		if (!!this.state.uploaded_image) {
			formdata.photo_id = this.state.uploaded_image.id;
		}

		// required: date, name (sometimes), basic_type, color
		let errors = false;
		if (!!this.state.image_preview && !!!this.state.uploaded_image)
										{ toastr.error('Upload the image before submitting the form'); errors = true; }
		if (!!!formdata.dog_color) 		{ toastr.error('Color is required'); errors = true; }
		if (!!!formdata.dog_basic_type) { toastr.error('Breed is required'); errors = true; }
		if (!!!formdata.dog_name && this.props.nameRequired)
										{ toastr.error('Name is required'); errors = true; }
		if (!!!formdata.incident_date)	{ toastr.error('Date is required'); errors = true; }

		return errors ? null : formdata;
	}

	handleValidateAndSubmit(e) {
		e.preventDefault();
		let formdata = this.validate();
		if (!!!formdata) {
			return;
		}

		const loginFunc = this.props.onLoginRequired;
		$.ajax({
		    url: this.props.submitUrl,
		    type: "POST",
		    data: JSON.stringify(formdata),
    		dataType: "json",
    		contentType: "application/json; charset=utf-8",
    		success: function (response,status,jXHR) {
				browserHistory.push("reports/" + response.id);
			}}).fail(function(e) {
				if (e.status === 403) {
					toastr.error("You have to be signed in to file a report");
					loginFunc();
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

	resetServerImage(e) {
		e.preventDefault();
		console.log("TODO: delete server image");
		this.setState({image_preview: undefined, uploaded_image: undefined});
	}

	resetLocalImage(e) {
		e.preventDefault();
		this.setState({image_preview : undefined});
	}

	upload_or_preview() {
		// there are 3 states here:
		// 1) uploaded image (show disabled upload and reset button [reset on server], preview of image)
		// 2) image, not uploaded (show preview, upload and reset button)
		// 3) no image (show dropzone)
  		if (!!this.state.uploaded_image) {
            return (
            	<div>
            		<div>
		           		<button className="btn btn-secondary disabled upload-image" onClick={ (e) => this.doNothing(e) } >
		           			<img src={ checkbox } width="20px" alt="checked" /> Upload
		           		</button>
		           		<button className="btn btn-secondary reset-image" onClick={ (e) => this.resetServerImage(e) }>Reset</button>
	         	    </div>
	           		<img style={{width: "200px"}} alt="current report" src={this.state.image_preview.preview} />
	           	</div>)
  		} else if (!!this.state.image_preview) {
			return (
				<div>
	               	<div>
	               		<button className="btn btn-secondary upload-image" onClick={ this.uploadImage }>Upload</button>
	               		<button className="btn btn-secondary reset-image" onClick={ (e) => this.resetLocalImage(e) }>Reset</button>
	             	</div>
	               	<img style={{width: "200px"}} alt="current report" src={this.state.image_preview.preview} />
	            </div>)
        } else {
			return (<Dropzone multiple={false} accept="image/*" onDrop={(file) => this.previewImage(file) }>
						<p>Drop an image or click to select a file to upload.</p>
					</Dropzone>)
		}
 	}

    render() {
    	const name_placeholder = this.props.nameRequired ? "dog's name" : "dog's name, if known";
    	const center = { lat: parseFloat(this.props.location.query['lat']),
    					 lng: parseFloat(this.props.location.query['lng']) };
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
				  	{ this.upload_or_preview() }
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
	onLoginRequired : () => { dispatch(showLogin('login')); },
	onUploadComplete: (res) => { dispatch(uploadReportImage(res)); },
});

export const NewFound = connect(mapFoundStateToProps, mapDispatchToProps)(NewFormBase);
export const NewLost = connect(mapLostStateToProps, mapDispatchToProps)(NewFormBase);

