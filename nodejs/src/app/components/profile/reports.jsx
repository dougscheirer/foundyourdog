import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getIncidentInfo, getUserReports } from '../../actions'
import ReactTable from 'react-table'

class ReportsPanel extends Component {
	render() {
		const expanded = this.props.expanded(this.props.panelid);
		const chevronClasses = (!expanded) ? "glyphicon-chevron-down" : "glyphicon-chevron-right"
		const panelClass = (expanded) ? "in" : ""

		return (<div className="panel-group">
			  <div className="panel panel-default">
			    <div className="panel-heading">
			      <h4 className="panel-title">
			        <a href="" onClick={ (e) => this.props.onToggle(e, this) }>
			        	<span className={ "glyphicon " + chevronClasses } />
			        	&nbsp;{ this.props.title }
			        </a>
			      </h4>
			    </div>
			    <div id={this.props.panelid} className={ "panel-collapse collapse " + panelClass } aria-expanded={ expanded }>
			      { this.props.children }
			    </div>
			  </div>
			</div>)
	}
}

class ReportsTable extends Component {
	onReportClick(e) {
		e.preventDefault();
	}

	onDogClick(e, incident) {
		e.preventDefault();
		this.props.showIncidentInfo(incident)
	}

	render() {
		if (!!!this.props.dataSource || !this.props.dataSource.length) {
			return (<div>No results</div>)
		}

		const rows = this.props.dataSource || []

		const columns = [
		    { header: "Date", id: "date", accessor: (incident) => new Date(incident.incident_date), render: ({value}) => <span>{ value.toString() }</span> },
			{ header: "Dog description", id: "description", accessor: (incident) => incident,
				render: ({value}) => <a href="" onClick={ (e) => this.onDogClick(e, value) }>{value.dog_name + ", " + value.dog_gender + " "
										+ value.dog_color + " " + value.dog_basic_type } </a> }
		]
		return (<ReactTable data={rows} columns={columns} pageSize={ rows.length } />)
	}
}

class Reports extends Component {
	onTogglePanel(e, panel) {
		e.preventDefault()
		const panelStates = this.state.panel || {}
		panelStates[panel.props.panelid] = !this.stateToPanelStatus(panel.props.panelid)
		this.setState( { panel: panelStates } )
	}

	state = {
	}

	componentDidMount() {
		this.props.getReportList('open');
		this.props.getReportList('closed');
	}

	stateToPanelStatus(panelId) {
		// default state is expanded
		if (!!!this.state.panel || this.state.panel[panelId] === undefined)
			return true;
		return !!this.state.panel[panelId]
	}

	render() {
		return (<div className="user-profile-container">
			<div>
				<div className="panel-group input-group" style={{ width: "50%" }} >
				   <input type="text" className="form-control" placeholder="Search..." />
				   <span className="input-group-btn">
				        <button className="btn btn-default glyphicon glyphicon-search" style={{ marginTop: "-1px" }} type="button"></button>
				   </span>
				</div>
				</div>
			<div>
				{ /* <ReportsPanel panelid="search" title="Search results"/ > */ }
				<ReportsPanel onToggle={ this.onTogglePanel.bind(this) } panelid="new" title="Open" expanded={ this.stateToPanelStatus.bind(this) } >
					<ReportsTable dataSource={ this.props.openReports } { ...this.props }/>
				</ReportsPanel>
				<ReportsPanel onToggle={ this.onTogglePanel.bind(this) } panelid="old" title="Closed" expanded={ this.stateToPanelStatus.bind(this) } >
					<ReportsTable dataSource={ this.props.closedReports } { ...this.props }/>
				</ReportsPanel>
			</div>
		</div>)
	}
}

const mapStateToProps = (state, myprops) => ({
	openReports : state.myOpenReports,
	closedReports : state.myClosedReports
});

const mapDispatchToProps = (dispatch, myprops) => ({
	getReportList : (type) => { dispatch(getUserReports(type)); },
	showIncidentInfo: (incident) => { dispatch(getIncidentInfo(incident.uuid)) }
});

export default Reports = connect(mapStateToProps, mapDispatchToProps)(Reports);
