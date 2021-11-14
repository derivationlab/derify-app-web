import React, {useEffect, useState} from "react";
import {Row, Col, Button, Avatar, Space} from "antd";
import { UserOutlined } from "@ant-design/icons";

import IconFont from "@/components/IconFont";
import Edit from "./Edit";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import {BrokerInfo, getBrokerByTrader} from "@/api/broker";
import broker, {BrokerAccountInfo, BrokerState} from "@/store/modules/broker";
import {useIntl} from "react-intl";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";
import classNames from "classnames";
import './index.less'
import {countLength} from "@/utils/utils";

declare type InfoProps = {
  showEditModal?:boolean;
}

const Info:React.FC<InfoProps> = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {isLogin,trader} = useSelector((state:RootStore) => state.user);
  const broker = useSelector<RootStore, BrokerAccountInfo>(state => state.broker.broker);
  const {formatMessage} = useIntl();
  const [showAllIntrudct, setShowAllIntrudct] = useState(false);

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  useEffect(() => {
    setIsModalVisible(!!props.showEditModal);

    if(!broker.id || !broker.name || !broker.logo){
      setIsModalVisible(true);
    }

  }, [props.showEditModal,broker]);

  const $t = intl;
  return (
    <>
      <Row justify="space-between" align="middle" className="info-container">
        <Col>
          <Row gutter={20} align="middle">
            <Col>
              <Avatar src={broker?.logo} size={64} icon={<UserOutlined />} />
            </Col>
            <Col>
              <div className="name-wrapper">{broker?.name}</div>
              <div>@{broker?.id}</div>
              <div className="intr-wrapper">
                {
                  countLength(broker.introduction) <= 300 ? <>{broker.introduction}</>:
                    <>
                      <TextOverflowView showPos={ShowPosEnum.right} text={broker.introduction} len={showAllIntrudct ? (broker||"").introduction.length : 280}></TextOverflowView>
                      <span className={"derify-link"} onClick={() => setShowAllIntrudct(!showAllIntrudct)}>{showAllIntrudct ? $t("Broker.Broker.InfoEdit.PackUp") : $t("Broker.Broker.InfoEdit.SeeMore")}</span>
                    </>
                }
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <WalletConnectButtonWrapper type="primary">
            <Button
              type="primary"
              icon={<IconFont type="icon-bianji" />}
              onClick={() => setIsModalVisible(true)}
            >
              {$t("Broker.Broker.InfoEdit.Edit")}
            </Button>
          </WalletConnectButtonWrapper>
        </Col>
        <Edit visible={isModalVisible} onSubmitSunccess={(broker) => {
          setIsModalVisible(false);
          dispatch({type:"broker/updateBroker", payload:broker});
        }} onCancel={() => setIsModalVisible(false)} />
      </Row>
    </>
  );
}

export default Info;
