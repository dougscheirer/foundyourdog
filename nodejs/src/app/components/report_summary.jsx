import React, { Component } from 'react'
import spinner from '../../spinner.svg'
import { Link } from 'react-router'
import { resolveIncident, getReportInfo, sendMessage, getContactList } from '../actions'
import { connect } from 'react-redux'
import SimpleMap from './simple_map'
import no_image from '../../noimage.svg'
import { logged_in, getUserData, humanTimestamp, optionalColor, coatDescription } from './helpers'

class ReportSummary extends Component {

	state = {
		report_id: this.props.params.reportId,
		resolve: this.props.resolve,
		resolve_reason: "app_contact"
	}

	componentDidMount() {
		this.setState({
			report_id: this.props.params.reportId,
		});
		this.props.onLoadReport(this.props.params.reportId);
		this.props.getContactList(this.props.params.reportId);
	}

	isLoggedInUser(id) {
		return (this.props.login_status && this.props.login_data.uuid === id)
	}

	contactOwner(e) {
		e.preventDefault();
		const incident = this.props.report_detail.incident;
		this.props.sendMessage(incident)
	}

	contactFinder(e) {
		this.contactOwner(e)
	}

	formatReporterField(report) {
		if (this.isLoggedInUser(report.incident.reporter_id)) {
			return (<span>
								<Link to="/profile">You</Link>
							</span>)
		}

		if (report.incident.state === "found") {
			// if the reporter id is the logged in user, gray out the button
			const classes = "btn btn-default " + (this.isLoggedInUser(report.incident.reporter_id) ? "disabled" : "")
			return (<button className={ classes } onClick={ this.contactFinder.bind(this) } >Contact finder</button>)
		} else {
			const classes = "btn btn-default " + (this.isLoggedInUser(report.incident.owner_id) ? "disabled" : "")
			return (<button className={ classes } onClick={ this.contactOwner.bind(this) } >Contact owner</button>)
		}
	}

	formatOwnerField(report) {
		if (report.incident.state === "lost") {
			if (this.isLoggedInUser(report.incident.reporter_id)) {
				return (<Link to="/profile">You</Link>)
			} else {
				return (<button className="btn btn-default" onClick={ this.contactFinder.bind(this) }>Contact owner</button>)
			}
		} else {
			return "unknown"
		}
	}

	doNothing() {
	}

	resolve(e) {
		if (!!e) e.preventDefault()
		// form validation?
		const resolveForm = {
			reason: this.refs.resolve_reason.value,
			contact_user: (!!this.refs.contact_user ? this.refs.contact_user.value : undefined),
			additional_info: this.refs.additional_info.value
		}
		this.props.doResolve(this.props.report_detail.incident.uuid, JSON.stringify(resolveForm))
	}

	resolutionControls(report) {
		if (!!report.incident.resolution) {
			return (<div>{ report.incident.resolution }</div>)
		} else {
			const disabled = !!!this.isLoggedInUser(report.incident.reporter_id)
			const primary = (!!this.state.resolve) ? "" : "btn-primary"
			const classes = "btn " + primary + (!!disabled ? "disabled" : "")
			const bind = (disabled) ? this.doNothing.bind(this) : this.resolve.bind(this)

			return (<div><button className={ classes } onClick={ bind } >Resolve incident</button></div>)
		}
	}

	hideResolveDialog() {
		this.setState({resolve: false})
	}

	resolveAction(props) {
		console.log(props)
	}

	hideResolve() {
		this.setState({resolve: false})
	}

	resolveOptions(report) {
		if (report.incident.state === "lost") {
      return [<option key="0" value="app_contact">the finder contacted me here</option>,
							<option key="1" value="foreign_contact">the finder contacted me directly</option>,
							<option key="2" value="flyer">I saw a &quot;found dog&quot; poster</option>,
							<option key="3" value="shelter">I found it at a shelter/rescue organization</option>,
							<option key="4" value="no_response">(just close it)</option>]
		} else {
      return [<option key="0" value="app_contact">the owner contacted me here</option>,
							<option key="1" value="foreign_contact">the owner contacted me directly</option>,
							<option key="2" value="flyer">I saw a &quot;lost dog&quot; poster</option>,
							<option key="3" value="shelter">I took the animal to a shelter/rescue organization</option>,
							<option key="4" value="no_response">(just close it)</option>]
		}
	}

	contactsControl() {
		if (!!this.props.incident_contacts) {
			return (<select ref="contact_user" id="contact_user" name="contact_user" className="form-control">
			      { this.props.incident_contacts.map((v, k) => {
			      		return <option key={k} value={v.uuid}>{v.handle}</option>
			      })}
			      <option key="0" value="0">I don&#39;t know</option>
			  </select>)
		} else {
			return (<select id="contact_user" name="contact_user" className="form-control" disabled>
			      <option value="1">(loading contacts)</option>
			    </select>)
		}
	}

	resolveUserOptions(report) {
		if (this.state.resolve_reason && this.state.resolve_reason === "app_contact") {
			return (<div className="form-group">
			  <label className="col-md-4 control-label" htmlFor="contact_user">Contact user</label>
			  <div className="col-md-8">
			  	{ this.contactsControl() }
			  </div>
			</div>)
		} else {
			return (<div className="form-group">
			  <label className="col-md-4 control-label" disabled htmlFor="contact_user">Contact user</label>
			  <div className="col-md-8">
			    <select id="contact_user" name="contact_user" disabled className="form-control">
			      <option value="0"></option>
			    </select>
			  </div>
			</div>)
		}
	}

	change(e) {
		this.setState({resolve_reason : this.refs.resolve_reason.value})
		if (this.refs.resolve_reason.value === "app_contact") {
			this.props.getContactList(this.props.report_detail.incident.uuid)
		}
	}

	resolveForm(report) {
		if (!!!this.props.login_status)	return (<div></div>)
		return (<form className="form-horizontal resolve-form">
							<fieldset>
								<div className="form-group">
									<label className="col-md-4 control-label" htmlFor="resolve_reason">This is resolved because</label>
								  <div className="col-md-8">
								    <select ref="resolve_reason" id="resolve_reason" name="resolve_reason" className="form-control" onChange={ this.change.bind(this) }>
								    	{ this.resolveOptions(report) }
								    </select>
								  </div>
								</div>
								{ this.resolveUserOptions(report) }
								<div className="form-group">
								  <label className="col-md-4 control-label" htmlFor="additional_info">Additional information</label>
								  <div className="col-md-8">
								    <textarea ref="additional_info" style={{resize: "vertical"}} className="form-control" id="additional_info" name="additional_info"
								    					placeholder="anything relevant you want to add"></textarea>
								  </div>
								</div>
								<div className="form-group">
									<label className="col-md-4" htmlFor="resolve-btn"></label>
								  <div className="col-md-8">
										<a style={{marginRight: "30px"}} href="#" onClick={ this.hideResolve.bind(this) }>Cancel</a>
										<button type="submit" name="resolve-btn" className="btn btn-primary"
														id="resolve-btn" value="Resolve" onClick={ this.resolve.bind(this) }>Resolve</button>
									</div>
								</div>
							</fieldset>
						</form>)
	}

	render() {
		const report = this.props.report_detail;
		if (!!!report) {
			return (
				<div>
				<p><img src={spinner} alt="spinner" /> Fetching report data...</p>
				</div>)
		}

		if (!!report.error) {
			return (
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<p>Sorry, but the report you requested could not be found.</p>
							<p>If you think you received this message incorrectly, please give us <Link to="/feedback">Feedback</Link></p>
						</div>
					</div>
				</div>)
		}

		const center = { lat: parseFloat(report.incident.map_latitude),
			lng: parseFloat(report.incident.map_longitude) };
			const markers = [
			{
				key: 0,
				position: { lat: center.lat, lng: center.lng }
			}];

			const imageSource = (!!report.image && !!report.image.imageUrl) ?
														report.image.imageUrl :
														no_image;

			return (
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="report-map" style={{margin:"auto"}}>
								<SimpleMap center={center} markers={markers} />
							</div>
						</div>
						<div className="col-md-6">
							<img style={{display:"block", margin:"auto", width: "200px"}} src={ imageSource } alt="dog" />
						</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<table className="table" width="100%" style={{marginBottom: "0px"}}>
							<thead>
								<tr>
									<th>Report details</th>
									<th><button style={{float:"right"}} className="btn btn-default glyphicon glyphicon-trash"></button>
										<button style={{float:"right"}} className="btn btn-default glyphicon glyphicon-edit"></button>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>Date</td><td>{ humanTimestamp(report.incident.incident_date) }</td></tr>
								<tr><td>Status</td><td>{ report.incident.state }</td></tr>
								<tr><td>Reporter</td><td>{ this.formatReporterField(report) }</td></tr>
								<tr><td>Resolution</td><td>{ this.resolutionControls(report) }</td></tr>
							</tbody>
						</table>
						<table>
							<tbody>
								<tr><td>
									{ !!this.state.resolve ? this.resolveForm(report) : <div></div> }
								</td></tr>
							</tbody>
						</table>
					</div>
					<div className="col-md-6">
						<table className="table" width="100%">
						<thead>
							<tr><th>Dog profile</th></tr>
						</thead>
							<tbody>
								<tr><td>Breed</td><td>{ optionalColor(report.dog.primary_type, report.dog.secondary_type) }</td></tr>
								<tr><td>Coat</td><td>{ coatDescription(report.dog.primary_color, report.dog.secondary_color, report.dog.coat_type) }</td></tr>
								<tr><td>Breeding status</td><td>{ report.dog.intact }</td></tr>
								<tr><td>Name</td><td>{ report.dog.name }</td></tr>
								<tr><td>Added on</td><td>{ humanTimestamp(report.dog.added_date) }</td></tr>
								<tr><td>Tags</td><td>{ report.dog.tags }</td></tr>
								<tr><td>Owner</td><td>{ this.formatOwnerField(report) }</td></tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>);
		}
	}

	const mapStateToProps = (state, myprops) => ({
		report_detail: 	state.incidents.report_detail,
		login_status: logged_in(state),
		login_data: getUserData(state)
	});

	const mapResolveStateToProps = (state, myprops) => ({
		report_detail: 	state.incidents.report_detail,
		login_status: logged_in(state),
		login_data: getUserData(state),
		incident_contacts: state.incidents.contacts,
		resolve: true
	});

	const mapDispatchToProps = (dispatch, props) => ({
		onLoadReport: (id) => { dispatch(getReportInfo(id)); },
		sendMessage: (incident) => { dispatch(sendMessage(incident.reporter_id, incident)) },
		getContactList: (id) => { dispatch(getContactList(id)) },
		doResolve: (id, form) => { dispatch(resolveIncident(id, form)) }
	});

	export default ReportSummary 			= connect(mapStateToProps, mapDispatchToProps)(ReportSummary);
	export const ReportResolveSummary = connect(mapResolveStateToProps, mapDispatchToProps)(ReportSummary);