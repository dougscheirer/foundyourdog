var React = require("react");
var Navbar = require("react-bootstrap").Navbar;
var Nav = require("react-bootstrap").Nav;
var NavItem = require("react-bootstrap").NavItem;
var NavDropdown = require("react-bootstrap").NavDropdown;
var MenuItem = require("react-bootstrap").Menuitem;

var Header = React.createClass({

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  /**
	 * @return {object}
	 */
  render: function() {
    return ( 
	  <Navbar>
	    <Navbar.Header>
	      <Navbar.Brand>
	        <a href="#">React-Bootstrap</a>
	      </Navbar.Brand>
	    </Navbar.Header>
	    <Nav>
	      <NavItem eventKey={1} href="#">Link</NavItem>
	      <NavItem eventKey={2} href="#">Link</NavItem>
	    </Nav>
	  </Navbar>
    );
  }
});

module.exports = Header;