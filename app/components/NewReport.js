import React, { Component } from 'react';
import { Link } from 'react-router';
import { DateField, Calendar } from 'react-date-picker';
import $ from 'jquery';

const NewReport = React.createClass({
  render: function() {
    return (<h1>New report of a {this.props.showtype} dog</h1>);
  }
});

export class NewFound extends Component {

	handleValidateAndSubmit(e) {
		e.preventDefault();
		console.log("validate and submit");
		var formdata = {
			date: React.findDOMNode(this.refs.date).value,
			company: React.findDOMNode(this.refs.company).value,
			email: React.findDOMNode(this.refs.email).value,
			name: React.findDOMNode(this.refs.name).value,
			phone: React.findDOMNode(this.refs.phone).value,
			project: React.findDOMNode(this.refs.project).value,
			referal: React.findDOMNode(this.refs.referal).value,
			website: React.findDOMNode(this.refs.website).value
		};
		$.post( "/api/found/new", formdata, function (x,h,r) {
				console.log('success');
			}).fail(function(e) {
				console.log("failed");
				console.log(e);
			});
	}

    render() {
    	// TODO: load defaults
        return (
        	<form className="form-horizontal" action="new" method="post">
				<fieldset>

				<legend>I found a dog</legend>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="date">Date</label>   
				  <div className="col-md-4">
				  <input name="date" ref="date" type="text" placeholder="datepicker" className="form-control input-md" required="" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="name">Name</label>  
				  <div className="col-md-4">
				  <input name="name" ref="name" type="text" placeholder="dog's name, if known" className="form-control input-md" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="basic_type">Basic type</label>  
				  <div className="col-md-4">
				  <input ref="basic_type" name="basic_type" type="text" placeholder="labrador mix, german shepard, etc." className="form-control input-md" required="" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="gender">Gender</label>
				  <div className="col-md-4"> 
				    <label className="radio-inline" htmlFor="gender-0">
				      <input name="gender" type="radio" ref="gender" value="M" defaultChecked="true" />
				      M
				    </label> 
				    <label className="radio-inline" htmlFor="gender-1">
				      <input name="gender" type="radio" ref="gender" id="gender-1" value="F" />
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
				  <label className="col-md-4 control-label" htmlFor="color">Color</label>  
				  <div className="col-md-4">
				  <input ref="color" name="color" type="text" placeholder="brown, grey and white, brindle, etc." className="form-control input-md" required="" />
				    
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
		</form>);
    }
}

export class NewLost extends Component {

	handleValidateAndSubmit(e) {
		e.preventDefault();
		console.log("validate and submit");
		const formdata = {};
		$.post( "/api/lost/new", formdata, function (x,h,r) {
				console.log('success');
			}).fail(function(e) {
				console.log("failed");
				console.log(e);
			});
	}

    render() {
        return (<form className="form-horizontal" action="new" method="post">
			<fieldset>

				<legend>I lost a dog</legend>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="date">Date</label>  
				  <div className="col-md-4">
				  <input ref="date" name="date" type="text" placeholder="datepicker" className="form-control input-md" required="" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="basic_type">Basic type</label>  
				  <div className="col-md-4">
				  <input name="basic_type" ref="basic_type" type="text" placeholder="labrador mix, german shepard, etc." className="form-control input-md" required="" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="gender">Gender</label>
				  <div className="col-md-4"> 
				    <label className="radio-inline" htmlFor="gender">
				      <input type="radio" name="gender" ref="gender" value="M" defaultChecked="true" />
				      M
				    </label> 
				    <label className="radio-inline" htmlFor="gender">
				      <input type="radio" name="gender" ref="gender" value="F" />
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
				  <label className="col-md-4 control-label" htmlFor="color">Color</label>  
				  <div className="col-md-4">
				  <input ref="color" name="color" type="text" placeholder="brown, grey and white, brindle, etc." className="form-control input-md" required="" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="name">Name</label>  
				  <div className="col-md-4">
				  <input ref="name" name="name" type="text" placeholder="dog's name, if known" className="form-control input-md" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="other_info">Other info</label>  
				  <div className="col-md-4">
				  <input ref="other_info" name="other_info" type="text" placeholder="anything addition you want to add" className="form-control input-md" />
				    
				  </div>
				</div>

				<div className="form-group">
				  <label className="col-md-4 control-label" htmlFor="submit"></label>
				  <div className="col-md-4">
				    <button id="submit" onClick={this.handleValidateAndSubmit} name="submit" className="btn btn-primary">Add report</button>
				  </div>
				</div>

			</fieldset>
		</form>);
    }
}
