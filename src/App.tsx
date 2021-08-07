import React from 'react';
import './App.less';
import { Provider } from "react-redux";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routes from '@/router'
import store from "./store";

export const App: React.FC<any> = props => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          {routes.map((route, i) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={props => (
                <route.component {...props} routes={route.routes} />
              )}
            />
          ))}
        </Switch>
      </Router>
    </Provider>

  )
}

export default App;
