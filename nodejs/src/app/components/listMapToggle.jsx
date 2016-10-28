import React, { Component } from 'react';
import 'bootstrap-loader';

export default class ListMapToggle extends Component {
	render() {
		let baseclass = "btn btn-default ";
		let mapprops = { className : baseclass };
		let listprops = { className : baseclass };
		if (this.props.displaytype === 'list') {
			listprops.className += "active";
		} else {
			mapprops.className += "active";
		}
		return (
			<div>
				<button type="button" { ...mapprops } id="map" onClick={ () => { this.props.onToggle('map'); }} >M</button>
				<button type="button" { ...listprops }  id="list" onClick={() => { this.props.onToggle('list'); }} >L</button>
			</div>);
	}
}