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

const MyPosition: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { formatMessage } = useIntl();
  const closePosition = useCallback(() => {
    Modal.confirm({
      title: formatMessage({ id: "trade.one.click.close" }),
      icon: null,
      content: (
        <div>
          <p>
            点击确定，我们将按 <span className="main-color">市价</span> 立即平仓{" "}
            <span className="main-color">全部仓位</span>
          </p>
        </div>
      ),
      okText: "确定",
      cancelText: "取消",
      onOk: okCb,
      onCancel: cancelCb,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const okCb = () => {};
  const cancelCb = () => {};

  const columns: ColumnsType<MyPositionType> = [
    {
      title: "仓位",
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
                浮动盈亏：
              </Col>
              <Col>您当前仓位的未实现盈亏金额。</Col>
              <Col>多仓浮动盈亏 = (当前价格 - 开仓均价) * 持仓量。</Col>
              <Col>空仓浮动盈亏 = (开仓均价 - 当前价格) * 持仓量。</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            浮动盈亏
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
                {formatMessage({ id: "trade.position.held" })}：
              </Col>
              <Col>持有此合约的数量</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.position.held" })}
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
                {formatMessage({ id: "trade.average.price" })}：
              </Col>
              <Col>此仓位的开仓平均价格。</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.average.price" })}
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
                {formatMessage({ id: "trade.margin" })}：
              </Col>
              <Col>此仓位的持仓占用保证金金额。</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.margin" })}
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
                {formatMessage({ id: "trade.risk" })}：
              </Col>
              <Col>保证金比例越小，仓位的风险越小。</Col>
              <Col>当保证金率为99%时仓位将被强平。</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.risk" })}
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
                {formatMessage({ id: "trade.liq.price" })}：
              </Col>
              <Col>触发强平时的价格。</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.liq.price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "margin",
      key: "margin",
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
              <Col> {formatMessage({ id: "trade.take.profit" })}：</Col>
              <Col>
                当价格达到止损设置的价格时，将自动平仓，此时仓位属于亏损状态，平仓防止继续亏损。
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.take.profit" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "margin",
      key: "margin",
      render: (_, record) => (
        <Row onClick={()=>setModalVisible(true)}>
          <Col className="derify-pointer">
            <IconFont type="icon-shangxiaqiehuan" />
          </Col>
          <Col>
            <div> 止盈{record.tp}</div>
            <div>止损{record.sl}</div>
          </Col>
        </Row>
      ),
    },
    {
      dataIndex: "operate",
      key: "operate",
      render: () => (
        <Button type="link" onClick={() => setIsModalVisible(true)}>
          <FormattedMessage id="trade.close" />
        </Button>
      ),
    },
  ];
  return (
    <Row>
      <Col flex="100%">
        <Row justify="end">
          <Col>
            <Button type="link" onClick={closePosition}>
              <FormattedMessage id="trade.one.click.close" />
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

export default MyPosition;
