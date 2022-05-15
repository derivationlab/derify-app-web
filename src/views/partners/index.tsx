import React from "react";
import { RouteProps } from "@/router/types";
import { Switch, Route } from "react-router-dom";

import "./index.less";
import { useSelector } from "react-redux";
import { RootStore } from "@/store";
import Bind from "@/views/partners/Bind";
// import BindPartners from "@/views/partners/Bind";

// export type RewardsType = "USDT" | "bDRF" | "eDRF";

interface PartnersProps extends RouteProps {}

const Partners: React.FC<PartnersProps> = props => {
  const { routes } = props;
  let { trader, isLogin, hasBroker, slefBrokerId } = useSelector(
    (state: RootStore) => state.user
  );

  if(!isLogin){
    return null;
  }

  if (!hasBroker) {
    return <Bind {...props} />;
  }

  return (
    <Switch>
      {routes.map((route, i) => (
        <Route
          path={route.path}
          exact={route.exact}
          key={i}
          render={props => <route.component {...props} routes={route.routes} />}
        />
      ))}
    </Switch>
  );
};

export default Partners;
