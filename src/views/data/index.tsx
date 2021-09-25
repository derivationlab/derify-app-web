import React from "react";
import { Row, Col } from "antd";

import PositionHeld from "./PositionHeld";
import Info from "./Info";
import SafePool from "./SafePool";
import TradingVolume from "./TradingVolume";

import "./index.less";
const Data: React.FC = () => {
  return (
    <div className="data-page">
      <Row gutter={[20, 20]}>
        <Col flex="49%">
          <TradingVolume />
        </Col>
        <Col flex="49%">
          <PositionHeld />
        </Col>
        <Col flex="49%">
          <SafePool />
        </Col>
        <Col flex="49%">
          <Info />
        </Col>
      </Row>
    </div>
  );
};

export default Data;
