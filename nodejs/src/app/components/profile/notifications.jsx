import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { getUserNotifications } from '../../actions'
import { auth_user, logged_in, humanTimestamp } from '../helpers'

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

class NotificationTable extends Component {
	onMessageClick(e) {
		e.preventDefault();
	}

	youOrHandle(userID) {
		return (userID === this.props.currentUser.handle) ? "You" : userID
	}

	render() {
		if (!!!this.props.dataSource || !!!this.props.dataSource.length) {
			return (<div>No notifications found</div>)
		}
		const rows = this.props.dataSource
		const columns = [
			{ header: "From", accessor: "sender_handle",
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e) }>{this.youOrHandle(value)}</a> },
			{ header: "To", accessor: "receiver_handle",
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e) }>{this.youOrHandle(value)}</a> },
			{ header: "When", accessor: "sent_date",
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e) }>{humanTimestamp(value)}</a> },
			{ header: "Subject", id: 'subject', accessor: (message) => message,
				render: ({value}) => <div>{value.incident_id}</div> },
			{ header: "Message", accessor: "message",
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e) }>{value}</a> }
		]
		return (<ReactTable data={rows} columns={columns} pageSize={ rows.length } />)
	}
}

class Notifications extends Component {
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

	componentDidMount() {
		this.props.getNotificationsList('unread')
		this.props.getNotificationsList('read')
	}

	render() {
		if (!!!this.props.logged_in) {
			return (<div></div>)
		}

		return (<div className="user-profile-container">
			<div>
				<div className="panel-group input-group" style={{ width: "50%" }} >
				   <input type="text" className="form-control" placeholder="Search..." />
				   <span className="input-group-btn">
				        <button className="btn btn-default glyphicon glyphicon-search" type="button"></button>
				   </span>
				</div>
			</div>
			<div>
		{ /* <NotificationPanel panelid="search" title="Search results"/ > */ }
				<NotificationPanel onToggle={ this.onTogglePanel.bind(this) } panelid="new" title="New" expanded={ this.stateToPanelStatus.bind(this) } >
					<NotificationTable dataSource={ this.props.unreadNotifications } filter="read" currentUser={ this.props.login_data } />
				</NotificationPanel>
				<NotificationPanel onToggle={ this.onTogglePanel.bind(this) } panelid="old" title="Older" expanded={ this.stateToPanelStatus.bind(this) } >
					<NotificationTable dataSource={ this.props.readNotifications } filter="unread" currentUser={ this.props.login_data } />
				</NotificationPanel>
			</div>
		</div>)
	}
}

const mapStateToProps = (state, myprops) => ({
	logged_in : logged_in(state),
	login_data : auth_user(state),
	unreadNotifications : state.messages.myUnreadNotifications,
	readNotifications : state.messages.myReadNotifications
});

const mapDispatchToProps = (dispatch, myprops) => ({
	getNotificationsList : (type) => { dispatch(getUserNotifications(type)); }
	// showNotificationInfo: (notification) => { dispatch(getNotificationInfo(incident.uuid)) }
});

export default Notifications = connect(mapStateToProps, mapDispatchToProps)(Notifications)