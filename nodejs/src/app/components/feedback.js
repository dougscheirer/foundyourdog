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

  handleChange = this.handleChange.bind(this);
  
  render() {
    return (<h1>Feedback</h1>);
  }
}
