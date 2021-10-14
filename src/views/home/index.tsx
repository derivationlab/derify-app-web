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

interface HomeProps extends RouteProps {}
const brokerBindPath = "/broker-bind";
const tradePath = "/trade";
const brokerPath = "/broker";
let dataEventSource:EventSource|null = null;

const  RouteGuard: React.FC<HomeProps> = props => {
  const dispatch = useDispatch();
  const {routes} = props;
  const location = useLocation();

  const curPair = useSelector<RootStore, TokenPair>(state => state.contract.curPair);
  let {trader,selectedAddress,hasBroker,slefBrokerId} = useSelector((state:RootStore) => state.user);
  const {pathname} = location;
  const [RoutNode, setRoutNode] = useState(<></>);
  let rootPath = location.pathname.split("/")[1];
  let pathBrokerId = location.pathname.split("/")[2];

  let routeConfig = routes.find(
    (item) => {
      return rootPath.startsWith(item.path.replace('/', ''))
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
  },[]);

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

      const tradeMenu = routes.find(men => men.path==="/trade")

      const currentRoute = tradeMenu ? <tradeMenu.component {...props} routes={tradeMenu.routes}/> : <></>;

      if(rootPath === ''){
        setRoutNode(<Redirect to={tradePath}/>);
        return;
      }

      if(pathBrokerId != null && pathBrokerId === slefBrokerId){
        targetRoute = currentRoute;
        setRoutNode(currentRoute);
        return;
      }

      const menu = routes.find((men) => rootPath.startsWith(men.path.replace('/', '').toLowerCase()));

      if (!hasBroker) {
        if(menu && menu.path === brokerPath){
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
          setRoutNode(menu ? <menu.component {...props} routes={menu.routes}/> : <></>)
        }
        return;
      }

      //1.if bind path,redirect to trade
      //2.else render
      if(routeConfig){
        if(location.pathname.toLowerCase() !== brokerBindPath){
          setRoutNode(routeConfig ? <routeConfig.component {...props} routes={routeConfig.routes}/> : <></>)
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
