import React, {useCallback, useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Radio, Space, Modal, Statistic, Popover } from "antd";
import { RightOutlined } from "@ant-design/icons";

import Chart from "./chart";
import {FormattedMessage, useIntl} from "react-intl";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import contractModel, {ContractState, TokenPair} from "@/store/modules/contract"
import {RootStore} from "@/store";
import {amountFormt, fck} from "@/utils/utils";
import {fromContractUnit, OpenType, SideEnum, Token} from "@/utils/contractUtil";
import {createTokenMiningFeeEvenet} from "@/api/trade";

const timeOptions: Array<{ label: string; value: string }> = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1H" },
  { label: "4h", value: "4H" },
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
];

declare type Context = {
  tokenMiningRateEvent:EventSource|null
}
const context:Context = {
  tokenMiningRateEvent: null
}

function DataPanel() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch()
  const {formatMessage} = useIntl()


  function intl(id:string) {
    return formatMessage({id})
  }

  const contractState = useSelector<RootStore,ContractState>(state => state.contract)

  const tokenPairs = useSelector<RootStore,TokenPair[]>(state => state.contract.pairs)
  const curTokenPair = useSelector<RootStore,TokenPair>(state => state.contract.curPair)

  const $t = intl

  const curPrice = contractState.curPair.num||0


  const curPercent = contractState.curPair.percent || 0
  const pcRate = contractState.contractData.positionChangeFeeRatio || 0

  const [timeGap, setTimeGap] = useState<Partial<string>>("15m")
  const walletInfo = useSelector((state:RootStore) => state.user);
  const curPair = useSelector((state:RootStore) => state.contract.curPair);
  const [pmrRate, setPmrRate] = useState<{longPmrRate:number,shortPmrRate:number}>({longPmrRate: 0,shortPmrRate: 0})

  const loadHomeData = useCallback(() => {

    const trader = walletInfo.selectedAddress
    if(!trader){
      return
    }

    const action = contractModel.actions.loadHomeData({trader,side:SideEnum.SHORT, token: curPair.address,openType: OpenType.MarketOrder})

    dispatch(action)

  }, [walletInfo])

  useEffect(() => {
    loadHomeData()
  },[loadHomeData])

  useEffect(() => {

    if(context.tokenMiningRateEvent != null){
      context.tokenMiningRateEvent.close()
      setPmrRate({longPmrRate:0,shortPmrRate:0})
    }

    context.tokenMiningRateEvent = createTokenMiningFeeEvenet(curPair.address, (tokenAddr:string, positionMiniRate:{longPmrRate:number,shortPmrRate:number}) => {
      setPmrRate(positionMiniRate)
    })
  },[curPair])

  return (
    <Row className="main-block data-panel-container">
      <Col
        flex="100%"
        className="derify-pointer"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <span>{contractState.curPair.name}</span>
        <RightOutlined />
      </Col>
      <Col flex="100%">
        <Row justify={"space-between"} align="bottom">
          <Col>
            <Row className="trade-data">
              <Col><Statistic className={curPercent
              < 0 ? 'main-red' : 'main-green'} value={fck(curPrice,0,2)}/></Col>
              <Col>
                <span>{amountFormt(contractState.curPair.percent, 2,true, "--",0)}%</span>
              </Col>
            </Row>
          </Col>
          <Col className="text-right">
            <Row>
              <Col flex="100%">
                <Space size={4}>
                  <Popover
                    placement="bottom"
                    content={
                      <Row>
                        <Col className="title" flex="100%">
                          {intl("Trade.OpenPosition.Hint.PCFRate")}
                        </Col>
                        <Col>
                          {intl("Trade.OpenPosition.Hint.PCFRateDetail")}
                        </Col>
                      </Row>
                    }
                    trigger="hover"
                  >
                    <FormattedMessage id="Trade.OpenPosition.Kline.PCFRate" />
                    <span className={pcRate < 0 ? "main-red" :"main-green"}>: {amountFormt(pcRate, 4,true,"--",-6)}%</span>
                    <IconFont type="icon-wenhao" />
                  </Popover>
                </Space>
              </Col>
              <Col flex="100%">
                <Space size={4}>
                  {intl("Trade.OpenPosition.Kline.PMAPY")}
                  <span>
                    <span className="main-red">{$t('Trade.OpenPosition.Kline.Long')}</span> {amountFormt(pmrRate.longPmrRate,2,true,"--", 2)}%/
                    <span className="main-green">{$t('Trade.OpenPosition.Kline.Short')}</span> {amountFormt(pmrRate.shortPmrRate,2,true,"--", 2)}%
                  </span>
                  <Popover
                    placement="bottom"
                    content={
                      <Row>
                        <Col className="title" flex="100%">
                          { $t('Trade.OpenPosition.Hint.PositionMiningAPY') }
                        </Col>
                        <Col>
                          { $t('Trade.OpenPosition.Hint.PositionMiningAPYDetail') }
                        </Col>
                      </Row>
                    }
                    trigger="hover"
                  >
                    <IconFont type="icon-wenhao" />
                  </Popover>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row justify="end" className="time-radio">
          <Radio.Group
            defaultValue={timeGap}
            options={timeOptions}
            optionType="button"
            onChange={(e) => {
              const {value} = e.target
              setTimeGap(value)
            }}
          />
        </Row>
      </Col>
      <Col flex="100%">
        <Chart token={curPair.key} curPrice={curPrice} bar={timeGap}/>
      </Col>
      <Modal
        title={$t('Trade.OpenPosition.Market.Market')}
        footer={null}
        getContainer={false}
        focusTriggerAfterClose={false}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Row className="currency-list-wrapper">
          {
            tokenPairs.map((token, index) => {

              const classCurNames = []

              if(curTokenPair.key === token.key){
                classCurNames.push("active")
              }

              if(!token.enable){
                classCurNames.push("diable")
              }

              return (
                <Col flex="100%" className={classCurNames.join(" ")} key={index}
                onClick={() => {
                  if(token.enable){
                    dispatch(contractModel.actions.updateCurTokenPair(token))
                  }

                  setIsModalVisible(false)
                }}
                >
                <Row justify="space-between" align="middle">
                  <Col className="currency">{token.name}</Col>
                  <Col>
                    <div>{token.num}</div>
                    <div>
                      <Statistic
                        className={classNames(
                          (token.percent||0) > 0 ? "main-green" : "main-red "
                        )}
                        value={amountFormt(token.percent,2,true,"--",0)}
                        suffix="%"
                      />
                    </div>
                  </Col>
                </Row>
              </Col>)
            })
          }
        </Row>
      </Modal>
    </Row>
  );
}

export default DataPanel;
