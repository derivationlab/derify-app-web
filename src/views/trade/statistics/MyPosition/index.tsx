import React, {useCallback, useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { ColumnsType } from "antd/es/table";

import { Row, Col, Table, Button, Modal, Popover, Space } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { MyPositionType } from "../type";
import classNames from "classnames";
import LongOrShort from "@/views/trade/LongOrShort";
import CloseModal from "@/views/trade/statistics/MyPosition/CloseModal";
import TPAndSLModal from "@/views/trade/statistics/MyPosition/TPAndSLModal";

// const dataSource: MyPositionType[] = [
//   {
//     key: "1",
//     type: "USTD/ETH",
//     pnl_usdt: "+34.56",
//     pnl_usdt_type: "USTD",
//     pnl_usdt_percent: "12.3%",
//     power: 5,
//     ph: "1.23456789",
//     ph_type: "ETH",
//     aprice: "1234.56",
//     aprice_type: "USTD",
//     margin: "1234.56",
//     margin_type: "1234.56",
//     risk: "123%",
//     liq_price: "123.45",
//     liq_price_type: "USTD",
//     tp: "2323245445.67",
//     sl: "123.45",
//   },
//   {
//     key: "2",
//     type: "ETH/USDT",
//     pnl_usdt: "-34.56",
//     pnl_usdt_type: "USTD",
//     pnl_usdt_percent: "12.3%",
//     power: 8,
//     ph: "1.23456789",
//     ph_type: "ETH",
//     aprice: "1234.56",
//     aprice_type: "USTD",
//     margin: "1234.56",
//     margin_type: "1234.56",
//     risk: "123%",
//     liq_price: "123.45",
//     liq_price_type: "USTD",
//     tp: "2323245445.67",
//     sl: "123.45",
//   },
// ];

import contractModel, {ContractState, PositioData} from "@/store/modules/contract"
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import {Dispatch} from "redux";
import {fromContractUnit, PositionView} from "@/utils/contractUtil";
import {amountFormt, fck} from "@/utils/utils";


const MyPosition: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<PositionView[]>([]);

  const walletInfo = useSelector((state:RootStore) => state.user);

  const tokenPairs = useSelector((state:RootStore) => state.contract.pairs);

  const dispatch = useDispatch();

  const getPairByAddress = (token:string) => {
    const pair = tokenPairs.find((pair) => pair.address === token)
    if(!pair){
      return {name: 'unknown', key: 'unknown'}
    }

    return pair
  }

  const loadMyPositionData = useCallback(() => {

    const trader = walletInfo.selectedAddress
    if(!trader) {
      return
    }

    const loadPositionDataAction = contractModel.actions.loadPositionData(trader)

    loadPositionDataAction(dispatch).then((rows) => {

      if(!rows || rows.length < 1) {
        return
      }

      const positions:PositionView[] = [];
      rows.forEach(position => {

        position.positionData?.positions.forEach((positionView:PositionView) => {
          positionView.tx = "tx"+positions.length
          positions.push(positionView)
        })
      })

      setDataSource(positions)

    }).catch(e => {
      console.error(`loadPositionDataAction exception: ${e}`)
    })

  }, [walletInfo])

  useEffect(() => {
    loadMyPositionData()
  }, [loadMyPositionData])

  const closePosition = useCallback(() => {
    Modal.confirm({
      title: formatMessage({ id: "Trade.MyPosition.ClosePositionPopup.OneClickClose" }),
      icon: null,
      content: (
        <div>
          <p>
            {$t("Trade.MyPosition.ClosePositionPopup.ClosePositionPopupInfo")}
            {/*点击确定，我们将按 <span className="main-color">市价</span> 立即平仓{" "}*/}
            {/*<span className="main-color">全部仓位</span>*/}
          </p>
        </div>
      ),
      okText: $t("Trade.MyPosition.ClosePositionPopup.Confirm"),
      cancelText: $t("Trade.MyPosition.ClosePositionPopup.Cancel"),
      onOk: okCb,
      onCancel: cancelCb,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const okCb = () => {};
  const cancelCb = () => {};
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const columns: ColumnsType<PositionView> = [
    {
      title: intl("Trade.MyPosition.List.PositionHeld"),
      dataIndex: "type",
      width: 110,
      key: "type",
      render: (_, record) => (
        <Row>
          <Col className="main-white">{getPairByAddress(record.token).name}</Col>
          <Col flex="100%">
            <LongOrShort power={fromContractUnit(record.leverage)} value={record.side} />
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
                {$t("Trade.MyPosition.Hint.UnrealizedPnL")}
              </Col>
              <Col>{$t("Trade.MyPosition.Hint.UnrealizedPnLDetail1")}</Col>
              <Col>{$t("Trade.MyPosition.Hint.UnrealizedPnLDetail2")}</Col>
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
      width: 140,
      render: (_, record) => (
        <div>
          <div
            className={classNames(
              record.unrealizedPnl < 0 ? "main-red" : "main-green"
            )}
          >
            {amountFormt(record.unrealizedPnl, 4,true,"--", -8)}(<span>{amountFormt(record.returnRate, 2,true, "--", -6)}%</span>)
          </div>
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
                {formatMessage({ id: "Trade.MyPosition.Hint.PositionHeld" })}：
              </Col>
              <Col>{$t("Trade.MyPosition.Hint.PositionHeldDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.PositionHeld" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "ph",
      key: "ph",
      render: (_, record) => (
        <div>
          <div>{fromContractUnit(record.size)}</div>
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
                {formatMessage({ id: "Trade.MyPosition.Hint.AveragePrice" })}
              </Col>
              <Col>{$t("Trade.MyPosition.Hint.AveragePriceDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.AveragePrice" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "aprice",
      key: "aprice",
      render: (_, record) => (
        <div>
          <div>{amountFormt(record.averagePrice,4,false,"--", -8)}</div>
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
                {formatMessage({ id: "Trade.MyPosition.Hint.PositionMargin" })}
              </Col>
              <Col>{$t("Trade.MyPosition.Hint.PositionMarginDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.Margin" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "margin",
      key: "margin",
      render: (_, record) => (
        <div>
          <div>{amountFormt(record.margin,4,false,"--",-8)}</div>
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
                {formatMessage({ id: "Trade.MyPosition.Hint.Risk" })}
              </Col>
              <Col>{$t("Trade.MyPosition.Hint.RiskDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.Risk" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),

      dataIndex: "marginRate",
      key: "marginRate",
      render: (_, record) => (
        <div>
          <div>{amountFormt(record.marginRate,4,false,"--",-6)}</div>
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
                {formatMessage({ id: "Trade.MyPosition.Hint.LiquidationPrice" })}
              </Col>
              <Col>{$t("Trade.MyPosition.Hint.LiquidationPriceDetail")}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.LiqPrice" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "liq_price",
      key: "liq_price",
      render: (_, record) => (
        <div>
          <div>{amountFormt(record.liquidatePrice, 4, true,"--",-8)}</div>
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
              <Col> {formatMessage({ id: "Trade.MyPosition.Hint.TakeProfitSetting" })}</Col>
              <Col>
                {$t("Trade.MyPosition.Hint.TakeProfitSettingDetail")}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.TP" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "tp",
      key: "tp",
      render: (_, record) => (
        <Row onClick={()=>setModalVisible(true)}>
          <Col className="derify-pointer">
            <IconFont type="icon-shangxiaqiehuan" />
          </Col>
          <Col>
            <div> {$t("Trade.MyPosition.List.TP")}{fck(record.stopProfitPrice)}</div>
            <div> {$t("Trade.MyPosition.List.StopLoss")}{fck(record.stopProfitPrice)}</div>
          </Col>
        </Row>
      ),
    },
    {
      dataIndex: "operate",
      key: "operate",
      render: () => (
        <Button type="link" onClick={() => setIsModalVisible(true)}>
          <FormattedMessage id="Trade.MyPosition.List.Close" />&gt;
        </Button>
      ),
    },
  ];
  return (
    <Row>
      <Col flex="100%" className="derify-trade-all-btn">
        <Row justify="end">
          <Col>
            <Button  type="primary" size="small" onClick={closePosition}  className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg ant-btn-block">
              <FormattedMessage id="Trade.MyPosition.List.OneClickClose" />
            </Button>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false} rowKey="tx"/>
      </Col>
      <CloseModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
      <TPAndSLModal  visible={modalVisible} onCancel={() => setModalVisible(false)}/>
    </Row>
  );
};

export default MyPosition;
