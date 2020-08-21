import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Lynx from './Lynx';
import OrderManage from './OrderManage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/lynx/*" component={ Lynx } />
        <Route path="/react/*" component={ OrderManage } />
        <Redirect to="/react/" />
      </Switch>
    </Router>
  );
}

export default App;
