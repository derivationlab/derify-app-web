import React, {useCallback, useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Radio, Space, Modal, Statistic, Popover } from "antd";
import { RightOutlined } from "@ant-design/icons";

import Chart,{timeOptions} from "./chart";
import {FormattedMessage, useIntl} from "react-intl";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import contractModel, {ContractState, TokenPair} from "@/store/modules/contract"
import {RootStore} from "@/store";
import {amountFormt, fck} from "@/utils/utils";
import {fromContractUnit, OpenType, SideEnum, Token} from "@/utils/contractUtil";
import arrow from '@/assets/images/arrowd.png'
import notice from '@/assets/images/notice.png'
import search from '@/assets/images/search.png'
import "./index.less"

declare type Context = {
  tokenMiningRateEvent:EventSource|null
}
const context:Context = {
  tokenMiningRateEvent: null
}

function DataPanel() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showList, setShowList] = useState(true);
  const dispatch = useDispatch()
  const {formatMessage} = useIntl()
  function intl<T>(id:string,values:{[key:string]:T} = {}) {
    return formatMessage({id}, values)
  }

  const $t = intl;
  const contractState = useSelector<RootStore,ContractState>(state => state.contract)
  const tokenPairs = useSelector<RootStore,TokenPair[]>(state => state.contract.pairs)
  const curTokenPair = useSelector<RootStore,TokenPair>(state => state.contract.curPair)
  const curPrice = contractState.curPair.num||0
  const curPercent = contractState.curPair.percent || 0
  const pcRate = contractState.contractData.positionChangeFeeRatio || 0
  const [timeGap, setTimeGap] = useState<Partial<string>>("1h")
  const walletInfo = useSelector((state:RootStore) => state.user);
  const curPair = useSelector((state:RootStore) => state.contract.curPair);
  const loadHomeData = useCallback(() => {
    const trader = walletInfo.selectedAddress
    if(!trader){
      return
    }
    const action = contractModel.actions.loadHomeData({trader,side:SideEnum.SHORT, token: curTokenPair.address,openType: OpenType.MarketOrder})
    dispatch(action)
  }, [walletInfo,curTokenPair])


  useEffect(() => {
    loadHomeData()
  },[loadHomeData]);

  useEffect(() => {
    if(!walletInfo.trader){
      return;
    }
    const priceChangeAction = contractModel.actions.onPriceChange(walletInfo.trader, () => {
      loadHomeData();
    });
    priceChangeAction(dispatch);
  }, [walletInfo]);

  return (
    <Row className="main-block data-panel-container">
      <Col className="list">

        <div className={`types ${showList ? 'types-active' : ''}`} onClick={() => {
          // setIsModalVisible(true);
          setShowList(!showList)
        }}>
            <div className="t">
              <span>{curTokenPair.name}</span>
              <img src={arrow} alt="" />
            </div>
            <div className="data">
              <span className="num">56789</span>
              <span className="num1">.12</span>
              <span className="per">+123.45%</span>
            </div>
        </div>
        <div className="item item0">
          <div className="t">
            <span>Net Position Rate</span>
            <img src={notice} alt="" />
          </div>
          <div className="val">
            -1.23% ( -12.34 BTC ) 
          </div>
          <div className="vl" />
        </div>
        <div className="item">
          <div className="t">
            <span>PCF Rate</span>
            <img src={notice} alt="" />
          </div>
          <div className="val">
            -1.23
          </div>
          <div className="vl" />
        </div>

        <div className="item">
          <div className="t">
            <span>Position Mining APY.</span>
            <img src={notice} alt="" />
          </div>
          <div className="val">
            13.57% <span>Long</span> / 56.78% <span>Short</span> 
          </div>
        </div>
      </Col>

      <div className="types-list-wrapper">
        {
          showList &&  <div className="types-list">
                <div className="search">
                  <div className="icon">
                    <img src={search} alt="" />
                  </div>
                  <input type="text" placeholder="Search derivatives"/>
                </div>

                <div className="lists">

                  <div className="item">
                    <div className="t">BTC - USDT</div>
                    <div className="p">56789.12</div>
                    <div className="tag">
                      <span>12.2%</span>
                    </div>
                    <div className="per">
                      <span className="n">123.45%</span>
                      <span>APY</span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="t">BTC - USDT</div>
                    <div className="p">56789.12</div>
                    <div className="tag">
                      <span className="red">12.2%</span>
                    </div>
                    <div className="per">
                      <span className="n">123.45%</span>
                      <span>APY</span>
                    </div>
                  </div>

                </div>
              </div>
            }
        </div>

      <Col flex="100%" className="chart-wrapper">
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
                    <div>{amountFormt(token.num,2,false, "--", 0)}</div>
                    <div>
                      <span
                        className={classNames(
                          (token.percent||0) > 0 ? "main-green" : "main-red "
                        )}
                      >{amountFormt(token.percent,2,true,"--",0)}%</span>
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
