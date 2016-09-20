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
	        <a href="/">iFYDO - i Found Your Dog O </a>
	      </Navbar.Brand>
	    </Navbar.Header>
	    <Nav pullRight>
	      <NavItem eventKey={1} href="/login">Sign in</NavItem>
	      <NavItem eventKey={2} href="/signup">Sign up</NavItem>
	      <NavItem eventKey={3} href="/feedback">Feedback</NavItem>
  	    </Nav>
	  </Navbar>
    );
  }
});

module.exports = Header;