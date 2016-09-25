import React from 'react';
import { Link } from 'react-router';

const DogList = React.createClass({
  render: function() {
    return (
      <ul className="dog-list">
        <li><Link to="dogs/2">Michael</Link></li>
        <li><Link to="dogs/1">Ryan</Link></li>
        <li><Link to="dogs/3">Dan</Link></li>
        <li><Link to="dogs/4">Matt</Link></li>
        <li><Link to="dogs/5">Tobias</Link></li>
        <li><Link to="dogs/6">Sebastian</Link></li>
      </ul>
    );
  }
});

export default DogList;
