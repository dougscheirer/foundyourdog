import React from 'react';
import { Link } from 'react-router';
import styles from './home.css';

const Home = React.createClass({
  render: function() {
    var style = "jumbotron " + styles.homemain;
    return (
      <div className="home-page">
        <div className={style}>
          <Link to="found"><img width="50%" src="/img/found.jpg"></img></Link>
          <Link to="lost"><img width="50%" src="/img/lost.jpg"></img></Link>
        </div>
      </div>
    );
  }
});

export default Home;
