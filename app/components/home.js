import React from 'react';
import { Link } from 'react-router';
import styles from './home.css';

const Home = React.createClass({
  render: function() {
    var style = "jumbotron " + styles.homemain;
    return (
      <div className="home-page">
        <div className={style}>
          <Link to="found"><img src="/img/found.png"></img></Link>
          <Link to="lost"><img src="/img/lost.png"></img></Link>
        </div>
      </div>
    );
  }
});

export default Home;
