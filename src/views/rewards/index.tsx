import React, { useState } from "react";
import IconFont from "@/components/IconFont";
import { FormattedMessage } from "react-intl";
import { Row, Col, Button, Space, Statistic } from "antd";
import { Link } from "react-router-dom";
import TransactionHistory from "./TransactionHistory";
import OperateCom, { OperateType } from "./OperateCom";

import "./index.less";
export type RewardsType = "USDT" | "bDRF" | "eDRF";

function Rewards() {
  const [thVisible, setThVisible] = useState(false);
  const [operateVisible, setOperateVisible] = useState(false);
  const [rewardsType, setRewardsType] = useState<RewardsType>("bDRF");
  const [operateType, setOperateType] =
    useState<OperateType>("rewards.withdraw");
  return (
    <Row className="rewards-page" gutter={[0, 20]}>
      <Col flex="100%" className="main-block">
        <Row justify="space-between">
          <Col flex="33%">
            <Row>
              <Col flex="100%" className="main-color">
                <Statistic value={"23456.89"} />
              </Col>
              <Col flex="100%" className="main-white key-wrapper">
                <FormattedMessage id="rewards.position.mining" />
                （USDT）
              </Col>
              <Col flex="100%">
                <Button
                  type="ghost"
                  onClick={() => {
                    setOperateVisible(true);
                    setRewardsType("USDT");
                    setOperateType("rewards.withdraw");
                  }}
                >
                  <FormattedMessage id="rewards.withdraw" />
                </Button>
              </Col>
            </Row>
          </Col>
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"23456.89"} />
              </Col>
              <Col flex="100%" className="key-wrapper">
                <FormattedMessage id="rewards.position.held" /> (USDT)
              </Col>
              <Col flex="100%">
                <Link to={'/home/trade'}>
                  <Button type="primary">双向开仓</Button>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"23456.89"} />
              </Col>
              <Col flex="100%" className="key-wrapper">
                <FormattedMessage id="rewards.accumulated.reward" /> (USDT)
              </Col>
              <Col flex="100%">
                <Button
                  type="link"
                  onClick={() => {
                    setThVisible(true);
                    setRewardsType("USDT");
                  }}
                >
                  <FormattedMessage id="rewards.transaction.history" />
                  <IconFont type="icon-right-arr" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="100%" className="main-block">
        <Row justify="space-between">
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"0"} />
              </Col>
              <Col flex="100%" className="main-white key-wrapper">
                <FormattedMessage id="rewards.stak.equity" /> eDRF (eDRF)
              </Col>
              <Col flex="100%">
                <Button
                  type="ghost"
                  onClick={() => {
                    setOperateVisible(true);
                    setRewardsType("eDRF");
                    setOperateType("rewards.withdraw");
                  }}
                >
                  <FormattedMessage id="rewards.withdraw" />
                </Button>
              </Col>
            </Row>
          </Col>
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"12345.67"} />
              </Col>
              <Col flex="100%" className="key-wrapper">
                DRF <FormattedMessage id="rewards.stak.amount" /> （DRF）
              </Col>
              <Col flex="100%">
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("eDRF");
                      setOperateType("rewards.staking");
                    }}
                  >
                    <FormattedMessage id="rewards.staking" />
                  </Button>
                  <Button
                    type="ghost"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("eDRF");
                      setOperateType("rewards.redeem");
                    }}
                  >
                    <FormattedMessage id="rewards.redeem" />
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"112.34"} />{" "}
              </Col>
              <Col flex="100%" className="key-wrapper">
                <FormattedMessage id="rewards.daily.yield" />
                (eDRF)
              </Col>
              <Col flex="100%">
                <Button
                  type="link"
                  onClick={() => {
                    setThVisible(true);
                    setRewardsType("eDRF");
                  }}
                >
                  <FormattedMessage id="rewards.transaction.history" />
                  <IconFont type="icon-right-arr" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="100%" className="main-block">
        <Row justify="space-between">
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"0"} />
              </Col>
              <Col flex="100%" className="main-white key-wrapper">
                <FormattedMessage id="rewards.redeemable" /> bDRF (bDRF)
              </Col>
              <Col flex="100%">
                <Space>
                  <Button
                    type="ghost"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("bDRF");
                      setOperateType("rewards.withdraw");
                    }}
                  >
                    <FormattedMessage id="rewards.withdraw" />
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("bDRF");
                      setOperateType("rewards.redeem.a");
                    }}
                  >
                    <FormattedMessage id="rewards.redeem.a" />
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"12345.67"} />
              </Col>
              <Col flex="100%" className="key-wrapper">
                <FormattedMessage id="rewards.depo.amount" /> ( bDRF )
              </Col>
              <Col flex="100%">
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("bDRF");
                      setOperateType("rewards.deposit");
                    }}
                  >
                    <FormattedMessage id="rewards.deposit" />
                  </Button>
                  <Button
                    type="ghost"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("bDRF");
                      setOperateType("rewards.redeem");
                    }}
                  >
                    <FormattedMessage id="rewards.redeem" />
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col flex="33%">
            <Row>
              <Col flex="100%">
                <Statistic value={"112.34"} />
              </Col>
              <Col flex="100%" className="key-wrapper">
                年化收益
              </Col>
              <Col flex="100%">
                <Button
                  type="link"
                  onClick={() => {
                    setThVisible(true);
                    setRewardsType("bDRF");
                  }}
                >
                  <FormattedMessage id="rewards.transaction.history" />
                  <IconFont type="icon-right-arr" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <TransactionHistory
        visible={thVisible}
        type={rewardsType}
        onCancel={() => setThVisible(false)}
        footer={null}
      />
      <OperateCom
        visible={operateVisible}
        type={operateType}
        rewardsType={rewardsType}
        onCancel={() => setOperateVisible(false)}
      />
    </Row>
  );
}

export default Rewards;
