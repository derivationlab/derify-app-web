import React, { useEffect } from "react";
import { RouteProps } from "@/router/types";
import { Switch, Route, Redirect } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootStore, UserModel} from "@/store/index";
import Nav from "./nav";
import IntlPro from "@/locales/index";

import "./index.less";
import {bindBroker} from "@/api/broker";

interface HomeProps extends RouteProps {}
const brokerBindPath = "/broker/bind";

const Home: React.FC<HomeProps> = props => {
  const dispatch = useDispatch();
  const { routes, history, location } = props;

  const {selectedAddress,hasBroker} = useSelector((state:RootStore) => state.user);

  useEffect(() => {
    if(!selectedAddress){
      dispatch(UserModel.actions.loadWallet());
      return;
    }

    if (!hasBroker) {
      const rootPath = location.pathname.split("/")[1];

      const menu = routes.find((men) => men.path.toLowerCase()===(`/${rootPath}`).toLowerCase());

      if(!menu){
        bindBroker({trader: selectedAddress,brokerId: rootPath}).then(() => {
          history.push("/trade");
        }).catch((e) => {
          console.error("bind broker error", e);
        });
      }else if(location.pathname.toLowerCase() !== brokerBindPath){
        history.push(brokerBindPath);
      }
      return;
    }

    if(location.pathname === brokerBindPath){
      history.push("/trade");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, hasBroker, selectedAddress]);

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
