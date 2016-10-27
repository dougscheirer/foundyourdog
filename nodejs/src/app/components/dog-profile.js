import React from 'react';

const DogProfile = React.createClass({
  render: function() {
    return (<h1>Dog Profile for dogId: {this.props.params.dogId}</h1>);
  }
});

export default DogProfile;