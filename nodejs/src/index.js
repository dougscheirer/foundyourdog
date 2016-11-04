import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import reducerOne from './app/reducers';
import { Provider } from 'react-redux'
import DevTools, { logger, crashReporter } from './app/devtools';
import thunkMiddleware from 'redux-thunk';
import './index.css';

// import routes
import Router from './app/router';

import './index.css';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunkMiddleware, logger, crashReporter),
  // applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

// careful with the initialState param, if you pass something 
// other than 'undefined' anyone supplying their own default
// in a reducer will get what you provide, e.g. {} instead of = ...
const store = createStore(reducerOne, undefined, enhancer);

ReactDOM.render(
  <Provider store={store}>
  	<Router />
  </Provider>,
  document.getElementById('root')
);
