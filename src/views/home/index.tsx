import React, {useCallback, useEffect, useState} from "react";
import { RouteProps } from "@/router/types";
import {Switch, Route, Redirect, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootStore, UserModel} from "@/store/index";
import Nav from "./nav";
import IntlPro from "@/locales/index";

import "./index.less";
import {bindBroker} from "@/api/broker";
import Trade from "@/views/trade";
import {ReactComponent} from "*.svg";
import {useAsync} from "react-use";

interface HomeProps extends RouteProps {}
const brokerBindPath = "/broker/bind";
const tradePath = "/trade";

const  RouteGuard: React.FC<HomeProps> = props => {
  const {routes} = props;
  const location = useLocation();
  const {selectedAddress,hasBroker,slefBrokerId} = useSelector((state:RootStore) => state.user);
  const {pathname} = location;

  let routeConfig = routes.find(
    (item) => {
      return item.path.replace(/\s*/g,"") === pathname
    }
  );

  if(!routeConfig) {
    routeConfig = routes[0];
  }

  let targetRoute = null;
  let redirectPath = null;

  useEffect(() => {
    if(hasBroker === undefined){
      targetRoute = <></>
    }else{

      const currentRoute = <Trade/>;

      const rootPath = location.pathname.split("/")[1];

      if(rootPath === slefBrokerId){
        targetRoute = currentRoute;
        return;
      }
      const menu = routes.find((men) => men.path.toLowerCase()===(`/${rootPath}`).toLowerCase());

      if (!hasBroker) {
        if(!menu){
          bindBroker({trader: selectedAddress,brokerId: rootPath}).then(() => {
            redirectPath = tradePath;
          }).catch((e) => {
            console.error("bind broker error", e);
          });
        }else if(location.pathname.toLowerCase() !== brokerBindPath){
          redirectPath = brokerBindPath;
        }
        return;
      }

      if(hasBroker && routeConfig){
        targetRoute = currentRoute;
      }
    }
  }, [location, hasBroker, selectedAddress]);

  return <>{redirectPath ? <Redirect to={redirectPath}/> : targetRoute}</>
}

const Home: React.FC<HomeProps> = props => {
  const dispatch = useDispatch();
  const { routes, history, location } = props;
  const [redirectPath,setRedirectPath] = useState<string|null>(null);

  const {selectedAddress,hasBroker,slefBrokerId} = useSelector((state:RootStore) => state.user);

  const doRedirect = useCallback((path) => {
    history.push(path)
  }, [history]);

  useEffect(() => {
    if(!selectedAddress){
      dispatch(UserModel.actions.loadWallet());
      return;
    }

    const rootPath = location.pathname.split("/")[1];

    if(rootPath === slefBrokerId){
      return;
    }
    const menu = routes.find((men) => men.path.toLowerCase()===(`/${rootPath}`).toLowerCase());

    if (!hasBroker) {
      if(!menu){
        bindBroker({trader: selectedAddress,brokerId: rootPath}).then(() => {
          doRedirect(tradePath);
        }).catch((e) => {
          console.error("bind broker error", e);
        });
      }else if(location.pathname.toLowerCase() !== brokerBindPath){
        doRedirect(brokerBindPath);
      }
      return;
    }

    if(location.pathname === brokerBindPath){
      doRedirect(tradePath);
    }else if(!menu){
      doRedirect(tradePath);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, hasBroker, selectedAddress]);

  return (
    <>
      <IntlPro>
        <Nav></Nav>
        <div className="main">
          <Switch>
            <RouteGuard {...props}/>
          </Switch>
        </div>
      </IntlPro>
    </>
  );
};

export default Home;
