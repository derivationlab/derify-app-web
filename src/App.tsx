import React from "react";
import { Provider } from "react-redux";
import "./App.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routes from "@/router";
import store from "./store";
import {asyncInitWallet, getWallet} from "@/store/modules/user";

// asyncInitWallet().then(async () => {
//   const walletInfo = await getWallet()
//   store.dispatch({type: 'user/updateWalletInfo', walletInfo})
// })

export const App: React.FC = props => {


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
  );
};

export default App;
