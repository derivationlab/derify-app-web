import React, {useCallback, useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { ColumnsType } from "antd/es/table";

import {Row, Col, Table, Button, Modal, Popover, Space, Pagination} from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { MyPositionType } from "../type";
import classNames from "classnames";
import LongOrShort from "@/views/trade/LongOrShort";
import CloseModal from "@/views/trade/statistics/MyPosition/CloseModal";
import TPAndSLModal from "@/views/trade/statistics/MyPosition/TPAndSLModal";
import {getTradeBalanceDetail, getTradeList, TradeBalanceDetail, TradeRecord} from "@/api/trade";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";
import {fromContractUnit} from "@/utils/contractUtil";
import {amountFormt, dateFormat} from "@/utils/utils";
import {Pagenation} from "@/api/types";

class OpTypeEnum {
  opType:number;
  opTypeDesc:string;
  constructor(opType:number, opTypeDesc:string) {
    this.opType = opType
    this.opTypeDesc = opTypeDesc
  }
  static get OpenPosition() {
    return new OpTypeEnum(1, "Open")
  }

  static get ClosePosition() {
    return new OpTypeEnum(2, "Close")
  }
}

const tradeTypeMap:{[key:number]:any} = {
  0: {tradeType: 'Trade.TradeHistory.List.OpenMarket', opTypeEnum: OpTypeEnum.OpenPosition, showType: 'main-green'},//-MarketPriceOpen
  1: {tradeType: 'Trade.TradeHistory.List.OpenMarket', opTypeEnum: OpTypeEnum.OpenPosition, showType: 'main-green'},//-HedgeMarketPriceOpen
  2: {tradeType: 'Trade.TradeHistory.List.OpenLimit', opTypeEnum: OpTypeEnum.OpenPosition, showType: 'main-green'},//-LimitPriceOpen
  3: {tradeType: 'Trade.TradeHistory.List.CloseTPSL', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'},//-StopProfitClose
  4: {tradeType: 'Trade.TradeHistory.List.CloseTPSL', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'},//-StopLossClose
  5: {tradeType: 'Trade.TradeHistory.List.CloseDeleverage', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'},//-AutoDeleveragingClose
  6: {tradeType: 'Trade.TradeHistory.List.CloseLiquidate', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'},//-MandatoryLiquidationClose
  7: {tradeType: 'Trade.TradeHistory.List.CloseMarket', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'},//-SingleClose
  8: {tradeType: 'Trade.TradeHistory.List.CloseMarket', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'},//-AllCloseHedgePart
  9: {tradeType: 'Trade.TradeHistory.List.CloseMarket', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'main-red'}//-AllCloseLeftPart
}

function getTradeType (tradeType:number):any{
  const viewType = tradeTypeMap[tradeType]

  if(viewType) {
    return viewType
  }

  return {}
}

const TradeHistory: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [showLoading, setShowLoading] = useState<boolean>(true);


  const okCb = () => {};
  const cancelCb = () => {};
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const walletInfo = useSelector((state:RootStore) => state.user);
  const tokenPairs = useSelector((state:RootStore) => state.contract.pairs);
  const [pagenation,setPagenation] = useState<Pagenation>(new Pagenation());

  useEffect(() => {
    const trader = walletInfo.selectedAddress;
    if(!trader){
      setShowLoading(false);
      pagenation.records = [];
      pagenation.totalItems = 0;
      pagenation.current = 1;
      setPagenation(pagenation);
      return
    }

    setShowLoading(true)
    getTradeList(trader, pagenation.current, pagenation.pageSize).then((pagenation:Pagenation) => {
      setPagenation(pagenation);
    }).catch(e => {
      console.log('getTradeList',e)
    }).finally(() => setShowLoading(false))
  }, [pagenation.current,pagenation.pageSize,walletInfo])

  const getPairByAddress = (token:string) => {
    const pair = tokenPairs.find((pair) => pair.address === token)
    if(!pair){
      return {name: 'unknown', key: 'unknown'}
    }

    return pair
  }

  const columns: ColumnsType<TradeRecord> = [
    {
      title: $t("Trade.TradeHistory.List.Position"),
      dataIndex: "type",
      width: 110,
      key: "type",
      render: (_, record) => (
        <Row>
          <Col className="main-white">{getPairByAddress(record.token).name}</Col>
          <Col flex="100%">
            <LongOrShort power={0} value={record.side} />
          </Col>
        </Row>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {$t("Trade.TradeHistory.Hint.PnL")}
              </Col>
              <Col>{$t("Trade.TradeHistory.Hint.PnLDetail1")}</Col>
              <Col>{$t("Trade.TradeHistory.Hint.PnLDetail2")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {$t("Trade.TradeHistory.List.RealizedPnL")}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "pnl_usdt",
      key: "pnl_usdt",
      render: (_, record) => (
        <div>
          <div
            className={classNames(
              record.pnl_usdt < 0 ? "main-red" : "main-green"
            )}
          >
            {amountFormt(record.pnl_usdt,2,true,"--")}
          </div>
          <div>USDT</div>
        </div>
      ),
    },
    {
      title: $t("Trade.TradeHistory.List.Type"),
      dataIndex: "ph",
      key: "ph",
      render: (_, record) => (
        <div>
          <div className={getTradeType(record.type).showType}>{$t(getTradeType(record.type).tradeType+"1")}</div>
          <div>{$t(getTradeType(record.type).tradeType+"2").replace("/","")}</div>
        </div>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.TradeHistory.Hint.OrderPrice" })}
              </Col>
              <Col>{$t("Trade.TradeHistory.Hint.OrderPriceDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.TradeHistory.List.Price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "aprice",
      key: "aprice",
      render: (_, record) => (
        <div>
          <div className="main-white">{amountFormt(record.price,2,false,"--")}</div>
          <div>USDT</div>
        </div>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.TradeHistory.Hint.OrderVolume" })}
              </Col>
              <Col>{$t("Trade.TradeHistory.Hint.OrderVolumeDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.TradeHistory.List.Volume" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "margin",
      key: "margin",
      render: (_, record) => (
        <div>
          <div className="main-white">{amountFormt(record.size,2,false,"--")}</div>
          <div>{getPairByAddress(record.token).key}</div>
        </div>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.TradeHistory.Hint.OrderPrice" })}
              </Col>
              <Col>{$t("Trade.TradeHistory.Hint.OrderPriceDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.TradeHistory.List.Amount" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),

      dataIndex: "Amount",
      key: "Amount",
      render: (_, record) => (
        <div>
          <div  className="main-white">{amountFormt(record.amount,2, false, '--')}</div>
          <div>USDT</div>
        </div>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.TradeHistory.Hint.TradingFee" })}
              </Col>
              <Col>{$t("Trade.TradeHistory.Hint.TradingFeeDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.TradeHistory.List.TradFee" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "liq_price",
      key: "liq_price",
      render: (_, record) => (
        <div>
          <div className="main-white">{amountFormt(-record.trading_fee, 2, false, '--')}</div>
          <div>USDT</div>
        </div>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col> {formatMessage({ id: "Trade.TradeHistory.Hint.PCF" })}</Col>
              <Col>
                {$t("Trade.TradeHistory.Hint.PCFDetail")}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.TradeHistory.List.PCF" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "tp",
      key: "tp",
      render: (_, record) => (
        <div>
          <div className={classNames("main-white", )}>{amountFormt(-record.position_change_fee,2,false,"--")}</div>
          <div>USDT</div>
        </div>
      ),
    },
    {
      title:(
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col> {formatMessage({ id: "Trade.TradeHistory.Hint.Compensation" })}</Col>
              <Col>
                {$t("Trade.TradeHistory.Hint.CompensationDetail")}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.TradeHistory.List.Compensation" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "operate",
      key: "operate",
      render: (_, record) => (
        <div>
          <div>{amountFormt(record.pnl_bond,2,false,"--")}</div>
          <div>bDRF</div>
        </div>
      ),
    },

    {
      title: $t("Trade.TradeHistory.List.Time"),
      dataIndex: "event_time",
      key: "event_time",
      render: (_,record) => (
        <div>
          <div className="main-white">{dateFormat(new Date(record.event_time), "yyyy-MM-dd")}</div>
          <div>{dateFormat(new Date(record.event_time), "hh:mm:ss")}</div>
        </div>
      ),
    },
  ];

  const onPageChange = useCallback((pageNum, pageSize) => {
    pagenation.current = pageNum;
    if(pageSize){
      pagenation.pageSize = pageSize;
    }
    setPagenation(pagenation);
  },[]);

  return (
    <Row>
      <Col flex="100%">
        <Table dataSource={pagenation.records} columns={columns} pagination={false} rowKey={"id"} loading={showLoading}/>
      </Col>
      {
        pagenation.totalItems > 1 ? (<Col flex="100%">
          <Row justify="center">
            <Pagination pageSize={pagenation.pageSize} onChange={onPageChange} current={pagenation.current} total={pagenation.totalItems} showSizeChanger={false} />
          </Row>
        </Col>) : <></>
      }
    </Row>
  );
};

export default TradeHistory;
