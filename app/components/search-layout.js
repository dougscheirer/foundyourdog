import { default as React, Component } from 'react';
import styles from './home.css';

export class LostSearchLayout extends Component {
  render() {
    return (
      <div className={styles.search}>
        <header className="search-header">
          <p>Don't panic, we're here to help!</p>
          <p>Click on a marker to see dogs that have been reported found, or a map location to start a lost dog report</p>
        </header>
        <div className="search-results">
          {this.props.children}
        </div>
        <footer className="search-footer">
        </footer>
      </div>
    );
  }
};

export class FoundSearchLayout extends Component {
  render() {
    return (
      <div className={styles.search}>
        <header className="search-header">
          <p>Great job, you found someone's best friend!</p>
          <p>Click on a marker to see dogs that have been reported lost, or a map location to start a found dog report</p>
        </header>
        <div className="search-results">
          {this.props.children}
        </div>
        <footer className="search-footer">
        </footer>
      </div>
    );
  }
};

