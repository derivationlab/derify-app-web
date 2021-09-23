import React, {useEffect, useState} from "react";
import { Row, Col, Button, Statistic } from "antd";
import IconFont from "@/components/IconFont";

import Deposit from "./Deposit";
import OperateCom from "../../../rewards/OperateCom";

import {BrokerModel, RootStore} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {BrokerAccountInfo, BrokerState} from "@/store/modules/broker";
import {useIntl} from "react-intl";
import {fck} from "@/utils/utils";
import { Link } from "react-router-dom";
import Withdraw from "@/views/partners/Main/Account/Withdraw";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";

function Account() {

  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [operateVisible, setOperateVisible] = useState(false);
  const trader = useSelector<RootStore,string>(state => state.user.selectedAddress||"");
  const brokerState = useSelector<RootStore, BrokerState>(state => state.broker);
  const {broker} = brokerState;

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
    <Row className="main-block account-container">
      <Col flex="50%">
        <Row>
          <Col className="margin-b-l">{$t("Broker.Broker.Account.AccBalance")}(USDT)</Col>
          <Col className="large margin-b-l">
            <div className="main-color number">{fck(broker.rewardBalance, -8,2)}</div>
          </Col>
          <Col className="large margin-b-max">
            <WalletConnectButtonWrapper  type="primary">
              <Button type="ghost" onClick={()=>setOperateVisible(true)}>
                {$t("Broker.Broker.Account.Withdraw")}
              </Button>
            </WalletConnectButtonWrapper>
          </Col>
          <Col flex="100%">
            <Row className="income-wrapper">
              <Col>
                <div>{$t("Broker.Broker.Account.DailyEarning")} (USDT)</div>
                <div>
                  <Statistic value={fck(broker.todayReward, -8,2)} />
                </div>
              </Col>
              <Col>
                <div>{$t("Broker.Broker.Account.AccumulatedEarning")} (USDT)</div>
                <div>
                  <Statistic value={fck(broker.accumulatedReward, -8,2)} />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="50%">
        <Row>
          <Col className="margin-b-l">{$t("Broker.Broker.Account.PrivilegeValidDate")}（{$t("Broker.Broker.Account.Days")}）</Col>
          <Col className="large margin-b-m">
            <div className="main-color number">{fck(broker.validPeriodInDay, -8,2)}</div>
          </Col>
          <Col className="margin-b-m"> {$t("Broker.Broker.Account.ExpireDate",[broker.expireDate.getFullYear(), broker.expireDate.getMonth()+1, broker.expireDate.getDate()])}</Col>
          <Col className="margin-b-m">
            <WalletConnectButtonWrapper type="primary">
              <Button type="primary" onClick={() => setModalVisible(true)}>
                {$t("Broker.Broker.Account.Burn")}
              </Button>
            </WalletConnectButtonWrapper>
          </Col>
          <Col className="main-color">
            <Link to={`/${broker.id}`}>{$t("Broker.Broker.Account.Myreferralpage")} <IconFont type="icon-right-arr" />{" "}</Link>
          </Col>
          <Col className="explain">
            <div>{$t("Broker.Broker.Account.BrokerHint")}</div>
            <ul>
              <li>
                {$t("Broker.Broker.Account.BrokerHintDetail1")}
              </li>
              <li>
                {$t("Broker.Broker.Account.BrokerHintDetail2")}
              </li>
              <li>
                {$t("Broker.Broker.Account.BrokerHintDetail3")}
              </li>
              <li>
                {$t("Broker.Broker.Account.BrokerHintDetail4")}
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
      <Deposit visible={modalVisible}
               onSumitSuccess={() => setModalVisible(false)}
               closeModal={() => setModalVisible(false)}
               onCancel={() => setModalVisible(false)} />
      <Withdraw
        visible={operateVisible}
        onSumitSuccess={() => setOperateVisible(false)}
        closeModal={() => setOperateVisible(false)}
        onCancel={() => setOperateVisible(false)}
      />
    </Row>
  );
}

export default Account;
