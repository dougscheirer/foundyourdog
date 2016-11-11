import React, { Component } from 'react'
import spinner from '../../spinner.svg'
import { getReportInfo } from '../actions'
import { connect } from 'react-redux'
import SimpleMap from './simple_map'

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

	render() {
		const report = this.props.report_detail;
		if (!!!report) {
			return (
				<div>
					<p><img src={spinner} alt="spinner" /> Fetching report data...</p>
				</div>)
		}

		console.log(report);
    	const center = { lat: parseFloat(report.incident.map_latitude),
    					 lng: parseFloat(report.incident.map_longitude) };
	  	const markers = [
	  	{
	  		key: 0,
	  		position: { lat: center.lat, lng: center.lng }
	  	}];

		return (
			<div className="container">
				<div className="row">
					<div className="col-md-2" />
					<div className="col-md-4">
						<div className="report-map" style={{margin:"auto"}}>
							<SimpleMap
			                  ref={(map) => this.map = map}
			                  onMapClick={ () => { console.log("do nothing"); }}
			                  onCenterChanged={ () => { console.log("do nothing"); }}
			                  onMarkerClick={ () => { console.log("do nothing"); }}
			                  center={center}
			                  markers={markers} />
			            </div>
			        </div>
					<div className="col-md-4">
						<img style={{display:"block", margin:"auto", width: "200px"}} src={ "/api/images/" + report.image.uuid } alt="dog" />
					</div>
					<div className="col-md-2" />
				</div>
				<div className="row">
					<div className="col-md-2" />
					<div className="col-md-4">
				            <table width="100%">
				            	<thead>
				            		<tr><th>Report details</th></tr>
				            	</thead>
				            	<tbody>
				            		<tr><td>Date</td><td>{ report.incident.incident_date }</td></tr>
				            		<tr><td>Status</td><td>{ report.incident.state }</td></tr>
				            		<tr><td>Resolution</td><td>{ report.incident.resolution }</td></tr>
				            		<tr><td>Reporter</td><td>Contact reporter</td></tr>
				            	</tbody>
				            </table>
					</div>
					<div className="col-md-4">
					        <table width="100%">
				            	<thead>
				            		<tr><th>Dog profile</th></tr>
				            	</thead>
				            	<tbody>
									<tr><td>Breed</td><td>{ report.dog.basic_type }</td></tr>
									<tr><td>Color</td><td>{ report.dog.color }</td></tr>
									<tr><td>Breeding status</td><td>{ report.dog.intact }</td></tr>
									<tr><td>Name</td><td>{ report.dog.name }</td></tr>
									<tr><td>Added on</td><td>{ report.dog.added_date }</td></tr>
									<tr><td>Tags</td><td>{ report.dog.tags }</td></tr>
									<tr><td>Owner</td><td>Contact owner</td></tr>
		    	            	</tbody>
				            </table>
					</div>
					<div className="col-md-2" />
				</div>
			</div>);
	}
}

const mapStateToProps = (state, myprops) => ({
	report_detail: 	state.report_detail
});

const mapDispatchToProps = (dispatch, props) => ({
	onLoadReport: (id) => { dispatch(getReportInfo(id)); }
});

export default ReportSummary = connect(mapStateToProps, mapDispatchToProps)(ReportSummary);