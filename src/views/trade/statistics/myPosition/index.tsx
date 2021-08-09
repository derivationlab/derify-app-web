import React, { useCallback, useState } from "react";
import IconFont from "@/components/IconFont";

import { Row, Col, Table, Button, Modal, Popover, Space } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import CloseModal from "./CloseModal";
const dataSource = [
  {
    key: "1",
    cw: "ETH/USDT",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    cw: "ETH/USDT",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
];

const MyPosition: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const columns:any = [
    {
      title: "仓位",
      dataIndex: "cw",
      key: "cw",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
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
      dataIndex: "age",
      key: "age",
      width: 120,
    },
    {
      title: (
        <Popover
          placement="bottom"
          content="持有此合约的数量。"
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.position.held" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "address",
      key: "address",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content="此仓位的开仓平均价格。"
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.average.price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "address",
      key: "address",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content="此仓位的持仓占用保证金金额。"
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.margin" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "address",
      key: "address",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
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
      dataIndex: "address",
      key: "address",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={"触发强平时的价格。"}
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.liq.price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "address",
      key: "address",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col>
                止损设置：
                当价格达到止损设置的价格时，将自动平仓，此时仓位属于亏损状态，平仓防止继续亏损。
              </Col>
              <Col>
                止盈设置：
                当价格达到止盈设置的价格时，将自动平仓，此时仓位属于盈利状态，平仓防止盈利回撤。
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
      dataIndex: "address",
      key: "address",
    },
    {
      dataIndex: "operate",
      key: "operate",
      fixed:"right",
      width: 100,
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
      <Col>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{x:'100vw'}}
        />
      </Col>
      <CloseModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
    </Row>
  );
};

export default MyPosition;
