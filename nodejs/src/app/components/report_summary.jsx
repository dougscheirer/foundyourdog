import React, { Component } from 'react'
import spinner from '../../spinner.svg'
import { Link } from 'react-router'
import { getReportInfo, sendMessage } from '../actions'
import { connect } from 'react-redux'
import SimpleMap from './simple_map'
import no_image from '../../noimage.svg'
import { logged_in, auth_user, humanTimestamp, optionalColor, coatDescription } from './helpers'

class ReportSummary extends Component {

	state = {
		report_id: this.props.params.reportId,
	}

	componentDidMount() {
		this.setState({
			report_id: this.props.params.reportId,
		});
		this.props.onLoadReport(this.props.params.reportId);
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
								<button style={{float:"right"}} className="btn btn-default glyphicon glyphicon-trash"></button>
								<button style={{float:"right"}} className="btn btn-default glyphicon glyphicon-edit"></button>
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

	render() {
		const report = this.props.report_detail;
		if (!!!report) {
			return (
				<div>
				<p><img src={spinner} alt="spinner" /> Fetching report data...</p>
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
								<SimpleMap
								center={center}
								markers={markers} />
							</div>
						</div>
						<div className="col-md-6">
							<img style={{display:"block", margin:"auto", width: "200px"}} src={ imageSource } alt="dog" />
						</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<table className="table" width="100%">
							<thead><tr><th>Report details</th></tr></thead>
							<tbody>
								<tr><td>Date</td><td>{ humanTimestamp(report.incident.incident_date) }</td></tr>
								<tr><td>Status</td><td>{ report.incident.state }</td></tr>
								<tr><td>Resolution</td><td>{ report.incident.resolution }</td></tr>
								<tr><td>Reporter</td><td>{ this.formatReporterField(report) }</td></tr>
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
								<tr><td>Added on</td><td>{ Date(report.dog.added_date) }</td></tr>
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
		login_data: auth_user(state)
	});

	const mapDispatchToProps = (dispatch, props) => ({
		onLoadReport: (id) => { dispatch(getReportInfo(id)); },
		sendMessage: (incident) => { dispatch(sendMessage(incident.reporter_id, incident)) }
	});

	export default ReportSummary = connect(mapStateToProps, mapDispatchToProps)(ReportSummary);