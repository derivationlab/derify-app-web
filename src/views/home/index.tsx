import React, {useCallback, useEffect, useState} from "react";
import { RouteProps } from "@/router/types";
import {Switch, Route, Redirect, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ContractModel, RootStore, UserModel} from "@/store/index";
import Nav from "./nav";
import IntlPro from "@/locales/index";

import "./index.less";
import {bindBroker} from "@/api/broker";
import Trade from "@/views/trade";
import {ReactComponent} from "*.svg";
import {useAsync} from "react-use";
import Bind from "@/views/partners/Bind";
import {createDataEvenet} from "@/api/trade";
import {TokenPair} from "@/store/modules/contract";
import {getRootPath} from "@/views/home/nav/menu";

interface HomeProps extends RouteProps {}
const brokerBindPath = "/bind";
const tradePath = "/trade";
const brokerPath = "/broker";
let dataEventSource:EventSource|null = null;

let loading = false;
const  RouteGuard: React.FC<HomeProps> = props => {
  const dispatch = useDispatch();
  const {routes} = props;
  const location = useLocation();

  const curPair = useSelector<RootStore, TokenPair>(state => state.contract.curPair);
  let {trader,selectedAddress,hasBroker,slefBrokerId} = useSelector((state:RootStore) => state.user);
  const {pathname} = location;
  const [RoutNode, setRoutNode] = useState(<></>);
  const [,rootPath, pathBrokerId] = location.pathname.split("/");
  const menuPath = getRootPath(location.pathname);


  let routeConfig = routes.find(
    (item) => {
      return `/${menuPath}` === item.path;
    }
  );

  if(!routeConfig) {
    routeConfig = routes[0];
  }


  useEffect(() => {

    if(dataEventSource){
      dataEventSource.close();
      dataEventSource = null;
    }

    dataEventSource = createDataEvenet(datas => {
      datas.forEach((data) => {
        if(data.token === curPair.address){
          dispatch({type: 'contract/SET_CONTRACT_DATA', payload:{longPmrRate: data.longPmrRate * 100, shortPmrRate: data.shortPmrRate * 100}})
        }

        const updateAllPairPriceAction = ContractModel.actions.updateAllPairPrice(trader, data.token, data.price_change_rate);
        updateAllPairPriceAction(dispatch);
      })
    });
  },[trader]);

  let targetRoute = null;
  useEffect(() => {

    if(loading){
      return;
    }

    ((async() =>{
      loading = true;
      const loadWalletAction = UserModel.actions.loadWallet();
      try{
        const walletInfo = await loadWalletAction(dispatch);

        if(!walletInfo.isLogin){
          const brokerMenu = routes.find(men => men.path === brokerPath)
          setRoutNode(brokerMenu ? <brokerMenu.component {...props} routes={brokerMenu.routes}/> : <></>);
          return;
        }

        hasBroker = walletInfo.hasBroker;
        slefBrokerId = walletInfo.slefBrokerId;
      }catch (e){
        console.error("loadWalletAction exception", e)
      }

      const tradeMenu = routes.find(men => men.path === tradePath)

      const currentRoute = tradeMenu ? <tradeMenu.component {...props} routes={tradeMenu.routes}/> : <></>;

      if(menuPath === ''){
        setRoutNode(<Redirect to={tradePath}/>);
        return;
      }
      const isBrokerReferPage = `/${rootPath}` === brokerPath && pathBrokerId;

      if(isBrokerReferPage && pathBrokerId.toLowerCase() === slefBrokerId?.toLowerCase()){
        targetRoute = currentRoute;
        setRoutNode(currentRoute);
        return;
      }

      const menu = routes.find((men) => `/${menuPath}` === men.path);

      if (!hasBroker) {
        if(isBrokerReferPage){
          const data = await bindBroker({trader: selectedAddress,brokerId: pathBrokerId});
          if(data.success){
            setRoutNode(currentRoute);
            return;
          }
        }else if(location.pathname.toLowerCase() !== brokerBindPath){
          setRoutNode(<Redirect to={brokerBindPath}/>);
          return;
        }

        if(menu){
          setRoutNode(menu ? <menu.component {...props} routes={menu.routes}/> : <></>)
        }
        return;
      }

      //1.if bind path,redirect to trade
      //2.else render
      if(routeConfig){
        const isBindBrokerPath =  location.pathname.toLowerCase() === brokerBindPath;

        if(isBindBrokerPath){
          setRoutNode(<Redirect to={tradePath}/>)
        }else{
          setRoutNode(routeConfig ? <routeConfig.component {...props} routes={routeConfig.routes}/> : <></>)
        }

      }
    })()).finally(() => {
      loading = false;
    });
  }, [location, hasBroker, selectedAddress, slefBrokerId]);

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
