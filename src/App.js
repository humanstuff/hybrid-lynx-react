import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LynxApp from './LynxApp';
import ReactFirst from './ReactFirst';
import ReactSecond from './ReactSecond';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/lynx/*" component={ LynxApp } />
        <Route path="/react/first" component={ ReactFirst } />
        <Route path="/react/second" component={ ReactSecond } />
        <Redirect to="/react/first" />
      </Switch>
    </Router>
  );
}

export default App;
