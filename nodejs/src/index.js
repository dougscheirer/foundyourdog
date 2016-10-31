import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {reducer as modalReducer} from 'react-redux-modal'

// import routes
import Router from './app/router';

import './index.css';

const authForms = (state = "NOTHING", action) => {
	return state;
}

const reducers = {
  authForms: authForms,
  modals: modalReducer // <- Mounted at modals.
}

const reducer = combineReducers(reducers)
const store = createStore(reducer);

// Now we can attach the router to the 'domroot' element like this:
render(
	(<Provider store={store}>
		<Router />
		<ReduxModal />
	</Provider>),
	document.getElementById('root'));
