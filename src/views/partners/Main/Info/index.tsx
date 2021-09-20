import React, {useEffect, useState} from "react";
import { Row, Col, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import IconFont from "@/components/IconFont";
import Edit from "./Edit";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import {BrokerInfo, getBrokerByTrader} from "@/api/broker";
import broker, {BrokerAccountInfo, BrokerState} from "@/store/modules/broker";
import {useIntl} from "react-intl";
function Info() {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const walletInfo = useSelector((state:RootStore) => state.user);
  const broker = useSelector<RootStore, BrokerAccountInfo>(state => state.broker.broker);
  const {formatMessage} = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;
  return (
    <Row justify="space-between" align="middle" className="info-container">
      <Col>
        <Row gutter={20} align="middle">
          <Col>
            <Avatar src={broker?.logo} size={64} icon={<UserOutlined />} />
          </Col>
          <Col>
            <div className="name-wrapper">{broker?.name}</div>
            <div>{broker?.broker}</div>
            <div>@{broker?.id}</div>
          </Col>
        </Row>
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<IconFont type="icon-bianji" />}
          onClick={() => setIsModalVisible(true)}
        >
          {$t("Broker.Broker.InfoEdit.Edit")}
        </Button>
      </Col>
      <Edit visible={isModalVisible} onSubmitSunccess={(broker) => {
        setIsModalVisible(false);
        dispatch({type:"broker/updateBroker", payload:broker});
      }} onCancel={() => setIsModalVisible(false)} />
    </Row>
  );
}

export default Info;
