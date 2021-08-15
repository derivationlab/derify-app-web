import React, { useState } from "react";
import { Row, Col, Button, Statistic } from "antd";
import IconFont from "@/components/IconFont";

import Deposit from "./Deposit";
import OperateCom from "../../../rewards/OperateCom";
function Account() {
  const [modalVisible, setModalVisible] = useState(false);
  const [operateVisible, setOperateVisible] = useState(false);
  return (
    <Row className="main-block account-container">
      <Col flex="50%">
        <Row>
          <Col className="margin-b-l">账户余额（USDT）</Col>
          <Col className="large margin-b-l">
            <div className="main-color number">23456.89</div>
          </Col>
          <Col className="large margin-b-max">
            <Button type="ghost" onClick={()=>setOperateVisible(true)}>
              提现
            </Button>
          </Col>
          <Col flex="100%">
            <Row className="income-wrapper">
              <Col>
                <div>今日收入 (USDT)</div>
                <div>
                  <Statistic value={"24697.89"} />
                </div>
              </Col>
              <Col>
                <div>累计收入 (USDT)</div>
                <div>
                  <Statistic value={"24697.89"} />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="50%">
        <Row>
          <Col className="margin-b-l">经纪商权益有效期（天）</Col>
          <Col className="large margin-b-m">
            <div className="main-color number">365</div>
          </Col>
          <Col className="margin-b-m"> 至 2048 年 12 月 31 日</Col>
          <Col className="margin-b-m">
            <Button type="primary" onClick={() => setModalVisible(true)}>
              充值
            </Button>
          </Col>
          <Col className="main-color">
            我的推广页面 <IconFont type="icon-right-arr" />{" "}
          </Col>
          <Col className="explain">
            <div>说明</div>
            <ul>
              <li>
                平台采取经纪商制度。所有的交易者只能通过访问经纪商的交易页面进行交易，Derify
                protocol并不直接面向交易者提供服务。
              </li>
              <li>
                经纪商可以持续获得手续费奖励（未来还将获得额外的DRF奖励）。
              </li>
              <li>
                经纪商需要燃烧eDRF才能保持享有该权益（当前，每600个eDRF可以维持一天的经纪商收益）。
              </li>
              <li>
                权益有效期到期后将无法获得经纪商奖励，但仍会保持经纪商身份
              </li>
              <li>您可以随时燃烧eDRF恢复经纪商奖励权益。</li>
            </ul>
          </Col>
        </Row>
      </Col>
      <Deposit visible={modalVisible} onCancel={() => setModalVisible(false)} />
      <OperateCom
        visible={operateVisible}
        type={'rewards.withdraw'}
        rewardsType={'USDT'}
        onCancel={() => setOperateVisible(false)}
      />
    </Row>
  );
}

export default Account;
