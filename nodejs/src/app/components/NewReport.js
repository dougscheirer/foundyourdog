import React, { Component } from 'react'
import { DateField } from "react-date-picker"
import toastr from 'toastr'
import 'toastr/build/toastr.css'
import 'react-date-picker/index.css'
import SimpleMap from "./simple_map"
import Dropzone from "react-dropzone"
import { connect } from "react-redux"
import { loginRequired, showLogin, uploadImage, uploadReportImage, getUnassignedImages, submitReportForm } from "../actions"
import { browserHistory } from 'react-router';
import checkbox from "../../checkbox.svg"
import dogTypes from './common_dogs.json'
import coatTypes from './coats.json'
import { waiting_login, logged_in } from './helpers'

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
		this.props.loginRequired(() => {
			this.setState({image_preview: files[0]});
			this.uploadImageFile(files[0])
		})
	}

	uploadImageFile(file) {
		this.setState({uploading: true})
		this.props.uploadImage(file)
	}

	uploadImage(e) {
		if (!!e) e.preventDefault();
		this.uploadImageFile(this.state.image_preview)
	}

	requireLoginCheck() {
		if (!!!this.props.waiting_login && !!!this.props.logged_in) {
			this.props.onLoginRequired();
			return true;
		}
	}

	componentDidMount() {
		this.requireLoginCheck();
		this.props.getUnassignedImages();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.existing_image !== this.props.existing_image) {
			this.setState({uploaded_image: nextProps.existing_image});
			this.setState({uploading: false})
		}
	}

	validate() {
		const formdata = {
			map_latitude: 		parseFloat(this.props.location.query['lat']),
			map_longitude: 		parseFloat(this.props.location.query['lng']),
			incident_date: 		this.refs.date.getInput().value,
			dog_name: 				this.refs.name.value,
			dog_primary_type: this.refs.primary_type.value,
			dog_secondary_type:	this.refs.secondary_type.value,
			dog_primary_color: this.refs.primary_color.value,
			dog_secondary_color: this.refs.secondary_color.value,
			dog_coat_type: 		this.refs.coat_type.value,
			other_info: 			this.refs.other_info.value,
			dog_breeding_status:this.refs.breeding_status.value,
			dog_gender:				this.getSelected('gender'),
			photo_id: 				null
		};

		if (!!this.state.uploaded_image) {
			formdata.photo_id = this.state.uploaded_image.uuid;
		}

		// required: date, name (sometimes), basic_type, color
		let errors = false;
		if (!!this.state.image_preview && !!!this.state.uploaded_image)
										{ toastr.error('Upload the image before submitting the form'); errors = true; }
		if (!!!formdata.dog_primary_color) 		{ toastr.error('Color is required'); errors = true; }
		if (!!!formdata.dog_primary_type) { toastr.error('A basic breed identifier is required'); errors = true; }
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

		try {
			this.props.submitReportForm(this.props.submitUrl, JSON.stringify(formdata), (res) => {
					browserHistory.push("/reports/" + res.id)
				})
		} catch (e) {
			console.log(e.message)
		}
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
		this.setState({resetting: true})
		fetch('/api/auth/report/images/' + this.state.uploaded_image.uuid, { method: "DELETE", credentials: "include" }).then((res) => {
			this.setState({resetting: false});
			if (res.ok) {
				this.setState({image_preview: undefined, uploaded_image: undefined});
			} else {
				toastr.error("Unknown error resetting image, try again later")
			}
		});
	}

	resetLocalImage(e) {
		e.preventDefault();
		this.setState({image_preview : undefined});
	}

	upload_or_preview() {
		// there are 3 states here:
		// 1) uploaded image (show disabled upload and reset button [reset on server], preview of image, from server)
		// 2) image, not uploaded (show preview, upload and reset button)
		// 3) no image (show dropzone)
		const uploaded = this.state.uploaded_image;
		const resetDisabled = (!!this.state.resetting) ? "disabled" : ""

		if (!!uploaded) {
			const image_src = this.state.uploaded_image.imageUrl;
	    return (
	    	<div>
	    		<div>
	       		<button className="btn btn-secondary disabled upload-image" onClick={ (e) => this.doNothing(e) } >
	       			<img src={ checkbox } width="20px" alt="checked" /> Uploaded
	       		</button>
	       		<button className={ "btn btn-secondary reset-image " + resetDisabled } onClick={ (e) => this.resetServerImage(e) }>Reset</button>
	   	    </div>
	     		<img style={{width: "200px"}} alt="current report" src={ image_src } />
	     	</div>)
		} else if (!!this.state.image_preview) {
			const uploadingDisabled = (!!this.state.uploading) ? "disabled" : ""
			const uploadBtnText = (!!this.state.uploading) ? "Uploading..." : "Upload"

			return (
				<div>
	       	<div>
	       		<button className={ "btn btn-secondary upload-image " + uploadingDisabled } onClick={ this.uploadImage }> { uploadBtnText } </button>
	       		<button className={ "btn btn-secondary reset-image " + uploadingDisabled + " " + resetDisabled } onClick={ (e) => this.resetLocalImage(e) }>Reset</button>
	       	</div>
	       	<img style={{width: "200px"}} alt="current report" src={this.state.image_preview.preview} />
		    </div>)
    } else {
			return (<Dropzone multiple={false} accept="image/*" onDrop={(file) => this.previewImage(file) }>
				<p>Drop an image or click to select a file to upload.</p>
				</Dropzone>)
		}
 	}

	dog_breed_options(primary) {
		let options = [ <option default="true" key="" value=""></option> ]

		options.push(dogTypes.map((val,key) => {
			return (<option key={key} value={val}>{val}</option>)
		}));

		return options;
	}

	dog_primary_type_options() {
		return this.dog_breed_options(true)
	}

	dog_secondary_type_options() {
		return this.dog_breed_options(false)
	}

	dog_color_options(primary) {
		let options = [ <option default="true" key="" value=""></option> ]

		options.push(coatTypes.colors.map((val,key) => {
			return (<option key={key} value={val}>{val}</option>)
		}));

		return options;
	}

	dog_primary_color_options() {
		return this.dog_color_options(true)
	}

	dog_secondary_color_options() {
		return this.dog_color_options(false)
	}

	dog_coat_options() {
		let options = [ <option default="true" key="" value=""></option> ]

		options.push(coatTypes.coats.map((val,key) => {
			return (<option key={key} value={val}>{val}</option>)
		}));

		return options;
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
  				    <DateField  dateFormat="YYYY-MM-DD HH:mm:ss" defaultValue={new Date()} ref="date" name="date" type="text" placeholder="datepicker" required="" />
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="name">Name</label>
				  <div className="col-md-4">
				  <input name="name" ref="name" type="text" placeholder={ name_placeholder } className="form-control input-md" />

				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="primary_type">Breed</label>
				  <div className="col-md-4">
					  <select className="form-control" id="primary_type" ref="primary_type" placeholder="Best guess at a breed">
					    { this.dog_primary_type_options() }
					  </select>
					  <select className="form-control" id="secondary_type" ref="secondary_type">
					    { this.dog_secondary_type_options() }
					  </select>
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="primary_color">Color</label>
				  <div className="col-md-4">
					  <select className="form-control" id="primary_color" ref="primary_color">
					    { this.dog_primary_color_options() }
					  </select>
					  <select className="form-control" ref="secondary_color" id="secondary_color">
					    { this.dog_secondary_color_options() }
					  </select>
					</div>
				</div>

				<div className="form-group">
					<label className="col-md-4 control-label" htmlFor="coat_type">Coat</label>
				  <div className="col-md-4">
					  <select className="form-control" ref="coat_type" id="coat_type">
					    { this.dog_coat_options() }
					  </select>
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
	logged_in: logged_in(state),
	waiting_login: waiting_login(state),
	nameRequired : false,
	submitUrl : "/api/auth/found/new",
	title : "I found a dog",
	existing_image : state.images.unassigned_image
});

const mapLostStateToProps = (state, myprops) => ({
	logged_in: logged_in(state),
	waiting_login: waiting_login(state),
	nameRequired : true,
	submitUrl : "/api/auth/lost/new",
	title : "I lost a dog",
	existing_image : state.images.unassigned_image
});

const mapEditStateToProps = (state, myprops) => ({
	logged_in: logged_in(state),
	waiting_login: waiting_login(state),
	edit: true,
	submitUrl : "/api/auth/report/edit",
	title : "Edit exisitng report (put something here)",
	existing_image : undefined
});

const mapDispatchToProps = (dispatch, myprops) => ({
	loginRequired : (after) => { dispatch(loginRequired(after)) },
	onLoginRequired : () => { dispatch(showLogin()); },
	onUploadComplete: (res) => { dispatch(uploadReportImage(res)); },
	getUnassignedImages: () => { dispatch(getUnassignedImages()); },
	uploadImage : (file) => { dispatch(uploadImage(file)) },
	submitReportForm : (url, data, post) => { dispatch(submitReportForm(url, data, post)) }
});

export const NewFound = connect(mapFoundStateToProps, mapDispatchToProps)(NewFormBase);
export const NewLost = connect(mapLostStateToProps, mapDispatchToProps)(NewFormBase);
export const EditReport = connect(mapEditStateToProps, mapDispatchToProps)(NewFormBase);
