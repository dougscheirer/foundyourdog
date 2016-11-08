import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// Layouts
import MainLayout from './components/main-layout';
import { LostSearchLayout, FoundSearchLayout } from './components/search-layout';

// Pages
import Home from './components/home';
import { FoundDogs, LostDogs } from './components/dog-list';
import DogProfile from './components/dog-profile';
import Signup from './components/signup';
import Login from './components/login';
import Feedback from './components/feedback';
import { NewFound, NewLost } from "./components/NewReport";
import ReportSummary from './components/report_summary'

export default class Routes extends Component {
  render() {
    return (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />

      <Route path="lost">
        <Route component={LostSearchLayout}>
          <IndexRoute component={LostDogs} />
        </Route>
        <Route path="new" component={NewLost} />
        <Route path=":dogId" component={DogProfile} />
      </Route>

      <Route path="found">
        <Route component={FoundSearchLayout}>
          <IndexRoute component={FoundDogs} />
        </Route>
        <Route path="new" component={NewFound} />
        <Route path=":dogId" component={DogProfile} />
      </Route>

      <Route path="reports">
        <Route path=":reportId" component={ReportSummary} />
      </Route>

      <Route path="dogs">
        <Route path=":dogId" component={DogProfile} />
      </Route>

      <Route path="signup" component={Signup}>
      </Route>

      <Route path="signin" component={Login} />

      <Route path="feedback" component={Feedback} />

      <Route path="*" component={Home} />
    </Route>
  </Router>);
}};
