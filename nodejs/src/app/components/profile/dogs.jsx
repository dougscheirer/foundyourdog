import React, { Component } from 'react'
import { logged_in } from '../helpers'
import { connect } from 'react-redux'

class Dogs extends Component {
	render() {
		if (!!!this.props.logged_in) {
			return (<div></div>)
		}
		return (<div>My dogs</div>)
	}
}

const mapStateToProps = (state, myprops) => ({
	logged_in : logged_in(state)
})

export default Dogs = connect(mapStateToProps)(Dogs)