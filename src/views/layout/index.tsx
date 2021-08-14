import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { RouteProps } from "@/router/types";

interface LayoutProps extends RouteProps {}

const Layout: React.FC<LayoutProps> = props => {
  const { routes } = props;
  return (
    <>
      <Switch>
        {routes.map((route, i) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={i}
            render={props => (
              <route.component {...props} routes={route.routes} />
            )}
          />
        ))}
        <Redirect exact from="/" to="/home" />
        <Redirect from="/*" to="/error" />
      </Switch>
    </>
  );
};

export default Layout;
