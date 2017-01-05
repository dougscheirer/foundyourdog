import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class TabLink extends Component {
	render() {
		// TODO: make this work
		const className = (this.props.tagged) ? "box" : undefined
		return (
			<li role="presentation"
				className={ this.props.active}>
				<Link to={this.props.linkTo} role="tab" className={className}>{this.props.text}{this.props.extra}</Link>
			</li>)
	}
}

export class TabContainer extends Component {

	isActiveTab(tabId) {
		return (tabId === this.props.activeTab)
	}

	// TODO: make this work
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
		// this generates a warning
		// eslint-disable-next-line
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

TabContainer.propTypes = {
	activeTab : PropTypes.string.isRequired
}

export class Tab extends Component {
	render() {
		return (<div>{this.props.children}</div>);
	}
}

Tab.propTypes = {
	tabId : PropTypes.string.isRequired,
	name : PropTypes.string.isRequired,
	link : PropTypes.string.isRequired
}
