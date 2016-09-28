import React from 'react';

const SearchLayout = React.createClass({
  render: function() {
    return (
      <div className="search">
        <header className="search-header">
          [Header]
        </header>
        <div className="search-results">
          {this.props.children}
        </div>
        <footer className="search-footer">
          [Footer]
        </footer>
      </div>
    );
  }
});

export default SearchLayout;
