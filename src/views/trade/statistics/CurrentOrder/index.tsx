import React from "react";
import IconFont from "@/components/IconFont";
import { ColumnsType } from "antd/es/table";

import { Row, Col, Table, Button,  Popover, Space } from "antd";
import { useIntl } from "react-intl";

const dataSource = [
  {
    key: "1",
    type: "ETH/USDT",
  },
  {
    key: "2",
    type: "ETH/USDT",
  },
];
function CurrentOrder() {
  const { formatMessage } = useIntl();

  const columns: ColumnsType<any> = [
    {
      title: "仓位",
      dataIndex: "type",
      key: "type",
    },
    {
      title: formatMessage({ id: "trade.current.order.type" }),
      dataIndex: "age",
      key: "age",
      width: 120,
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "trade.current.order.price" })}：
              </Col>
              <Col>
                {" "}
                {formatMessage({ id: "trade.current.order.price.ep" })}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.current.order.price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "price",
      key: "price",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "trade.current.order.volume" })}：
              </Col>
              <Col>
                {formatMessage({ id: "trade.current.order.volume.ep" })}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.current.order.volume" })}
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
              <Col className="title" flex="100%">
                {formatMessage({ id: "trade.current.order.time" })}：
              </Col>
              <Col> {formatMessage({ id: "trade.current.order.time.ep" })}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "trade.current.order.time" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "time",
      key: "time",
    },
    {
      dataIndex: "operate",
      key: "operate",
      width: 100,
      render: () => <Button type="link">取消委托</Button>,
    },
  ];

  return (
    <Row>
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Col>
    </Row>
  );
}

export default CurrentOrder;
