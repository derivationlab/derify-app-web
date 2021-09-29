import React, {useCallback, useEffect, useState} from "react";
import { Row, Col,Spin } from "antd";

import Info from './Info'
import Record from "./Record";
import Account from "./Account";
import NotOpened from "./NotOpened";
import {useDispatch, useSelector} from "react-redux";
import {BrokerModel, RootStore} from "@/store";

function Main() {
  const dispatch = useDispatch();

  const {trader,isLogin} = useSelector((state:RootStore) => state.user)
  const isBroker: boolean | undefined = useSelector(
    (state: RootStore) => state.broker.isBroker
  );
  const reloadBrokerDataStatus = useSelector((state:RootStore) => state.app.reloadDataStatus.broker);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() =>{

    if(!trader){
      setLoading(false);
      return
    }

    const getBrokerAction = BrokerModel.actions.getTraderBrokerInfo(trader);

    getBrokerAction(dispatch).then((data) => {
      setLoading(false);
    }).catch(e=>{
      console.error("getTraderBrokerInfo err", e)
    });
  },[trader,isLogin,reloadBrokerDataStatus]);

  const [showEditModal,setShowEditModal] = useState<boolean>(false);

  const onApplyBrokerSuccess = useCallback(() => {
    setShowEditModal(true);
  }, []);

  return (
    <Spin spinning={loading}>
      {loading ? "" : ( isLogin && isBroker ? (
        <Row className="opended-container" gutter={[0, 20]}>
          <Col flex="100%">
            <Info showEditModal={showEditModal}/>
          </Col>
          <Col flex="100%">
            <Account />
          </Col>
          <Col flex="100%">
            <Record />
          </Col>
        </Row>
      ) : (
        <NotOpened onOK={onApplyBrokerSuccess}/>
      ))}
    </Spin>
  );
}

export default Main;
