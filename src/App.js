import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LynxApp from './components/LynxApp';
import ReactFirst from './components/ReactFirst';
import ReactSecond from './components/ReactSecond';

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
