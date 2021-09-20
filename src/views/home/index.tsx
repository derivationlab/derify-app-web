import React, { useEffect } from "react";
import { RouteProps } from "@/router/types";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStore } from "@/store/index";
import Nav from "./nav";
import IntlPro from "@/locales/index";

import "./index.less";
import {bindBroker} from "@/api/broker";

interface HomeProps extends RouteProps {}
const brokerBindPath = "/partners/bind";

const Home: React.FC<HomeProps> = props => {
  const isBind: boolean | undefined = useSelector(
    (state: RootStore) => state.user.hasBroker
  );

  const { routes, history, location } = props;

  const userState = useSelector((state:RootStore) => state.user);

  useEffect(() => {
    if(isBind === undefined || userState.selectedAddress){
      return
    }

    if (!isBind) {
      const rootPath = location.pathname.split("/")[1];

      const menu = routes.find((men) => men.path.toLocaleLowerCase()===rootPath.toLocaleLowerCase());
      if(!menu){
        bindBroker({trader: userState.selectedAddress,brokerId: rootPath}).then(() => {
          history.push("/trade");
        }).catch((e) => {
          console.error("bind broker error", e);
        });
      }else{
        history.push(brokerBindPath);
      }
      return;
    }

    if(location.pathname === brokerBindPath){
      history.push("/trade");
    }else{
      history.push(location.pathname);
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
            <Redirect from="/" to="/trade" />
          </Switch>
        </div>
      </IntlPro>
    </>
  );
};

export default Home;
