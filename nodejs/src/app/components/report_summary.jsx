import React, { Component } from 'react'
import spinner from '../../spinner.svg'
import { Link } from 'react-router'
import { getReportInfo } from '../actions'
import { connect } from 'react-redux'
import SimpleMap from './simple_map'
import no_image from '../../noimage.svg'

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

	formatReporterField(report) {
		if (this.props.login_status === "success" && this.props.login_data.uuid === report.incident.reporter_id) {
			return (<span>
								<Link to="/profile">You</Link>
								<button style={{float:"right"}} className="btn btn-default glyphicon glyphicon-trash"></button>
								<button style={{float:"right"}} className="btn btn-default glyphicon glyphicon-edit"></button>
							</span>)
		}

		if (report.incident.state === "found") {
			return (<button className="btn btn-default">Contact finder</button>)
		} else {
			return (<button className="btn btn-default">Contact owner</button>)
		}
	}

	formatOwnerField(report) {
		if (report.incident.state === "lost") {
			if (this.props.login_status === "success" && this.props.login_data.uuid === report.incident.reporter_id) {
				return (<Link to="/profile">You</Link>)
			} else {
				return (<button className="btn btn-default">Contact owner</button>)
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

			const imageSource = (!!report.image && !!report.image.uuid) ?
														"/api/images/" + report.image.uuid :
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
								<tr><td>Date</td><td>{ Date(report.incident.incident_date) }</td></tr>
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
								<tr><td>Breed</td><td>{ report.dog.basic_type }</td></tr>
								<tr><td>Color</td><td>{ report.dog.color }</td></tr>
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
		report_detail: 	state.report_detail,
		login_status: state.login_status,
		login_data: state.login_data
	});

	const mapDispatchToProps = (dispatch, props) => ({
		onLoadReport: (id) => { dispatch(getReportInfo(id)); }
	});

	export default ReportSummary = connect(mapStateToProps, mapDispatchToProps)(ReportSummary);