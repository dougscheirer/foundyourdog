var React = require("react");
var Jumbotron = require("react-bootstrap").Jumbotron;
var Button = require("react-bootstrap").Button;

var Main = React.createClass({ 

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  /**
	 * @return {object}
	 */
  render: function() {
    return (
		<Jumbotron>
			<h1>Hello, world!</h1>
			<p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
			<p><Button bsStyle="primary">Learn more</Button></p>
		</Jumbotron>    
	);
  }
});

module.exports = Main;