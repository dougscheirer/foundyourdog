import React from 'react';
import { Link } from 'react-router';
import 'bootstrap-loader'

const MainLayout = React.createClass({
  render: function() {
    return (
      <div className="app">
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">Found your dog!</Link>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li><Link to="/">Home</Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/signin">Sign in<span className="sr-only">(current)</span></Link></li>
              <li><Link to="/signup">Sign up<span className="sr-only">(current)</span></Link></li>
              <li><Link to="/feedback">Feedback<span className="sr-only">(current)</span></Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});

export default MainLayout;
