import React, { useEffect } from "react";
import { RouteProps } from "@/router/types";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStore } from "@/store/index";
import Nav from "./nav";
import IntlPro from "@/locales/index";

import "./index.less";

interface HomeProps extends RouteProps {}

const Home: React.FC<HomeProps> = props => {
  const isBind: boolean | undefined = useSelector(
    (state: RootStore) => state.user.hasBroker
  );

  const { routes, history, location } = props;

  useEffect(() => {
    if(isBind === undefined){
      return
    }
    //check bind
    if (!isBind) {
      history.push("/home/partners/bind");
    }else{
      history.push("/home/trade");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isBind]);

  return (
    <>
      <IntlPro>
        <Nav></Nav>
        <div className="main">
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
            <Redirect from="/home" to="/home/trade" />
          </Switch>
        </div>
      </IntlPro>
    </>
  );
};

export default Home;
