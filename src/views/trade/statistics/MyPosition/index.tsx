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
import contractModel, {ContractState, PositioData} from "@/store/modules/contract"
import {useDispatch, useSelector} from "react-redux";
import {AppModel, RootStore} from "@/store";
import {Dispatch} from "redux";
import {fromContractUnit, PositionView, SideEnum} from "@/utils/contractUtil";
import {amountFormt, fck} from "@/utils/utils";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import "./index.less"


const MyPosition: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<PositionView[]>([]);

  const walletInfo = useSelector((state:RootStore) => state.user);

  const tokenPairs = useSelector((state:RootStore) => state.contract.pairs);

  const [showLoading, setShowLoading] = useState<boolean>(true);

  const [clickedPostion, setClickedPostion] = useState<PositionView>();
  const [clickedTPSLPostion, setClickedTPSLPostion] = useState<PositionView>();
  const [showClosePosition, setShowClosePosition] = useState<boolean>(true);
  const reloadTrade = useSelector((state:RootStore) => state.app.reloadDataStatus.trade)

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
    }).finally(() => setShowLoading(false))

  }, [walletInfo])

  useEffect(() => {
    loadMyPositionData()
  }, [loadMyPositionData])

  useEffect(() => {
    if(!reloadTrade){
      return;
    }
    loadMyPositionData()
  }, [reloadTrade])


  const cancelCb = () => {};


  const closeAllPosition = () => {
    Modal.confirm({
      title: formatMessage({ id: "Trade.MyPosition.ClosePositionPopup.OneClickClose" }),
      icon: null,
      visible:showClosePosition,
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
      onOk: () => {
        const trader = walletInfo.selectedAddress;
        const brokerId = walletInfo.brokerId;

        if(!trader || !brokerId){
          return
        }

        const closePositionAction = contractModel.actions.closeAllPositions(trader, brokerId);

        DerifyTradeModal.pendding();
        setShowClosePosition(false);
        closePositionAction(dispatch).then(() =>{
          DerifyTradeModal.success();
          dispatch(AppModel.actions.updateTradeLoadStatus());
        }).catch((e) => {
          DerifyTradeModal.failed();
          console.log('closePositionAction',e);
        })
      },
      onCancel: cancelCb,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const { formatMessage } = useIntl();


  function intl<T>(id:string,values:{[key:string]:T} = {}) {


    return formatMessage({id}, values)
  }

  const $t = intl;

  const columns: ColumnsType<PositionView> = [
    {
      title: intl("Trade.MyPosition.List.Position"),
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
            {amountFormt(record.unrealizedPnl, 2,true,"--", -8)}(<span>{amountFormt(record.returnRate, 2,true, "--", -6)}%</span>)
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
                {formatMessage({ id: "Trade.MyPosition.Hint.PositionHeld" })}
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
          <div className={"main-white"}>{amountFormt(record.size, 4, false,"0",-8)}</div>
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
          <div className={"main-white"}>{amountFormt(record.averagePrice,2,false,"--", -8)}</div>
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
          <div className={"main-white"}>{amountFormt(record.margin,2,false,"--",-8)}</div>
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
              <Col>{$t("Trade.MyPosition.Hint.RiskDetail", {link: (chunks:string) => <a target="_blank" href="https://docs.derify.finance/whitepaper/mechanism/risk-control/automatic-reduction-and-mandatory-liquidation">{chunks}</a>})}</Col>
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
          <div className={"main-white"}>{amountFormt(record.marginRate,2,false,"--",-6)}%</div>
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
              <Col>{$t("Trade.MyPosition.Hint.LiquidationPriceDetail", {link:(chunks:string) => <a target="_blank" href="https://docs.derify.finance/whitepaper/mechanism/risk-control/automatic-reduction-and-mandatory-liquidation">{chunks}</a>})}</Col>
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
          <div className={"main-white"}>{amountFormt(record.liquidatePrice, 2, false,"--",-8)}</div>
          <div>USDT</div>
        </div>
      ),
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <>
            <Row>
              <Col className="title" > {formatMessage({ id: "Trade.MyPosition.Hint.TakeProfitSetting" })}</Col>
              <Col>
                {$t("Trade.MyPosition.Hint.TakeProfitSettingDetail")}
              </Col>
            </Row>
            <Row>
              <Col className="title" > {formatMessage({ id: "Trade.MyPosition.Hint.StopLossSetting" })}</Col>
              <Col>
                {$t("Trade.MyPosition.Hint.StopLossSettingDetail")}
              </Col>
            </Row>
            </>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.MyPosition.List.SetTPSL" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "tp",
      key: "tp",
      render: (_, record) => (
        <Row onClick={()=> {
          setModalVisible(true)
          setClickedTPSLPostion(record)
        }}>
          <Col className="derify-pointer my-position-tp-sl-icon">
            <IconFont type="icon-shangxiaqiehuan" />
          </Col>
          <Col>
            <div className={"main-white"}> {$t("Trade.MyPosition.List.TP")}&nbsp;{amountFormt(record.stopProfitPrice,2,false,"--",-8)}</div>
            <div> {$t("Trade.MyPosition.List.StopLoss")}&nbsp;{amountFormt(record.stopLossPrice,2,false,"--",-8)}</div>
          </Col>
        </Row>
      ),
    },
    {
      dataIndex: "operate",
      key: "operate",
      render: (_,record) => (
        <WalletConnectButtonWrapper type="primary">
          <Button type="link" onClick={() => {
            setIsModalVisible(true)
            setClickedPostion(record)
          }}>
            <FormattedMessage id="Trade.MyPosition.List.Close" />&gt;
          </Button>
        </WalletConnectButtonWrapper>
      ),
    },
  ];
  return (
    <Row>
      {
        dataSource.length > 0 ? (<Col flex="100%" className="derify-trade-all-btn">
          <Row justify="end">
            <Col>
              <WalletConnectButtonWrapper type="primary">
                <Button  type="primary" size="small" onClick={closeAllPosition}  className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg ant-btn-block">
                  <FormattedMessage id="Trade.MyPosition.List.OneClickClose" />
                </Button>
              </WalletConnectButtonWrapper>
            </Col>
          </Row>
        </Col>):("")
      }
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false} rowKey="tx" loading={showLoading}/>
      </Col>
      <CloseModal
        position={clickedPostion}
        visible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      />
      <TPAndSLModal position={clickedTPSLPostion} closeModal={() => setModalVisible(false)}  visible={modalVisible} onCancel={() => setModalVisible(false)}/>
    </Row>
  );
};

export default MyPosition;
