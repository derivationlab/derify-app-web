import React from "react";
import { RouteProps } from "@/router/types";
import {Switch, Route, Redirect, useLocation} from "react-router-dom";

import "./index.less";

// export type RewardsType = "USDT" | "bDRF" | "eDRF";

interface PartnersProps extends RouteProps {}

const Partners: React.FC<PartnersProps> = props => {
  const { routes } = props;
  const location = useLocation();

  return (
    <div className="partners-page">
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
        <Redirect from="/broker" to="/broker-main" />
      </Switch>
    </div>
  );
};

export default Partners;
