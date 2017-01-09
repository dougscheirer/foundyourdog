import React, { Component } from 'react'
import { Messages, Reports, Dogs, Settings } from "./profile"
import './home.css'
import { TabContainer, Tab } from './tabs'
import { connect } from 'react-redux'
import { logged_in, waiting_login } from './helpers'
import { LoginView } from './login'
import loading from './loading.svg'

class ProfileLayout extends Component {

	state = { logged_in : false }

	activePath(pathname) {
		const parts = pathname.split('/')
		for (let last = parts.length -1; last >= 0; last--) {
			if (parts[last] !== '') {
				if (parts[last].toLowerCase() === "profile")
					return 'messages';
				else
					return parts[last];
			}
		}
	}

	render() {
		// determine login status?
		if (!!this.props.waiting_login)
			return (<div>
				<img alt="loading" style={{display:"block",margin: "0 auto"}} src={ loading }></img>
				</div>)

		// not logged in?
		if (!!!this.props.logged_in)
			return (<LoginView />)

		// figure out the active tab by the last in the url path
		const active = this.activePath(this.props.location.pathname)

		return (<TabContainer activeTab={ active } >
					<Tab tabId="messages" name="My messages" link="/profile/messages">
						<Messages />
					</Tab>
					<Tab tabId="reports" name="My reports" link="/profile/reports">
						<Reports />
					</Tab>
					<Tab tabId="dogs" name="My dogs" link="/profile/dogs">
						<Dogs />
					</Tab>
					<Tab tabId="settings" name="My settings" link="/profile/settings">
						<Settings />
					</Tab>
			</TabContainer>)
	}
}

const mapStateToProps = (state, myprops) => ({
	logged_in : logged_in(state),
	waiting_login: waiting_login(state)
})

const mapDispatchToProps = (dispatch, myprops) => ({
})

export default ProfileLayout = connect(mapStateToProps, mapDispatchToProps)(ProfileLayout)