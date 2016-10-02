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
                <Link to="found"><img width="100%" src="/img/found.jpg"></img>
                  <p>I found a dog</p>
                </Link>
              </td>
              <td>
                <Link to="lost"><img width="100%" src="/img/lost.jpg"></img>
                  <p>I lost a dog</p>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

export default Home;
