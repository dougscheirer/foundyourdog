import React from 'react';
import { Link } from 'react-router';
import styles from './home.css';

const Home = React.createClass({
  render: function() {
    var style = "jumbotron " + styles.homemain;
    return (
      <div className={style}>
        <table>
          <tbody>
            <tr>
              <td>
                <Link to="found"><img width="50%" src="/img/found.jpg"></img></Link>
                <p>I found a dog</p>
              </td>
              <td>
                <Link to="lost"><img width="50%" src="/img/lost.jpg"></img></Link>
                <p>I lost a dog</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

export default Home;
