import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import { getUserMessages } from '../../actions'
import { getUserData, logged_in, humanTimestamp } from '../helpers'
import { browserHistory } from 'react-router'

class MessagePanel extends Component {
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

class MessageTable extends Component {
	onMessageClick(e, message) {
		e.preventDefault()
		browserHistory.push('/conversation/' + message.incident_id + "/" + message.uuid)
	}

	youOrHandle(userID) {
		return (userID === this.props.currentUser.handle) ? "You" : userID
	}

	render() {
		if (!!!this.props.dataSource || !!!this.props.dataSource.length) {
			return (<div>No messages found</div>)
		}
		const rows = this.props.dataSource
		const columns = [
			{ header: "From", id: 'from', accessor: (i) => i,
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e, value) }>{this.youOrHandle(value.sender_handle)}</a> },
			{ header: "To", id: 'to', accessor: (i) => i,
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e, value) }>{this.youOrHandle(value.receiver_handle)}</a> },
			{ header: "When", id: 'when', accessor: (i) => i,
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e, value) }>{humanTimestamp(value.sent_date)}</a> },
			{ header: "Subject", id: 'subject', accessor: (i) => i,
				render: ({value}) => <div>{value.incident_id}</div> },
			{ header: "Message", id: 'message', accessor: (i) => i,
				render: ({value}) => <a href="" onClick={ (e) => this.onMessageClick(e, value) }>{value.message}</a> }
		]
		return (<ReactTable data={rows} columns={columns} pageSize={ rows.length } />)
	}
}

class Messages extends Component {
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
		this.props.getMessagesList('unread')
		this.props.getMessagesList('read')
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
		{ /* <MessagePanel panelid="search" title="Search results"/ > */ }
				<MessagePanel onToggle={ this.onTogglePanel.bind(this) } panelid="new" title="New" expanded={ this.stateToPanelStatus.bind(this) } >
					<MessageTable dataSource={ this.props.unreadMessages } filter="read" currentUser={ this.props.login_data } />
				</MessagePanel>
				<MessagePanel onToggle={ this.onTogglePanel.bind(this) } panelid="old" title="Older" expanded={ this.stateToPanelStatus.bind(this) } >
					<MessageTable dataSource={ this.props.readMessages } filter="unread" currentUser={ this.props.login_data } />
				</MessagePanel>
			</div>
		</div>)
	}
}

const mapStateToProps = (state, myprops) => ({
	logged_in : logged_in(state),
	login_data : getUserData(state),
	unreadMessages : state.messages.myUnreadMessages,
	readMessages : state.messages.myReadMessages
});

const mapDispatchToProps = (dispatch, myprops) => ({
	getMessagesList : (type) => { dispatch(getUserMessages(type)); }
});

export default Messages = connect(mapStateToProps, mapDispatchToProps)(Messages)