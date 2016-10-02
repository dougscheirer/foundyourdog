import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// Layouts
import MainLayout from './components/main-layout';
import { LostSearchLayout, FoundSearchLayout } from './components/search-layout';

// Pages
import Home from './components/home';
import { FoundDogList, LostDogList } from './components/dog-list';
import DogProfile from './components/dog-profile';
import Signup from './components/signup';
import Signin from './components/signin';
import Feedback from './components/feedback';

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />

      <Route path="lost">
        <Route component={LostSearchLayout}>
          <IndexRoute component={LostDogList} />
        </Route>
        <Route path="new" component={Signin} />
        <Route path=":dogId" component={DogProfile} />
      </Route>

      <Route path="found">
        <Route component={FoundSearchLayout}>
          <IndexRoute component={FoundDogList} />
        </Route>
        <Route path="new" component={Signin} />
        <Route path=":dogId" component={DogProfile} />
      </Route>

      <Route path="dogs">
        <Route path=":dogId" component={DogProfile} />
      </Route>
            
      <Route path="signup" component={Signup}>
      </Route>

      <Route path="signin" component={Signin} />

      <Route path="feedback" component={Feedback} />
      
    </Route>
  </Router>
);
