import React, {useCallback, useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { ColumnsType } from "antd/es/table";

import {Row, Col, Table, Button, Popover, Space, Modal} from "antd";
import {FormattedMessage, useIntl} from "react-intl";
import contractModel, {OrderPositionData, PositioData} from "@/store/modules/contract";
import {CancelOrderedPositionTypeEnum, fromContractUnit, OrderTypeEnum, PositionView} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import {AppModel, RootStore} from "@/store";
import {amountFormt, dateFormat} from "@/utils/utils";
import LongOrShort from "@/views/trade/LongOrShort";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";

const dataSource = [
  {
    key: "1",
    type: "ETH/BUSD",
  },
  {
    key: "2",
    type: "ETH/BUSD",
  },
];
function CurrentOrder() {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const [dataSource, setDataSource] = useState<OrderPositionData[]>([]);

  const walletInfo = useSelector((state:RootStore) => state.user);

  const tokenPairs = useSelector((state:RootStore) => state.contract.pairs);
  const reloadTrade = useSelector((state:RootStore) => state.app.reloadDataStatus.trade)
  const [showLoading, setShowLoading] = useState<boolean>(true);


  const getPairByAddress = (token:string) => {
    const pair = tokenPairs.find((pair) => pair.address === token)
    if(!pair){
      return {name: 'unknown', key: 'unknown'}
    }

    return pair
  }

  const getRecordType:(data: OrderPositionData) => ([string, string] | [string, string]) = (data:OrderPositionData) => {
    if(data.orderType == OrderTypeEnum.LimitOrder) {
      const [openType, opType]=$t("Trade.CurrentOrder.List.OpenLimit").split("/")

      return [openType, opType];
    }

    if(data.orderType === OrderTypeEnum.StopProfitOrder) {
      const [openType, opType]=$t("Trade.CurrentOrder.List.CloseTP").split("/")
      return [openType, opType]
    }

    if(data.orderType === OrderTypeEnum.StopLossOrder) {
      const [openType, opType]=$t("Trade.CurrentOrder.List.CloseSL").split("/");
      return [openType, opType]
    }

    return ["",""]
  }

  const loadMyPositionData = useCallback(() => {

    const trader = walletInfo.selectedAddress
    if(!trader) {
      setShowLoading(false);
      setDataSource([]);
      return
    }

    setShowLoading(true);
    const loadPositionDataAction = contractModel.actions.loadPositionData(trader)

    loadPositionDataAction(dispatch).then((rows) => {

      if(!rows || rows.length < 1) {
        return
      }

      const positions:OrderPositionData[] = [];
      rows.forEach(position => {

        position.positionData?.orderPositions.forEach((positionView:OrderPositionData) => {
          positionView.tx = "tx" + positions.length
          positions.push(positionView)
        })
      })

      setDataSource(positions)

    }).catch(e => {
      console.error(`loadPositionDataAction exception: ${e}`)
    }).finally(() => setShowLoading(false))

  }, [walletInfo]);

  useEffect(() => {
    const priceChangeAction = contractModel.actions.onPriceChange(walletInfo.trader, () => {
      loadMyPositionData();
    });

    priceChangeAction(dispatch);
  }, []);

  const cancelCb = useCallback(() => {

  },[]);

  const cancelAll = () => {
    Modal.confirm({
      title: formatMessage({ id: "Trade.CurrentOrder.CancelOrderPopup.CancelAllOrder" }),
      icon: null,
      content: (
        <div>
          <p>
            {$t("Trade.CurrentOrder.CancelOrderPopup.CloseAllOrderInfo")}
          </p>
        </div>
      ),
      okText: $t("Trade.CurrentOrder.CancelOrderPopup.Confirm"),
      cancelText: $t("Trade.CurrentOrder.CancelOrderPopup.Cancel"),
      onOk: () => {
        const trader = walletInfo.selectedAddress;
        if(!trader) {
          return
        }


        const cancelAllOrderAction = contractModel.actions.cancleAllOrderedPositions(trader)
        DerifyTradeModal.pendding();
        cancelAllOrderAction(dispatch).then(() => {
          DerifyTradeModal.success();
          dispatch(AppModel.actions.updateTradeLoadStatus());
        }).catch(e=>{
          DerifyTradeModal.failed();
        }).finally(() => {

        })

      },
      onCancel: cancelCb,
    });
  };


  const cancelOne = (order:OrderPositionData) => {
    Modal.confirm({
      title: formatMessage({ id: "Trade.CurrentOrder.CancelOrderPopup.CancelOneOrder" }),
      icon: null,
      content: (
        <div>
          <p>
            {$t("Trade.CurrentOrder.CancelOrderPopup.CancelOneOrderInfo")}
          </p>
        </div>
      ),
      okText: $t("Trade.CurrentOrder.CancelOrderPopup.Confirm"),
      cancelText: $t("Trade.CurrentOrder.CancelOrderPopup.Confirm"),
      onOk: () => {
        const trader = walletInfo.selectedAddress;
        if(!trader) {
          return
        }

        let closeType = 0;


        if(order.orderType === OrderTypeEnum.LimitOrder){
          closeType = CancelOrderedPositionTypeEnum.LimitedOrder
        }

        if(order.orderType === OrderTypeEnum.StopLossOrder){
          closeType = CancelOrderedPositionTypeEnum.StopLossOrder
        }

        if(order.orderType === OrderTypeEnum.StopProfitOrder){
          closeType = CancelOrderedPositionTypeEnum.StopProfitOrder
        }



        const params = {
          trader,
          token:order.token,
          closeType: closeType,
          side:order.side,
          timestamp:order.timestamp
        }


        const cancelAllOrderAction = contractModel.actions.cancleOrderedPosition(params)
        DerifyTradeModal.pendding();
        cancelAllOrderAction(dispatch).then(() => {
          DerifyTradeModal.success();
          dispatch(AppModel.actions.updateTradeLoadStatus());
        }).catch(e=>{
          DerifyTradeModal.failed();
        }).finally(() => {

        })
      },
      onCancel: cancelCb,
    });
  };

  useEffect(() => {
    loadMyPositionData()
  }, [loadMyPositionData]);

  useEffect(() => {
    if(reloadTrade){
      loadMyPositionData()
    }
  }, [reloadTrade])

  const columns: ColumnsType<OrderPositionData> = [
    {
      title: $t("Trade.CurrentOrder.List.Position"),
      dataIndex: "type",
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
      title: $t("Trade.CurrentOrder.List.Type"),
      dataIndex: "orderType",
      key: "orderType",
      render: (_, record) => (
        <Row>
          <Col className="main-white">
            <div className={record.orderType == OrderTypeEnum.LimitOrder ? "main-green":"main-red"}>{getRecordType(record)[0]}</div>
            <div className={"main-white"}>{getRecordType(record)[1]}</div>
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
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderPrice" })}
              </Col>
              <Col>
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderPriceDetail" })}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.CurrentOrder.List.Price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <div>
          <div className="main-white">{amountFormt(record.orderType == OrderTypeEnum.LimitOrder ? record.price: record.stopPrice,2,false,"--",-8)}</div>
          <div>
            BUSD
          </div>
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
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderVolume" })}
              </Col>
              <Col>
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderVolumeDetail" })}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.CurrentOrder.List.Volume" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "size",
      key: "size",
      render: (_, record) => (
        <div>
          <div className="main-white">{amountFormt(record.size, 4,false,"0",-8)}</div>
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
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderTime" })}：
              </Col>
              <Col> {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderTimeDetail" })}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.CurrentOrder.List.Time" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "time",
      key: "time",
      render: (_, record) => (
        <div>
          <div className="main-white">{dateFormat(new Date(record.timestamp*1000), "yyyy-MM-dd")}</div>
          <div>{dateFormat(new Date(record.timestamp*1000), "hh:mm:ss")}</div>
        </div>
      ),
    },
    {
      dataIndex: "operate",
      key: "operate",
      width: 100,
      render: (_, record) => (<WalletConnectButtonWrapper type="primary">
        <Button type="link" onClick={() => cancelOne(record)}>{$t("Trade.CurrentOrder.List.Cancel")}&gt;</Button>
      </WalletConnectButtonWrapper>),
    },
  ];

  return (
    <Row>
      {
        dataSource.length > 0 ? (
          <Col flex="100%" className="derify-trade-all-btn">
            <Row justify="end">
              <Col>
                <WalletConnectButtonWrapper type="primary" size="small"
                                            className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg ant-btn-block">
                  <Button type="primary" size="small"
                          className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg ant-btn-block"
                          onClick={cancelAll}
                  >
                    <FormattedMessage id="Trade.CurrentOrder.List.CancelAll" />
                  </Button>
                </WalletConnectButtonWrapper>
              </Col>
            </Row>
          </Col>
        ):("")
      }
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false}  loading={showLoading} rowKey="tx" />
      </Col>
    </Row>
  );
}

export default CurrentOrder;
