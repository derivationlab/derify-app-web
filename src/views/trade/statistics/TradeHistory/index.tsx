import React, { useCallback, useState } from "react";
import IconFont from "@/components/IconFont";
import { ColumnsType } from "antd/es/table";

import { Row, Col, Table, Button, Modal, Popover, Space } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { MyPositionType } from "../type";
import classNames from "classnames";
import LongOrShort from "@/views/trade/LongOrShort";
import CloseModal from "@/views/trade/statistics/MyPosition/CloseModal";
import TPAndSLModal from "@/views/trade/statistics/MyPosition/TPAndSLModal";
const dataSource: MyPositionType[] = [
  {
    key: "1",
    type: "USTD/ETH",
    pnl_usdt: "+34.56",
    pnl_usdt_type: "USTD",
    pnl_usdt_percent: "12.3%",
    power: 5,
    ph: "1.23456789",
    ph_type: "ETH",
    aprice: "1234.56",
    aprice_type: "USTD",
    margin: "1234.56",
    margin_type: "1234.56",
    risk: "123%",
    liq_price: "123.45",
    liq_price_type: "USTD",
    tp: "2323245445.67",
    sl: "123.45",
  },
  {
    key: "2",
    type: "ETH/USDT",
    pnl_usdt: "-34.56",
    pnl_usdt_type: "USTD",
    pnl_usdt_percent: "12.3%",
    power: 8,
    ph: "1.23456789",
    ph_type: "ETH",
    aprice: "1234.56",
    aprice_type: "USTD",
    margin: "1234.56",
    margin_type: "1234.56",
    risk: "123%",
    liq_price: "123.45",
    liq_price_type: "USTD",
    tp: "2323245445.67",
    sl: "123.45",
  },
];

const TradeHistory: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const okCb = () => {};
  const cancelCb = () => {};
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const columns: ColumnsType<MyPositionType> = [
    {
      title: intl("Trade.MyPosition.List.PositionHeld"),
      dataIndex: "type",
      width: 110,
      key: "type",
      render: (_, record) => (
        <Row>
          <Col className="main-white">{record.type}</Col>
          <Col flex="100%">
            <LongOrShort power={5} value={record.pnl_usdt} />
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
            {$t("Trade.MyPosition.List.UnrealizedPnL")}
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
              record.pnl_usdt.indexOf("+") === -1 ? "main-red" : "main-green"
            )}
          >
            {record.pnl_usdt}({record.pnl_usdt_percent})
          </div>
          <div>{record.pnl_usdt_type}</div>
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
          <div>{record.ph}</div>
          <div>{record.ph_type}</div>
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
          <div>{record.aprice}</div>
          <div>{record.aprice_type}</div>
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
          <div>{record.margin}</div>
          <div>{record.margin_type}</div>
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

      dataIndex: "risk",
      key: "risk",
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
          <div>{record.liq_price}</div>
          <div>{record.liq_price_type}</div>
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
            <div> {$t("Trade.MyPosition.List.TP")}{record.tp}</div>
            <div> {$t("Trade.MyPosition.List.StopLoss")}{record.sl}</div>
          </Col>
        </Row>
      ),
    },
    {
      dataIndex: "operate",
      key: "operate",
      render: () => (
        <Button type="link" onClick={() => setIsModalVisible(true)}>
          <FormattedMessage id="Trade.MyPosition.List.Close" />
        </Button>
      ),
    },
  ];
  return (
    <Row>
      <Col flex="100%" className="derify-trade-all-btn">
        <Row justify="end">
          <Col>
            <Button type="primary" size="small" className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg ant-btn-block"
            >
              <FormattedMessage id="Trade.MyPosition.List.OneClickClose" />
            </Button>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Col>
      <CloseModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
      <TPAndSLModal  visible={modalVisible} onCancel={() => setModalVisible(false)}/>
    </Row>
  );
};

export default TradeHistory;
