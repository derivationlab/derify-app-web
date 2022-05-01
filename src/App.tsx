import React from "react";
import { Provider } from "react-redux";
import "./App.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routes from "@/router";
import store from "./store";
import {createDataEvenet} from "@/api/trade";

Date.prototype.Format = function (fmt) {
  var o:{[index: string]:number|string} = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // min
    's+': this.getSeconds(), // sec
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds(), // ms
    'W': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][this.getDay()]
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]+"")
        : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

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
