import React, {useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import {FormattedMessage, useIntl} from "react-intl";
import {Button, Col, Row, Space, Spin, Statistic} from "antd";
import {Link} from "react-router-dom";
import TransactionHistory from "./TransactionHistory";
import OperateCom, {OperateType} from "./OperateCom";

import "./index.less";
import {RewardModel, RootStore} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {fck} from "@/utils/utils";
import {RewardsType} from "@/store/modules/reward";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import {getUSDTokenName} from "@/config";


function Rewards() {
  const disoatch = useDispatch();

  const [thVisible, setThVisible] = useState(false);
  const [operateVisible, setOperateVisible] = useState(false);
  const [rewardsType, setRewardsType] = useState<RewardsType>(RewardsType.USDT);
  const trader = useSelector((state:RootStore) => state.user.selectedAddress);
  const {bondInfo,wallet,pmrBalance,pmrAccumulatedBalance,edrfInfo,accountData} = useSelector((state:RootStore) => state.reward);

  const reloadRewardDataStatus = useSelector((state:RootStore) => state.app.reloadDataStatus.reward);

  const [loadding, setLoading] = useState(true);

  const [operateType, setOperateType] =
    useState<OperateType>(OperateType.minWithdraw);

  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl;

  useEffect(() => {

    if(!trader) {
      setLoading(false);
      return
    }

    setLoading(true);
    const loadEarningDataAction = RewardModel.actions.loadEarningData(trader);
    loadEarningDataAction(disoatch).then(data => {

    }).catch((e) => {

    }).finally(() => {
      setLoading(false);
    });
  }, [trader,reloadRewardDataStatus])

  return (
      <Row className="rewards-page" gutter={[0, 20]}>
        {/*position mining start*/}
        <Col flex="100%" className="main-block">

          <Row justify="space-between">
            <Col flex="33%">
              <Row>
                <Col flex="100%" className="main-color">
                  <Statistic value={fck(pmrBalance, -8, 2)} />
                </Col>
                <Col flex="100%" className="main-white key-wrapper">
                  <FormattedMessage id="Rewards.Mining.Card.PositionMining" />（{getUSDTokenName()}）
                </Col>

                <Col>
                  <WalletConnectButtonWrapper type="primary">
                    <Space>
                      <Button
                        type="ghost"
                        onClick={() => {
                          setOperateVisible(true);
                          setRewardsType(RewardsType.USDT);
                          setOperateType(OperateType.minWithdraw);
                        }}
                      >
                        <FormattedMessage id="Rewards.Mining.Card.Withdraw" />
                      </Button>
                    </Space>
                  </WalletConnectButtonWrapper>
                </Col>
              </Row>
            </Col>
            <Col flex="33%">
              <Row>
                <Col flex="100%">
                  <Statistic value={fck(accountData.totalPositionAmount, -8, 2)} />
                </Col>
                <Col flex="100%" className="key-wrapper">
                  <FormattedMessage id="Rewards.Mining.Card.PositionHeld" /> ({getUSDTokenName()})
                </Col>
                <Col>
                  <WalletConnectButtonWrapper type="primary">
                    <Space>
                      <Link to={'/trade'}>
                        <Button type="primary">{$t('Rewards.Mining.Card.OpenPosition')}</Button>
                      </Link>
                    </Space>
                  </WalletConnectButtonWrapper>
                </Col>
              </Row>
            </Col>
            <Col flex="33%">
              <Row>
                <Col flex="100%">
                  <Statistic value={fck(pmrAccumulatedBalance, -8,2)} />
                </Col>
                <Col flex="100%" className="key-wrapper">
                  <FormattedMessage id="Rewards.Mining.Card.AccumulatedReward" /> ({getUSDTokenName()})
                </Col>
                <Col>
                  <Button
                    type="link"
                    onClick={() => {
                      setThVisible(true);
                      setRewardsType(RewardsType.USDT);
                    }}
                  >
                    <FormattedMessage id="Rewards.Mining.Card.TransactionHistory" />
                    <IconFont type="icon-right-arr" />
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify="space-between">


          </Row>

        </Col>

        {/*edrf*/}
        <Col flex="100%" className="main-block">
            <Row justify="space-between">
              <Col flex="33%">
                <Row>
                  <Col flex="100%">
                    <Statistic value={fck(edrfInfo.edrfBalance, -8,2)} />
                  </Col>
                  <Col flex="100%" className="main-white key-wrapper">
                    <FormattedMessage id="Rewards.Staking.Card.eDRFAccount" /> (eDRF)
                  </Col>
                  <Col flex="100%">
                    <WalletConnectButtonWrapper type="primary">
                      <Button
                        type="ghost"
                        onClick={() => {
                          setOperateVisible(true);
                          setRewardsType(RewardsType.eDRF);
                          setOperateType(OperateType.eDRFWithdraw);
                        }}
                      >
                        <FormattedMessage id="Rewards.Staking.Card.Withdraw" />
                      </Button>
                    </WalletConnectButtonWrapper>
                  </Col>
                </Row>
              </Col>
              <Col flex="33%">
                <Row>
                  <Col flex="100%">
                    <Statistic value={fck(edrfInfo.drfBalance, -8,2)} />
                  </Col>
                  <Col flex="100%" className="key-wrapper">
                    <FormattedMessage id="Rewards.Staking.Card.StakAmount(DRF)" />
                  </Col>
                  <Col flex="100%">
                    <WalletConnectButtonWrapper type="primary">
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            setOperateVisible(true);
                            setRewardsType(RewardsType.eDRF);
                            setOperateType(OperateType.eDRFPledge);
                          }}
                        >
                          <FormattedMessage id="Rewards.Staking.Card.Staking" />
                        </Button>
                        <Button
                          type="ghost"
                          onClick={() => {
                            setOperateVisible(true);
                            setRewardsType(RewardsType.eDRF);
                            setOperateType(OperateType.eDRFRedeem);
                          }}
                        >
                          <FormattedMessage id="Rewards.Staking.Card.Redeem" />
                        </Button>
                      </Space>
                  </WalletConnectButtonWrapper>
                  </Col>
                </Row>
              </Col>


              <Col flex="33%">
                <Row>
                  <Col flex="100%">
                    <Statistic value={fck(edrfInfo.drfBalance, -8,2)} />{" "}
                  </Col>
                  <Col flex="100%" className="key-wrapper">
                    <FormattedMessage id="Rewards.Staking.Card.DailyYield(eDRF)" />
                  </Col>
                  <Col flex="100%">
                    <Button
                      type="link"
                      onClick={() => {
                        setThVisible(true);
                        setRewardsType(RewardsType.eDRF);
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
        {/*bdrf*/}
        <Col flex="100%" className="main-block">
          <Row justify="space-between">
            <Col flex="33%">
              <Row>
                <Col flex="100%">
                  <Statistic value={fck(bondInfo.bondBalance,-8,2)} />
                </Col>
                <Col flex="100%" className="main-white key-wrapper">
                  <FormattedMessage id="Rewards.Bond.Card.bDRFAccount" />
                </Col>
                <Col flex="100%">
                  <WalletConnectButtonWrapper type="primary">
                    <Space>
                      <Button
                        type="ghost"
                        onClick={() => {
                          setOperateVisible(true);
                          setRewardsType(RewardsType.bDRF);
                          setOperateType(OperateType.bDRFWithdraw);
                        }}
                      >
                        <FormattedMessage id="Rewards.Bond.Card.Withdraw" />
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setOperateVisible(true);
                          setRewardsType(RewardsType.bDRF);
                          setOperateType(OperateType.bDRFExchange);
                        }}
                      >
                        <FormattedMessage id="Rewards.Bond.Card.Exchange" />
                      </Button>
                    </Space>
                </WalletConnectButtonWrapper>
                </Col>
              </Row>
            </Col>
            <Col flex="33%">
              <Row>
                <Col flex="100%">
                  <Statistic value={fck(bondInfo.bondReturnBalance,-8,2)} />
                </Col>
                <Col flex="100%" className="key-wrapper">
                  <FormattedMessage id="Rewards.Bond.Card.StakingAmount(bDRF)" />
                </Col>
                <Col flex="100%">
                  <WalletConnectButtonWrapper type="primary">
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          setOperateVisible(true);
                          setRewardsType(RewardsType.bDRF);
                          setOperateType(OperateType.bDRFPledge);
                        }}
                      >
                        <FormattedMessage id="Rewards.Bond.Card.Staking" />
                      </Button>
                      <Button
                        type="ghost"
                        onClick={() => {
                          setOperateVisible(true);
                          setRewardsType(RewardsType.bDRF);
                          setOperateType(OperateType.bDRFRedeem);
                        }}
                      >
                        <FormattedMessage id="Rewards.Bond.Card.Redeem" />
                      </Button>
                    </Space>
                  </WalletConnectButtonWrapper>

                </Col>
              </Row>
            </Col>
            <Col flex="33%">
              <Row>
                <Col flex="100%">
                  <Statistic value={fck(bondInfo.bondAnnualInterestRatio,-6,2)} suffix={"%"} />
                </Col>
                <Col flex="100%" className="key-wrapper">
                  {$t('Rewards.Bond.Card.APY')}
                </Col>
                <Col flex="100%">
                  <Button
                    type="link"
                    onClick={() => {
                      setThVisible(true);
                      setRewardsType(RewardsType.bDRF);
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
          closeModal={() => setOperateVisible(false)}
          visible={operateVisible}
          type={operateType}
          rewardsType={rewardsType}
          onCancel={() => setOperateVisible(false)}
        />
      </Row>
  );
}

export default Rewards;
