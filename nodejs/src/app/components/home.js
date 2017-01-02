import React from 'react';
import { Link } from 'react-router';
import './home.css';

const Home = React.createClass({
  render: function() {
    const style = "jumbotron homemain";
    return (
      <div className={style}>
        <div className="container">
          <div className="col-md-6">
            <Link to="found"><img width="100%" src="/img/found.jpg" alt="found a dog"></img>
              <p>I found a dog</p>
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="lost"><img width="100%" src="/img/lost.jpg" alt="lost a dog"></img>
              <p>I lost a dog</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
});

export default Home;
