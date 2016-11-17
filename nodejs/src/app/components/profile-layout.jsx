import React, { Component } from 'react'
import { Notifications, Reports, Dogs, Settings } from "./profile"
import './home.css'
import { TabContainer, Tab } from './tabs'

// TODO: add required proptypes for Tab and TabContainer
export default class ProfileLayout extends Component {

	activePath(pathname) {
		const parts = pathname.split('/')
		for (let last = parts.length -1; last >= 0; last--) {
			if (parts[last] !== '') {
				if (parts[last].toLowerCase() === "profile")
					return 'notifications';
				else
					return parts[last];
			}
		}
	}

	render() {
		// figure out the active tab by the last in the url path
		const active = this.activePath(this.props.location.pathname)

		return (<TabContainer activeTab={ active } >
					<Tab tabId="notifications" name="Notifications" link="/profile/notifications">
						<Notifications />
					</Tab>
					<Tab tabId="reports" name="Reports" link="/profile/reports">
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