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
import { EditReport, NewFound, NewLost } from "./components/NewReport";
import ReportSummary from './components/report_summary'
import ProfileLayout from './components/profile-layout'
import Conversation from './components/conversation'
import ResetPasswordForm from './components/reset_password_form'

export default class Routes extends Component {
  render() {
    return (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />

      <Route path="reset">
        <Route path=":reset_token" component={ResetPasswordForm} />
      </Route>

    { /* not super happy with the routing, but tabs inside of the page make it generally weird */ }
      <Route path="profile" component={ProfileLayout} />
      <Route path="profile/*" component={ProfileLayout} />

      <Route path="conversation">
        <Route path=":incident/:message_id" component={Conversation} />
      </Route>

      <Route path="lost">
        <Route component={LostSearchLayout}>
          <IndexRoute component={LostDogs} />
        </Route>
        <Route path="new" component={NewLost} />
        <Route path="map" component={LostSearchLayout}>
          <IndexRoute component={LostDogs} />
        </Route>
        <Route path="list" component={LostSearchLayout}>
          <IndexRoute component={LostDogs} />
        </Route>
      </Route>


      <Route path="found">
        <Route component={FoundSearchLayout}>
          <IndexRoute component={FoundDogs} />
        </Route>
        <Route path="new" component={NewFound} />
        <Route path="map" component={FoundSearchLayout}>
          <IndexRoute component={FoundDogs} />
        </Route>
        <Route path="list" component={FoundSearchLayout}>
          <IndexRoute component={FoundDogs} />
        </Route>
      </Route>

      <Route path="reports">
        <Route path="edit/:reportId" component={EditReport} />
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
