import React from 'react';
import ReactDOM from 'react-dom';

// Notice that we've organized all of our routes into a separate file.
import Router from './router';

require('react-datepicker/dist/react-datepicker.css');

// Now we can attach the router to the 'domroot' element like this:
ReactDOM.render(Router, document.getElementById('domroot'));
