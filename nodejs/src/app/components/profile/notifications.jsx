import React, { Component } from 'react'
import mockData from './mockdata/notifications.json'

class NotificationPanel extends Component {
	render() {
		const expanded = this.props.expanded(this.props.panelid);
		const chevronClasses = (!expanded) ? "glyphicon-chevron-down" : "glyphicon-chevron-right"
		const panelClass = (expanded) ? "in" : ""

		return (<div className="panel-group">
			  <div className="panel panel-default">
			    <div className="panel-heading">
			      <h4 className="panel-title">
			        <a href="" onClick={ (e) => this.props.onToggle(e, this) }>
			        <span className={ "glyphicon " + chevronClasses } />{ this.props.title } </a>
			      </h4>
			    </div>
			    <div id={this.props.panelid} className={ "panel-collapse collapse " + panelClass } aria-expanded={ expanded }>
			      { this.props.children }
			    </div>
			  </div>
			</div>)
	}
}

class NotificationTable extends Component {
	render() {
		const readFilter = (this.props.filter === "read")
		const rows = this.props.dataSource.notifications.map( (val, key) => {
			if (val.read === readFilter)
				return (
					<tr key={ key }>
						<td>{ val.from }</td>
						<td>{ val.sent }</td>
						<td>{ val.message }</td>
						<td>selected actions</td>
					</tr>)

		})

		return (<table style={{width:"100%"}}>
					<thead><tr><th>From</th><th>When</th><th>Message</th></tr></thead>
					<tbody>{ rows }</tbody>
				</table>)
	}
}

export default class Notifications extends Component {
	onTogglePanel(e, panel) {
		e.preventDefault()
		const panelStates = this.state.panel || {}
		panelStates[panel.props.panelid] = !this.stateToPanelStatus(panel.props.panelid)
		this.setState( { panel: panelStates } )
	}

	state = {
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
				{ /* <NotificationPanel panelid="search" title="Search results"/ > */ }
				<NotificationPanel onToggle={ this.onTogglePanel.bind(this) } panelid="new" title="New" expanded={ this.stateToPanelStatus.bind(this) } >
					<NotificationTable dataSource={ mockData } filter="read" />
				</NotificationPanel>
				<NotificationPanel onToggle={ this.onTogglePanel.bind(this) } panelid="old" title="Older" expanded={ this.stateToPanelStatus.bind(this) } >
					<NotificationTable dataSource={ mockData } filter="unread" />
				</NotificationPanel>
			</div>
		</div>)
	}
}