import React from "react";
import { Row, Col, Space } from "antd";
import { useIntl } from "react-intl";

const listArr: Array<{
  pre?: string;
  aft?: string;
  key: string;
  val: number;
  type: string;
}> = [
  { pre: "DRF", key: "data.price", val: 123.12, type: "USDT" },
  {
    pre: "DRF",
    key: "data.total.destroyed.volume",
    val: 1234567890.12,
    type: "DRF",
  },
  {
    pre: "DRF",
    aft: "(USDT)",
    key: "待回购销毁",
    val: 1234567890.12,
    type: "USDT",
  },
  { pre: "eDRF", key: "data.price", val: 9.12, type: "USDT" },
  { pre: "bDRF", key: "data.price", val: 1.01, type: "USDT" },
  { key: "data.bond.pool.balance", val: 1234567890.12, type: "USDT" },
];

function Info() {
  const { formatMessage } = useIntl();
  return (
    <Row className="main-block info-container" gutter={[0, 33]}>
      <Col flex="100%">
        <Row justify="space-between" align="middle">
          <Col className="title">{formatMessage({ id: "data.info" })}</Col>
        </Row>
      </Col>
      {listArr.map((item,i) => (
        <Col flex="100%" key={i}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size={10}>
                {item.pre}
                {formatMessage({ id: item.key })}
                {item.aft}
              </Space>
            </Col>
            <Col>
              <span className="yellow-text">{item.val}</span> {item.type}
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}

export default Info;
