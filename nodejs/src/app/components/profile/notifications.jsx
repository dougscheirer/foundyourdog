import React, { Component } from 'react'

class NotificationPanel extends Component {
	render() {
		const expanded = this.props.expanded(this.props.id);
		const chevronClasses = (!expanded) ? "glyphicon-chevron-up" : "glyphicon-chevron-down"
		const panelClass = (!expanded) ? "in" : ""

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
		if (!!!this.state.panel)
			return true;
		return this.state.panel[panelId]
	}

	render() {
		return (<div className="user-profile-container">
			<div className="container">
				<div className="panel-group input-group" style={{ width: "50%" }} >
				   <input type="text" className="form-control" />
				   <span className="input-group-btn">
				        <button className="btn btn-default glyphicon glyphicon-search" style={{ marginTop: "-1px" }} type="button"></button>
				   </span>
				</div>
				</div>
			<div className="container">
				{ /* <NotificationPanel panelid="search" title="Search results"/ > */ }
				<NotificationPanel onToggle={ this.onTogglePanel.bind(this) } panelid="new" title="New" expanded={ this.stateToPanelStatus.bind(this) } >
					<div>Pizza</div>
				</NotificationPanel>
				<NotificationPanel onToggle={ this.onTogglePanel.bind(this) } panelid="old" title="Older" expanded={ this.stateToPanelStatus.bind(this) } >
					<div>Pie</div>
				</NotificationPanel>
			</div>
		</div>)
	}
}