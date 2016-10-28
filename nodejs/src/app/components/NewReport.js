import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { DateField } from "react-date-picker";
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import 'react-date-picker/index.css';

class NewFormBase extends Component {

	getSelected = 				this.getSelected.bind(this);
	handleValidateAndSubmit = 	this.handleValidateAndSubmit.bind(this);
	validate = 					this.validate.bind(this);

	validate() {
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
		if (!!!formdata.name && this.nameRequired)
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
		    url: this.submitUrl,
		    type: "POST",
		    data: JSON.stringify(formdata),
    		dataType: "json",
    		contentType: "application/json; charset=utf-8",
    		success: function (x,h,r) {
				console.log('success');
			}}).fail(function(e) {
				toastr.error("The server responded with an error, please try again later.")
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
    	const name_placeholder = this.nameRequired ? "dog's name" : "dog's name, if known";

        return (
        	<div>
    	    	<div name="image-uploader"></div>
	        	<form className="form-horizontal" action="new" method="post">
					<fieldset>

					<legend style={{textAlign: "center"}}>I found a dog</legend>

					<div className="form-group">
					  <label className="col-md-4 control-label" htmlFor="date">Date</label>
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
					  <label className="col-md-4 control-label" htmlFor="breeding_status">Breeding status</label>
					  <div className="col-md-4">
					  <input ref="breeding_status" name="breeding_status" type="text" placeholder="intact, fixed, or unknown" className="form-control input-md" />

					  </div>
					</div>

					<div className="form-group">
					  <label className="col-md-4 control-label" htmlFor="other_info">Other info</label>
					  <div className="col-md-4">
					  <input name="other_info" ref="other_info" type="text" placeholder="anything addition you want to add" className="form-control input-md" />

					  </div>
					</div>

					<div className="form-group">
					  <label className="col-md-4 control-label" htmlFor="submit"></label>
					  <div className="col-md-4">
					    <button id="submit" onClick={this.handleValidateAndSubmit} name="submit" className="btn btn-primary">Add report</button>
					  </div>
					</div>

				</fieldset>
			</form>
		</div>);
    }
}

export class NewFound extends NewFormBase {
	constructor(props) {
		super(props);
		this.nameRequired = false;
		this.submitUrl = "/api/found/new";
	}
}

export class NewLost extends NewFormBase {
	constructor(props) {
		super(props);
		this.nameRequired = true;
		this.submitUrl = "/api/lost/new"
	}
}
