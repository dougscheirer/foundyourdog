var React = require("react");
var Jumbotron = require("react-bootstrap").Jumbotron;
var Button = require("react-bootstrap").Button;
var Route = require('react-router').Route

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
			<div className="homeimages">
				<a href="/found_dogs"><img className="home_img" src="img/found.jpg" alt="Found a dog" /></a>
				<a href="missing_dogs"><img className="home_img" src="img/missing.jpg" alt="Missing a dog" /></a>
			</div>
			<div className="home_stats">Stats about our app</div>
		</Jumbotron>    
	);
  }
});

module.exports = Main;