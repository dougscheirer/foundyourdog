import React from 'react';
import 'react-date-picker/index.css';
import { Calendar } from 'react-date-picker';

export default class Feedback extends React.Component {

  constructor(props) {
  	super(props);
  	this.state = {
  		startDate: '10/27/2016'
  	}
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return <Calendar
        selected={this.state.startDate}
        onChange={this.handleChange} />;
  }
}
