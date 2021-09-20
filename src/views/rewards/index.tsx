import React, { useState } from "react";
import IconFont from "@/components/IconFont";
import {FormattedMessage, useIntl} from "react-intl";
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

  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl;

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
                <FormattedMessage id="Rewards.Mining.Card.PositionMining" />
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
                  <FormattedMessage id="Rewards.Mining.Card.Withdraw" />
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
                <FormattedMessage id="Rewards.Mining.Card.PositionHeld" /> (USDT)
              </Col>
              <Col flex="100%">
                <Link to={'/trade'}>
                  <Button type="primary">{$t('Rewards.Mining.Card.OpenPosition')}</Button>
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
                <FormattedMessage id="Rewards.Mining.Card.AccumulatedReward" /> (USDT)
              </Col>
              <Col flex="100%">
                <Button
                  type="link"
                  onClick={() => {
                    setThVisible(true);
                    setRewardsType("USDT");
                  }}
                >
                  <FormattedMessage id="Rewards.Mining.Card.TransactionHistory" />
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
                <FormattedMessage id="Rewards.Staking.Card.eDRFAccount" /> eDRF (eDRF)
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
                  <FormattedMessage id="Rewards.Staking.Card.Withdraw" />
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
                <FormattedMessage id="Rewards.Staking.Card.StakAmount(DRF)" />
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
                    <FormattedMessage id="Rewards.Staking.Card.Staking" />
                  </Button>
                  <Button
                    type="ghost"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("eDRF");
                      setOperateType("rewards.redeem");
                    }}
                  >
                    <FormattedMessage id="Rewards.Staking.Card.Redeem" />
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
                <FormattedMessage id="Rewards.Staking.Card.DailyYield(eDRF)" />
              </Col>
              <Col flex="100%">
                <Button
                  type="link"
                  onClick={() => {
                    setThVisible(true);
                    setRewardsType("eDRF");
                  }}
                >
                  <FormattedMessage id="Rewards.Staking.Card.TransactionHistory" />
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
                <FormattedMessage id="Rewards.Bond.Card.bDRFAccount" />
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
                    <FormattedMessage id="Rewards.Bond.Card.Withdraw" />
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("bDRF");
                      setOperateType("rewards.redeem.a");
                    }}
                  >
                    <FormattedMessage id="Rewards.Bond.Card.Exchange" />
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
                <FormattedMessage id="Rewards.Bond.Card.StakingAmount(bDRF)" />
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
                    <FormattedMessage id="Rewards.Bond.Card.Staking" />
                  </Button>
                  <Button
                    type="ghost"
                    onClick={() => {
                      setOperateVisible(true);
                      setRewardsType("bDRF");
                      setOperateType("rewards.redeem");
                    }}
                  >
                    <FormattedMessage id="Rewards.Bond.Card.Redeem" />
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
                APY
              </Col>
              <Col flex="100%">
                <Button
                  type="link"
                  onClick={() => {
                    setThVisible(true);
                    setRewardsType("bDRF");
                  }}
                >
                  <FormattedMessage id="Rewards.Bond.Card.TransactionHistory" />
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
