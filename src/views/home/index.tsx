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
import Bind from "@/views/partners/Bind";

interface HomeProps extends RouteProps {}
const brokerBindPath = "/broker/bind";
const tradePath = "/trade";

const  RouteGuard: React.FC<HomeProps> = props => {
  const dispatch = useDispatch();
  const {routes} = props;
  const location = useLocation();
  let {selectedAddress,hasBroker,slefBrokerId} = useSelector((state:RootStore) => state.user);
  const {pathname} = location;
  const [RoutNode, setRoutNode] = useState(<></>);

  let routeConfig = routes.find(
    (item) => {
      return pathname.startsWith(item.path)
    }
  );

  if(!routeConfig) {
    routeConfig = routes[0];
  }

  let targetRoute = null;
  useEffect(() => {
    (async() =>{
      if(hasBroker === undefined){
        const loadWalletAction = UserModel.actions.loadWallet();
        try{
          const walletInfo = await loadWalletAction(dispatch);
          hasBroker = walletInfo.hasBroker;
        }catch (e){
          console.error("loadWalletAction exception", e)
        }
      }

      const currentRoute = <Trade/>;

      let rootPath = location.pathname.split("/")[1];
      if(rootPath === ''){
        setRoutNode(<Redirect to={tradePath}/>);
        return;
      }

      if(rootPath === slefBrokerId){
        targetRoute = currentRoute;
        return;
      }

      const menu = routes.find((men) => men.path.toLowerCase()===(`/${rootPath}`).toLowerCase());

      if (!hasBroker) {
        if(!menu){
          const data = await bindBroker({trader: selectedAddress,brokerId: rootPath});
          if(data.success){
            setRoutNode(<Redirect to={tradePath}/>);
            return;
          }
        }else if(location.pathname.toLowerCase() !== brokerBindPath){
          setRoutNode(<Redirect to={brokerBindPath}/>);
          return;
        }

        if(menu){
          setRoutNode(<Route
            path={menu.path}
            exact={menu.exact}
            render={(props) => menu ? <menu.component {...props} routes={menu.routes}/> : <></>}
          />)
        }
        return;
      }

      //1.if bind path,redirect to trade
      //2.else render
      if(routeConfig){
        if(location.pathname.toLowerCase() !== brokerBindPath){
          setRoutNode(<Route
            path={routeConfig.path}
            exact={routeConfig.exact}
            render={(props) => routeConfig ? <routeConfig.component {...props} routes={routeConfig.routes}/> : <></>}
          />)
        }else{
          setRoutNode(<Redirect to={tradePath}/>)
        }

      }
    })();
  }, [location, hasBroker, selectedAddress]);

  return <>{RoutNode}</>
}

const Home: React.FC<HomeProps> = props => {
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
