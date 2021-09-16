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

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const columns: ColumnsType<any> = [
    {
      title: $t("Trade.CurrentOrder.List.Volume"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: $t("Trade.CurrentOrder.List.Type"),
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
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderPrice" })}
              </Col>
              <Col>
                {" "}
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
    },
    {
      dataIndex: "operate",
      key: "operate",
      width: 100,
      render: () => <Button type="link">{$t("Trade.CurrentOrder.List.Cancel")}</Button>,
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
