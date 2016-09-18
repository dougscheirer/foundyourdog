// var Footer = require('./Footer.react');
// var Header = require('./Header.react');
// var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../sample_store');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var MainSection = require('./Main.react');

var App = React.createClass({

  getInitialState: function() {
	  return null;
  },

  componentDidMount: function() {
    // SampleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    // SampleStore.removeChangeListener(this._onChange);
  },

  /**
	 * @return {object}
	 */
  render: function() {
    return (
      <div>
        <Header />
        <MainSection />
        <Footer />
      </div>
    );
  },

  /**
	 * Event handler for 'change' events coming from the TodoStore
	 */
  _onChange: function() {
  }

});

module.exports = App;
