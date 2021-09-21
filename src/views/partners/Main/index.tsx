import React, {useEffect, useState} from "react";
import { Row, Col,Spin } from "antd";

import Info from './Info'
import Record from "./Record";
import Account from "./Account";
import NotOpened from "./NotOpened";
import {useDispatch, useSelector} from "react-redux";
import {BrokerModel, RootStore} from "@/store";

function Main() {
  const dispatch = useDispatch();

  const {selectedAddress,isLogin} = useSelector((state:RootStore) => state.user)
  const isBroker: boolean | undefined = useSelector(
    (state: RootStore) => state.broker.isBroker
  );
  const trader = selectedAddress;

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() =>{

    if(!trader){
      return
    }

    const getBrokerAction = BrokerModel.actions.getTraderBrokerInfo(trader);

    getBrokerAction(dispatch).then((data) => {
      setLoading(false);
    }).catch(e=>{
      console.error("getTraderBrokerInfo err", e)
    });
  },[trader,isLogin])

  return (
    <Spin spinning={loading}>
      {loading ? "" : (isBroker ? (
        <Row className="opended-container" gutter={[0, 20]}>
          <Col flex="100%">
            <Info />
          </Col>
          <Col flex="100%">
            <Account />
          </Col>
          <Col flex="100%">
            <Record />
          </Col>
        </Row>
      ) : (
        <NotOpened onOK={() =>{

        }}/>
      ))}
    </Spin>
  );
}

export default Main;
