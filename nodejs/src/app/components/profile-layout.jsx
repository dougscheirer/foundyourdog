import React, { Component } from 'react'
import { Link } from 'react-router'
import { Notifications, Reports, Dogs, Settings } from "./profile"
import './home.css'

class TabLink extends Component {
	render() {
		const className = (this.props.tagged) ? "box" : undefined
		return (
			<li role="presentation"
				className={ this.props.active}>
				<Link to={this.props.linkTo} role="tab" className={className}>{this.props.text}{this.props.extra}</Link>
			</li>)
	}
}

class TabContainer extends Component {

	isActiveTab(tabId) {
		return (tabId === this.props.activeTab)
	}

	getDecorator() {
		// return (<div className="numberCircle">8</div>)
		return undefined
	}

	getTabList(tabs) {
		return tabs.map( (value, key) => {
			const className = this.isActiveTab(value.props.tabId) ? "active" : "";
			return (<TabLink key={ key } active={ className } linkTo={value.props.link} text={value.props.name} extra={ this.getDecorator() } />)
		})
	}

	renderActiveTab() {
		for (let index=0; index < this.props.children.length; index++) {
			const child = this.props.children[index]
			if (this.isActiveTab(child.props.tabId)) {
				return child.props.children
			}
		}
	}

	render() {
		const tabList = this.getTabList(this.props.children);
		const activeTabObj = this.renderActiveTab()
		const { activeTab, ...rest } = this.props

		return (
			<div { ...rest } className="container">
				<ul className="nav nav-tabs" role="tablist">
					{ tabList }
				</ul>
				{ activeTabObj }
			</div>);
	}
}

class Tab extends Component {

	render() {
		return (<div>{this.props.children}</div>);
	}
}

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